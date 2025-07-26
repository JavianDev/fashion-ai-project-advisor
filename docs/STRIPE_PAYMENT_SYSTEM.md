# SoNoBrokers Stripe Payment System

## Overview

SoNoBrokers uses a unified Stripe payment infrastructure that handles both subscription payments and property listing payments through the existing `stripe_*` table ecosystem.

## Architecture

### Database Tables

#### Primary Payment Table: `stripe_payments`
```sql
-- Enhanced stripe_payments table structure
CREATE TABLE public.stripe_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    stripe_payment_intent_id TEXT,
    stripe_session_id TEXT, -- NEW: For checkout sessions
    amount BIGINT NOT NULL, -- Amount in cents
    currency VARCHAR(3) NOT NULL DEFAULT 'usd',
    status VARCHAR(50) NOT NULL,
    payment_type VARCHAR(50) DEFAULT 'subscription', -- NEW: subscription, property_listing
    property_id UUID, -- NEW: For property listing payments
    subscription_id UUID, -- NEW: For subscription payments
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Supporting Tables
- `stripe_customers`: Customer management
- `stripe_subscriptions`: Subscription tracking
- `stripe_products`: Product definitions
- `stripe_prices`: Pricing information
- `stripe_invoices`: Invoice tracking
- `stripe_webhook_events`: Webhook event logging

### Payment Types

#### 1. Subscription Payments (`payment_type: 'subscription'`)
- Monthly/yearly recurring billing
- User access to platform features
- Automatic renewal handling
- Proration for plan changes

#### 2. Property Listing Payments (`payment_type: 'property_listing'`)
- One-time payment for publishing property
- Country-specific pricing (USD, CAD, AED)
- Linked to specific property via `property_id`
- Triggers property status change from Draft → Active

## Multi-Country Pricing

### Supported Currencies and Regions

| Country | Currency | Property Listing Price |
|---------|----------|----------------------|
| United States | USD | $99.00 |
| Canada | CAD | $129.00 |
| UAE | AED | $365.00 |

### Price Configuration
Prices are configured in Stripe Dashboard and retrieved via API:
```typescript
const getPricingByCountry = (country: string) => {
  const pricing = {
    'US': { currency: 'usd', amount: 9900 }, // $99.00
    'CA': { currency: 'cad', amount: 12900 }, // $129.00
    'UAE': { currency: 'aed', amount: 36500 } // $365.00
  };
  return pricing[country] || pricing['US'];
};
```

## Payment Workflows

### Property Listing Payment Flow

1. **Initiate Payment**
   ```typescript
   // Frontend: Create checkout session
   const session = await createStripeCheckoutSession({
     payment_type: 'property_listing',
     property_id: propertyId,
     country: userCountry
   });
   
   // Redirect to Stripe Checkout
   window.location.href = session.url;
   ```

2. **Stripe Checkout Session Creation**
   ```csharp
   // Backend: Create session with metadata
   var sessionOptions = new SessionCreateOptions
   {
       PaymentMethodTypes = new List<string> { "card" },
       LineItems = new List<SessionLineItemOptions>
       {
           new SessionLineItemOptions
           {
               PriceData = new SessionLineItemPriceDataOptions
               {
                   UnitAmount = amount, // Country-specific amount
                   Currency = currency,
                   ProductData = new SessionLineItemPriceDataProductDataOptions
                   {
                       Name = "Property Listing Publication"
                   }
               },
               Quantity = 1
           }
       },
       Mode = "payment",
       SuccessUrl = $"{baseUrl}/property/published?session_id={{CHECKOUT_SESSION_ID}}",
       CancelUrl = $"{baseUrl}/property/draft/{propertyId}",
       Metadata = new Dictionary<string, string>
       {
           ["user_id"] = userId,
           ["payment_type"] = "property_listing",
           ["property_id"] = propertyId,
           ["country"] = country
       }
   };
   ```

3. **Webhook Processing**
   ```csharp
   // Handle checkout.session.completed event
   if (stripeEvent.Type == Events.CheckoutSessionCompleted)
   {
       var session = stripeEvent.Data.Object as Session;
       var metadata = session.Metadata;
       
       if (metadata["payment_type"] == "property_listing")
       {
           // Record payment in stripe_payments table
           await RecordPropertyListingPayment(session, metadata);
           
           // Update property status to Active
           await PublishProperty(metadata["property_id"], session.Id);
           
           // Track analytics
           await TrackPropertyPublicationEvent(metadata["property_id"]);
       }
   }
   ```

### Subscription Payment Flow

1. **Create Customer and Subscription**
2. **Handle recurring billing via webhooks**
3. **Manage subscription lifecycle (upgrades, downgrades, cancellations)**

## API Endpoints

### Property Listing Payments
```
POST /api/core/stripe/create-checkout-session
- Creates Stripe checkout session for property listing
- Body: { payment_type: 'property_listing', property_id: string, country: string }

POST /api/core/stripe/webhook
- Handles all Stripe webhook events
- Processes payment completions and updates property status
```

### Subscription Payments
```
POST /api/core/stripe/create-subscription
- Creates new subscription for user
- Body: { price_id: string, customer_id?: string }

POST /api/core/stripe/cancel-subscription
- Cancels existing subscription
- Body: { subscription_id: string }
```

## Webhook Event Handling

### Supported Events

#### Property Listing Events
- `checkout.session.completed`: Property listing payment completed
- `payment_intent.succeeded`: Payment confirmation
- `payment_intent.payment_failed`: Payment failure handling

#### Subscription Events
- `customer.subscription.created`: New subscription
- `customer.subscription.updated`: Subscription changes
- `customer.subscription.deleted`: Subscription cancellation
- `invoice.payment_succeeded`: Successful recurring payment
- `invoice.payment_failed`: Failed recurring payment

### Event Processing
```csharp
public async Task<IActionResult> HandleWebhook()
{
    var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
    var stripeEvent = EventUtility.ConstructEvent(json, signature, webhookSecret);
    
    switch (stripeEvent.Type)
    {
        case Events.CheckoutSessionCompleted:
            await HandleCheckoutSessionCompleted(stripeEvent);
            break;
            
        case Events.CustomerSubscriptionCreated:
            await HandleSubscriptionCreated(stripeEvent);
            break;
            
        // ... other event handlers
    }
    
    return Ok();
}
```

## Security and Compliance

### Webhook Security
- Verify webhook signatures using Stripe's signature verification
- Use HTTPS endpoints for all webhook URLs
- Implement idempotency to handle duplicate events

### Data Protection
- Never store payment card information
- Use Stripe's secure tokenization
- Encrypt sensitive metadata
- Implement proper access controls

### PCI Compliance
- Stripe handles PCI compliance for card processing
- SoNoBrokers maintains PCI DSS compliance for stored data
- Regular security audits and monitoring

## Error Handling and Recovery

### Payment Failures
```typescript
// Handle payment failures gracefully
const handlePaymentFailure = async (sessionId: string, errorCode: string) => {
  // Log the failure
  await logPaymentFailure(sessionId, errorCode);
  
  // Notify user with specific error message
  const userMessage = getPaymentErrorMessage(errorCode);
  await notifyUser(userMessage);
  
  // Provide retry options
  await createRetryPaymentOption(sessionId);
};
```

### Webhook Failures
- Implement exponential backoff for webhook retries
- Dead letter queue for failed webhook processing
- Manual intervention tools for critical failures

## Monitoring and Analytics

### Key Metrics
- Payment success rates by country/currency
- Property listing conversion rates
- Subscription churn rates
- Revenue tracking by payment type

### Logging
```csharp
// Comprehensive payment logging
_logger.LogInformation("Payment initiated: {PaymentType} for {UserId} amount {Amount} {Currency}", 
    paymentType, userId, amount, currency);

_logger.LogInformation("Payment completed: {SessionId} for property {PropertyId}", 
    sessionId, propertyId);
```

### Dashboards
- Real-time payment processing status
- Revenue analytics by region
- Failed payment analysis
- Subscription health metrics

## Testing

### Test Environment
- Use Stripe test mode for development
- Test webhook endpoints with Stripe CLI
- Simulate various payment scenarios

### Test Cards
```
// Successful payments
4242424242424242 (Visa)
4000056655665556 (Visa Debit)

// Failed payments
4000000000000002 (Card declined)
4000000000009995 (Insufficient funds)
```

## Future Enhancements

### Planned Features
1. **Payment Plans**: Installment payments for property listings
2. **Multi-Currency Wallets**: Support for multiple currencies per user
3. **Cryptocurrency Payments**: Bitcoin/Ethereum payment options
4. **Regional Payment Methods**: Local payment methods per country
5. **Advanced Analytics**: Predictive payment analytics

### Technical Improvements
1. **Caching**: Cache pricing and product data
2. **Rate Limiting**: Implement payment rate limiting
3. **Fraud Detection**: Enhanced fraud prevention
4. **Performance**: Optimize webhook processing
5. **Scalability**: Horizontal scaling for payment processing
