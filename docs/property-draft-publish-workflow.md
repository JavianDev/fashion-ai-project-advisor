# Property Draft and Publish Workflow

## Overview

This document outlines the complete workflow for saving property drafts and publishing listings with payment integration through the SoNoBrokers Web API.

## Workflow Steps

### 1. Save Property Draft

Users can save their property listing as a draft at any time during the creation process.

**Frontend API Call:**
```typescript
import { savePropertyDraft } from '@/lib/api/properties-api';

const draftProperty = await savePropertyDraft({
  title: "Beautiful Family Home",
  description: "A lovely 3-bedroom house...",
  price: 500000,
  // ... other property fields
});
```

**Backend Endpoint:**
- `POST /api/sonobrokers/properties/draft`
- Creates property with `status: 'draft'` and `payment_status: 'pending'`
- Returns the saved property with generated ID

### 2. Update Draft Property

Users can update their draft properties multiple times before publishing.

**Frontend API Call:**
```typescript
import { updatePropertyDraft } from '@/lib/api/properties-api';

const updatedProperty = await updatePropertyDraft(propertyId, {
  title: "Updated Title",
  price: 525000,
  // ... only fields that changed
});
```

**Backend Endpoint:**
- `PUT /api/sonobrokers/properties/{id}/draft`
- Only allows updates to properties with `status: 'draft'`
- Updates `updated_at` timestamp

### 3. Initiate Payment for Publishing

When user is ready to publish, they initiate payment through Stripe.

**Frontend Payment Flow:**
```typescript
// 1. Create Stripe checkout session
const session = await createStripeCheckoutSession({
  payment_type: 'property_listing',
  property_id: propertyId,
  country: userCountry // Determines pricing
});

// 2. Redirect to Stripe checkout
window.location.href = session.url;
```

**Backend Payment Session Creation:**
- Creates Stripe checkout session with metadata:
  - `user_id`: Current user ID
  - `payment_type`: 'property_listing'
  - `property_id`: Property ID to publish
- Pricing determined by user's country (US/CA/UAE)

### 4. Payment Completion (Webhook)

Stripe webhook automatically publishes the property upon successful payment.

**Webhook Processing:**
1. Receives `checkout.session.completed` event
2. Extracts metadata: `user_id`, `payment_type`, `property_id`
3. Records payment in `stripe_payments` table with:
   - `payment_type: 'property_listing'`
   - `property_id`: Linked to the property being published
   - `stripe_session_id`: Checkout session ID
   - Country-specific currency and amount
4. Updates property:
   - `status: 'Draft'` → `status: 'Active'`
   - `payment_status: 'pending'` → `payment_status: 'completed'`
   - Sets `published_at` timestamp
   - Records `payment_session_id`
5. Tracks analytics event for property publication
6. Triggers background media verification if not already completed

### 5. Manual Publishing (Alternative)

For admin or testing purposes, properties can be manually published.

**Frontend API Call:**
```typescript
import { publishProperty } from '@/lib/api/properties-api';

await publishProperty(propertyId, paymentSessionId);
```

**Backend Endpoint:**
- `PUT /api/sonobrokers/properties/{id}/publish`
- Requires `paymentSessionId` for audit trail
- Updates property status and timestamps

## Database Schema

### Properties Table Updates

```sql
-- Enhanced Property table with new fields
ALTER TABLE public."Property"
ADD COLUMN IF NOT EXISTS country VARCHAR(3), -- ISO country code (US, CA, UAE)
ADD COLUMN IF NOT EXISTS payment_session_id TEXT,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
```

### Enhanced Stripe Payments Table

**Note**: We now use the existing `stripe_payments` table instead of creating a duplicate `Payments` table.

```sql
-- Enhanced stripe_payments table for property listing payments
ALTER TABLE public.stripe_payments
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) DEFAULT 'subscription',
ADD COLUMN IF NOT EXISTS property_id UUID,
ADD COLUMN IF NOT EXISTS subscription_id UUID;

-- Add foreign key constraint
ALTER TABLE public.stripe_payments
ADD CONSTRAINT fk_stripe_payments_property
    FOREIGN KEY (property_id)
    REFERENCES public."Property"(id)
    ON DELETE SET NULL;
```

### New Tables for Enhanced Features

```sql
-- MediaVerifications table for background verification service
CREATE TABLE public."MediaVerifications" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID NOT NULL,
    media_url TEXT NOT NULL,
    media_type VARCHAR(50) NOT NULL,
    status INTEGER NOT NULL DEFAULT 0, -- 0=Pending, 1=Approved, 2=Rejected, 3=ManualReview
    confidence_score DECIMAL(3,2) DEFAULT 0.0,
    issues JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    verified_at TIMESTAMP WITH TIME ZONE,
    review_reason TEXT,
    requires_manual_review BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ManualReviews table for manual review system
CREATE TABLE public."ManualReviews" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL,
    review_type INTEGER NOT NULL, -- 1=Property, 2=Media
    reason TEXT NOT NULL,
    priority INTEGER NOT NULL DEFAULT 2, -- 1=Low, 2=Normal, 3=High, 4=Critical
    status INTEGER NOT NULL DEFAULT 1, -- 1=Pending, 2=InProgress, 3=Approved, 4=Rejected
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_id TEXT,
    comments TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### Draft Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sonobrokers/properties/draft` | Save new property draft |
| PUT | `/api/sonobrokers/properties/{id}/draft` | Update existing draft |
| GET | `/api/sonobrokers/properties/drafts` | Get user's draft properties |

### Publishing

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/sonobrokers/properties/{id}/publish` | Manually publish property |
| GET | `/api/sonobrokers/properties/published` | Get user's published properties |

### Payment Integration

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/core/stripe/create-checkout-session` | Create payment session |
| POST | `/api/core/stripe/webhook` | Handle payment completion |

## Frontend Integration

### Property Listing Form

The responsive property listing form should integrate with the draft/publish workflow:

```typescript
// Auto-save draft every 30 seconds
useEffect(() => {
  const interval = setInterval(async () => {
    if (formData.id) {
      await updatePropertyDraft(formData.id, formData);
    } else {
      const draft = await savePropertyDraft(formData);
      setFormData(prev => ({ ...prev, id: draft.id }));
    }
  }, 30000);

  return () => clearInterval(interval);
}, [formData]);

// Save draft button
const handleSaveDraft = async () => {
  setIsDraftSaving(true);
  try {
    if (formData.id) {
      await updatePropertyDraft(formData.id, formData);
    } else {
      const draft = await savePropertyDraft(formData);
      setFormData(prev => ({ ...prev, id: draft.id }));
    }
    toast.success('Draft saved successfully');
  } catch (error) {
    toast.error('Failed to save draft');
  } finally {
    setIsDraftSaving(false);
  }
};

// Publish button
const handlePublish = async () => {
  setIsSubmitting(true);
  try {
    // Ensure draft is saved first
    if (!formData.id) {
      const draft = await savePropertyDraft(formData);
      setFormData(prev => ({ ...prev, id: draft.id }));
    }

    // Create payment session and redirect to Stripe
    const session = await createStripeCheckoutSession({
      payment_type: 'property_listing',
      property_id: formData.id,
      country: userCountry
    });

    window.location.href = session.url;
  } catch (error) {
    toast.error('Failed to initiate payment');
  } finally {
    setIsSubmitting(false);
  }
};
```

## Error Handling

### Common Error Scenarios

1. **Draft Save Failure**
   - Network connectivity issues
   - Validation errors
   - Authentication expiry

2. **Payment Processing Errors**
   - Stripe checkout session creation failure
   - Payment declined
   - Webhook processing failure

3. **Publishing Errors**
   - Property not found
   - Property not in draft status
   - User permission issues

### Error Recovery

- **Auto-retry**: Implement exponential backoff for transient failures
- **Local Storage**: Cache form data locally to prevent data loss
- **User Feedback**: Clear error messages with suggested actions
- **Manual Recovery**: Admin tools to manually publish properties if webhook fails

## Testing

### Unit Tests

```typescript
describe('Property Draft/Publish Workflow', () => {
  test('should save property draft', async () => {
    const draft = await savePropertyDraft(mockPropertyData);
    expect(draft.status).toBe('draft');
    expect(draft.paymentStatus).toBe('pending');
  });

  test('should update existing draft', async () => {
    const updated = await updatePropertyDraft(draftId, { title: 'New Title' });
    expect(updated.title).toBe('New Title');
  });

  test('should publish property after payment', async () => {
    await publishProperty(propertyId, sessionId);
    const property = await getPropertyById(propertyId);
    expect(property.status).toBe('active');
    expect(property.publishedAt).toBeDefined();
  });
});
```

### Integration Tests

- Test complete workflow from draft creation to publication
- Test webhook processing with mock Stripe events
- Test error scenarios and recovery mechanisms

## Monitoring and Analytics

### Key Metrics

- **Draft Conversion Rate**: Percentage of drafts that get published
- **Payment Success Rate**: Percentage of successful payments
- **Time to Publish**: Average time from draft creation to publication
- **Abandonment Points**: Where users drop off in the workflow

### Logging

- All draft saves and updates
- Payment session creations
- Webhook processing events
- Publishing success/failure events

## Security Considerations

### Data Protection

- Drafts contain sensitive property information
- Ensure proper user authentication and authorization
- Encrypt sensitive data in transit and at rest

### Payment Security

- Never store payment card information
- Use Stripe's secure checkout process
- Validate webhook signatures to prevent fraud
- Implement idempotency for webhook processing

## Future Enhancements

### Planned Features

1. **Auto-save**: Automatic draft saving every 30 seconds
2. **Collaboration**: Multiple users editing the same draft
3. **Version History**: Track changes to draft properties
4. **Bulk Publishing**: Publish multiple properties at once
5. **Scheduled Publishing**: Publish properties at specific times

### Performance Optimizations

1. **Caching**: Cache draft data for faster loading
2. **Compression**: Compress large property descriptions and images
3. **Background Processing**: Process media uploads in background
4. **CDN Integration**: Serve property images from CDN

## Conclusion

The draft and publish workflow provides a seamless experience for users to create property listings while ensuring payment is collected before publication. The integration with Stripe webhooks ensures reliable payment processing and automatic property publishing.
