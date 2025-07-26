# SoNoBrokers React-API Integration Documentation

## Overview

This document provides a comprehensive mapping of React components and features to their corresponding .NET Core Web API endpoints. SoNoBrokers uses a modern architecture with React Server Components calling .NET Web API endpoints for all data operations.

## Architecture Overview

```
React Frontend (Next.js 14) → .NET Core Web API → Supabase PostgreSQL
```

- **Frontend**: React with Server Components and Server Actions
- **Backend**: .NET 9 Web API with DapperORM
- **Database**: Supabase PostgreSQL with stored procedures
- **Authentication**: Clerk JWT tokens

## API Base URLs (Updated December 2024)

- **Development HTTP**: `http://localhost:5005`
- **Development HTTPS**: `https://localhost:7163`
- **Staging**: `https://staging-api.sonobrokers.com`
- **Production**: `https://api.sonobrokers.com`

## Controller Architecture (New Structure)

### Core Controllers (`/api/core/`)
- **User Management**: `/api/core/user/*` - Complete user lifecycle
- **User Analytics**: `/api/core/user/analytics/*` - Session tracking and analytics
- **Clerk Webhooks**: `/api/core/clerk/webhooks` - Authentication integration

### SoNoBrokers Controllers (`/api/sonobrokers/`)
- **Properties**: `/api/sonobrokers/properties/*` - Property management
- **Subscriptions**: `/api/sonobrokers/subscriptions/*` - Subscription handling
- **Testing**: `/api/sonobrokers/test/ping` - Connectivity testing

### Health & Monitoring
- **Health Check**: `/health` - Application health status

## Contact Sharing System

### React Components → API Endpoints

#### 1. ContactShareButton Component
**File**: `src/components/contact-sharing/ContactShareButton.tsx`

**API Calls**:
- **Create Contact Share**: `POST /api/sonobrokers/contact-sharing`
- **Get User Profile**: `GET /api/sonobrokers/users/profile`

**Usage**:
```tsx
<ContactShareButton
  propertyId="prop-123"
  sellerId="seller-123"
  sellerName="John Seller"
  propertyTitle="Beautiful Family Home"
  propertyPrice={500000}
  propertyAddress="123 Main St, City, State"
/>
```

#### 2. ContactShareModal Component
**File**: `src/components/contact-sharing/ContactShareModal.tsx`

**API Calls**:
- **Contact Request**: `POST /api/sonobrokers/contact-sharing` (shareType: 1)
- **Property Offer**: `POST /api/sonobrokers/contact-sharing` (shareType: 2)
- **Schedule Visit**: `POST /api/sonobrokers/contact-sharing` (shareType: 3)
- **Offer + Visit**: `POST /api/sonobrokers/contact-sharing` (shareType: 4)

**Request Payload**:
```json
{
  "propertyId": "string",
  "sellerId": "string",
  "buyerName": "string",
  "buyerEmail": "string",
  "buyerPhone": "string",
  "message": "string",
  "shareType": 1-4,
  "offerAmount": 500000,
  "preferredVisitDate": "2024-12-31",
  "preferredVisitTime": "14:00"
}
```

#### 3. ContactSharesDashboard Component
**File**: `src/components/contact-sharing/ContactSharesDashboard.tsx`

**API Calls**:
- **Get Contact Shares**: `GET /api/sonobrokers/contact-sharing`
- **Get Statistics**: `GET /api/sonobrokers/contact-sharing/stats`
- **Delete Contact Share**: `DELETE /api/sonobrokers/contact-sharing/{id}`
- **Respond to Contact**: `PUT /api/sonobrokers/contact-sharing/{id}/respond`

**Query Parameters**:
```
?page=1&limit=20&sortBy=createdAt&sortOrder=desc&shareType=2&status=1
```

#### 4. PropertyQuickActions Component
**File**: `src/components/contact-sharing/ContactShareButton.tsx`

**API Calls**:
- **Contact Seller**: `POST /api/sonobrokers/contact-sharing` (shareType: 1)
- **Make Offer**: `POST /api/sonobrokers/contact-sharing` (shareType: 2)
- **Schedule Visit**: `POST /api/sonobrokers/contact-sharing` (shareType: 3)

### Server Actions

#### 1. Contact Sharing Actions
**File**: `src/lib/actions/contact-sharing-actions.ts`

**Functions**:
- `shareContactAction()` → `POST /api/sonobrokers/contact-sharing`
- `submitOfferAction()` → `POST /api/sonobrokers/contact-sharing`
- `scheduleVisitAction()` → `POST /api/sonobrokers/contact-sharing`
- `submitOfferWithVisitAction()` → `POST /api/sonobrokers/contact-sharing`
- `sellerRespondAction()` → `PUT /api/sonobrokers/contact-sharing/{id}/respond`
- `deleteContactShareAction()` → `DELETE /api/sonobrokers/contact-sharing/{id}`

## Property Scheduling System

### React Components → API Endpoints

#### 1. SellerAvailabilityManager Component
**File**: `src/components/property-scheduling/SellerAvailabilityManager.tsx`

**API Calls**:
- **Create Availability**: `POST /api/sonobrokers/property-scheduling/availability`
- **Get Availability**: `GET /api/sonobrokers/property-scheduling/availability`
- **Update Availability**: `PUT /api/sonobrokers/property-scheduling/availability/{id}`
- **Delete Availability**: `DELETE /api/sonobrokers/property-scheduling/availability/{id}`

#### 2. PropertyQrCodeManager Component
**File**: `src/components/property-scheduling/PropertyQrCodeManager.tsx`

**API Calls**:
- **Generate QR Code**: `POST /api/sonobrokers/property-scheduling/property/{id}/qr-code`
- **Get QR Code**: `GET /api/sonobrokers/property-scheduling/property/{id}/qr-code`
- **Regenerate QR Code**: `PUT /api/sonobrokers/property-scheduling/property/{id}/qr-code`

#### 3. VisitVerificationScanner Component
**File**: `src/components/property-scheduling/VisitVerificationScanner.tsx`

**API Calls**:
- **Verify Visit**: `POST /api/sonobrokers/property-scheduling/visits/{id}/verify`
- **Get Verifications**: `GET /api/sonobrokers/property-scheduling/visits/{id}/verifications`

#### 4. CalendarScheduling Component
**File**: `src/components/contact-sharing/CalendarScheduling.tsx`

**API Calls**:
- **Create Visit Schedule**: `POST /api/sonobrokers/property-scheduling/visits`
- **Get Property Availability**: `GET /api/sonobrokers/property-scheduling/property/{id}/availability`

## Property Management

### React Components → API Endpoints

#### 1. PropertyCard Component
**File**: `src/components/shared/properties/PropertyCard.tsx`

**API Calls**:
- **Contact Sharing**: `POST /api/sonobrokers/contact-sharing`
- **Property Offers**: `POST /api/sonobrokers/contact-sharing` (shareType: 2)
- **Schedule Visits**: `POST /api/sonobrokers/contact-sharing` (shareType: 3)

#### 2. Property Detail Page
**File**: `src/app/properties/[id]/page.tsx`

**API Calls**:
- **Get Property**: `GET /api/sonobrokers/properties/{id}`
- **Contact Sharing**: `POST /api/sonobrokers/contact-sharing`
- **Property Statistics**: `GET /api/sonobrokers/contact-sharing/property/{id}/stats`

#### 3. Property List Page
**File**: `src/app/properties/page.tsx`

**API Calls**:
- **Get Properties**: `GET /api/sonobrokers/properties`
- **Search Properties**: `GET /api/sonobrokers/properties/search`
- **Filter Properties**: `GET /api/sonobrokers/properties?filters=...`

## Dashboard Pages

### 1. Contact Shares Dashboard
**File**: `src/app/dashboard/contact-shares/page.tsx`

**API Calls**:
- **Get Contact Shares**: `GET /api/sonobrokers/contact-sharing`
- **Get Statistics**: `GET /api/sonobrokers/contact-sharing/stats`

### 2. Property Management Dashboard
**File**: `src/app/dashboard/properties/page.tsx`

**API Calls**:
- **Get User Properties**: `GET /api/sonobrokers/properties/user`
- **Property Analytics**: `GET /api/sonobrokers/properties/{id}/analytics`
- **Contact Share Stats**: `GET /api/sonobrokers/contact-sharing/property/{id}/stats`

## API Client Configuration

### Base API Client
**File**: `src/lib/api/base-api.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:5001/api'

export const apiClient = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getClerkToken()}`
  }
}
```

### Contact Sharing API Client
**File**: `src/lib/api/contact-sharing-api.ts`

**Functions**:
- `createContactShare(data)` → `POST /api/sonobrokers/contact-sharing`
- `getContactShares(params)` → `GET /api/sonobrokers/contact-sharing`
- `getContactShare(id)` → `GET /api/sonobrokers/contact-sharing/{id}`
- `updateContactShareStatus(id, response)` → `PUT /api/sonobrokers/contact-sharing/{id}/respond`
- `deleteContactShare(id)` → `DELETE /api/sonobrokers/contact-sharing/{id}`
- `getContactShareStats()` → `GET /api/sonobrokers/contact-sharing/stats`

## Authentication Flow

### Clerk Integration
**File**: `src/lib/auth/clerk-config.ts`

1. **Client-side**: Clerk handles authentication UI
2. **Server-side**: JWT token passed to API
3. **API Validation**: .NET Core validates JWT with Clerk

**Token Flow**:
```
React Component → Clerk Token → API Request → .NET Core Validation → Database
```

## Error Handling

### React Error Boundaries
**File**: `src/components/error-boundary.tsx`

**API Error Handling**:
- 401 Unauthorized → Redirect to sign-in
- 403 Forbidden → Show access denied message
- 404 Not Found → Show not found page
- 500 Server Error → Show error message with retry

### Server Action Error Handling
**File**: `src/lib/actions/error-handling.ts`

```typescript
export async function handleApiError(error: any) {
  if (error.status === 401) {
    redirect('/sign-in')
  }
  return {
    success: false,
    error: error.message || 'An unexpected error occurred'
  }
}
```

## Environment Configuration

### Development
```env
NEXT_PUBLIC_API_URL=https://localhost:5001/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Production
```env
NEXT_PUBLIC_API_URL=https://api.sonobrokers.com/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

## Performance Optimization

### React Optimizations
1. **Server Components**: Used for data fetching
2. **Client Components**: Only for interactivity
3. **Lazy Loading**: Components loaded on demand
4. **Caching**: API responses cached appropriately

### API Optimizations
1. **Pagination**: All list endpoints support pagination
2. **Filtering**: Efficient database queries
3. **Indexing**: Proper database indexes
4. **Compression**: Response compression enabled

## Testing Strategy

### React Component Tests
**File**: `src/components/**/__tests__/*.test.tsx`

- Component rendering tests
- User interaction tests
- API integration tests
- Error handling tests

### API Integration Tests
**File**: `src/lib/api/__tests__/*.test.ts`

- API client tests
- Error handling tests
- Authentication tests
- Data transformation tests

## Deployment

### Build Process
1. **React Build**: `npm run build`
2. **API Build**: `dotnet publish`
3. **Database Migration**: Supabase migrations
4. **Environment Setup**: Configure environment variables

### Monitoring
- **API Monitoring**: Application Insights
- **Error Tracking**: Sentry integration
- **Performance**: Lighthouse scores
- **Uptime**: Health check endpoints

## Security Features

### Access Control

| Feature | Implementation | API Validation |
|---------|----------------|----------------|
| Authentication | Clerk JWT tokens | JWT validation middleware |
| Authorization | Role-based access | User role validation |
| Property Access | Owner/seller validation | Property ownership check |
| Contact Share Access | Buyer/seller validation | Contact share access check |
| Admin Access | Admin role required | Admin role validation |

### User Roles & Permissions
- **USER**: Standard user access to own data
- **ADMIN**: Full system access and user management
- **PRODUCT**: Product team access to analytics
- **OPERATOR**: Operations team access to monitoring

### User Types
- **Buyer**: Property search and contact sharing
- **Seller**: Property management and listing

## Performance Features

### Optimization Strategies

| Feature | React Implementation | API Optimization |
|---------|---------------------|------------------|
| Lazy Loading | React.lazy() | Pagination |
| Caching | React Query | Response caching |
| Image Optimization | Next.js Image | CDN delivery |
| Code Splitting | Dynamic imports | Minimal payloads |
| Server Components | RSC | Reduced client JS |

### Mobile Responsiveness

| Feature | Desktop Component | Mobile Adaptation |
|---------|------------------|-------------------|
| Property Cards | Grid layout | Single column |
| Contact Modal | Full modal | Bottom sheet |
| Navigation | Horizontal menu | Hamburger menu |
| Search Filters | Sidebar | Collapsible panel |
| Dashboard | Multi-column | Stacked layout |

## Testing Strategy

### Test Coverage

| Feature Area | React Tests | API Tests |
|--------------|-------------|-----------|
| Core User Management | Component tests | Integration tests |
| User Analytics | Dashboard tests | Analytics API tests |
| Authentication | Auth flow tests | JWT validation tests |
| Property Management | CRUD tests | Database tests |
| Contact Sharing | Component tests | Integration tests |

### API Testing Tools
- **Node.js Script**: `test-api-connectivity.js` - Automated endpoint testing
- **React Component**: `/test/api-connectivity` - Interactive browser testing
- **Manual Testing**: curl commands for individual endpoints

## API Connectivity Testing

### Automated Testing
```bash
# Run Node.js test script
cd SoNoBrokers
node test-api-connectivity.js

# Test specific endpoints
curl http://localhost:5005/health
curl http://localhost:5005/api/sonobrokers/test/ping
```

### Interactive Testing
Visit the React test component at: `http://localhost:3000/test/api-connectivity`

This provides a comprehensive browser-based interface to test all API endpoints with real-time results and response data.
