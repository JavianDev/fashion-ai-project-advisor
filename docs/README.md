# SoNoBrokers Frontend Documentation

## Overview

This documentation covers the React frontend implementation of SoNoBrokers, including component architecture, API integration, and feature implementation details.

## Documentation Structure

### 📋 Core Documentation

| Document | Description | Audience | Status |
|----------|-------------|----------|--------|
| [API Integration Guide](./API-Integration.md) | Complete guide to React-API integration with new controller structure | Developers | ✅ **UPDATED** |
| [Controller Architecture Guide](./controller-architecture.md) | Detailed documentation of Core vs SoNoBrokers controller organization | Developers, DevOps | ✅ **NEW** |
| [React-API Mapping](./React-API-Mapping.md) | Updated mapping of React components to new API endpoints | Developers | ✅ **UPDATED** |
| [React API Integration](./react-api-integration.md) | Consolidated React component integration guide | Developers | ✅ **CONSOLIDATED** |
| [Environment Configuration](./ENVIRONMENT_CONFIGURATION.md) | Updated environment variables and API configuration | DevOps, Developers | ✅ **UPDATED** |
| [Documentation Validation Report](./DOCUMENTATION_VALIDATION_REPORT.md) | Comprehensive validation of all documentation accuracy | All Teams | ✅ **NEW** |
| [Testing Results](./TESTING_RESULTS.md) | Comprehensive testing documentation | QA, Developers | ✅ **CURRENT** |
| [Bulk Email System](./BULK_EMAIL_SYSTEM.md) | Complete guide to bulk email composer with Resend integration | Developers, Marketing | ✅ **NEW** |

## 🚀 **Recent Updates (January 2025)**

### ✅ **Unified Payment System**
- **Stripe Integration**: Consolidated all payments into existing `stripe_*` infrastructure
- **Property Listing Payments**: Enhanced support for property publication payments
- **Multi-Currency**: Support for USD, CAD, AED based on user country
- **Webhook Processing**: Automatic property publishing upon payment completion

### ✅ **Enhanced Property Management**
- **Multi-Country Support**: Full support for US, CA, UAE markets
- **MLS Integration**: Automatic MLS validation for US and Canadian properties
- **Media Verification**: Background verification system for uploaded content
- **Analytics Tracking**: Comprehensive property engagement analytics

### ✅ **Database Consolidation**
- **Migration Cleanup**: Merged duplicate migration scripts
- **Table Unification**: Removed duplicate payment tables, use stripe_* infrastructure
- **Performance**: Enhanced indexing and foreign key relationships
- **Consistency**: Standardized table naming and structure

### ✅ **API Architecture Improvements**
- **Controller Organization**: Maintained `/api/core/` and `/api/sonobrokers/` structure
- **Error Handling**: Enhanced error responses with detailed validation
- **Country Logic**: Country-specific business rules and validation
- **Webhook Support**: Comprehensive Stripe webhook integration

### 🏗️ Architecture Overview

```
React Frontend (Next.js 14)
├── Server Components (RSC)
├── Server Actions
├── Client Components
└── API Integration Layer
    └── .NET Core Web API (Reorganized Controllers)
        ├── Core Controllers (/api/core/)
        │   ├── User Management
        │   ├── User Analytics
        │   └── Clerk Webhooks
        └── SoNoBrokers Controllers (/api/sonobrokers/)
            ├── Properties
            ├── Subscriptions
            └── Testing
        └── Supabase PostgreSQL
```

## Key Features Implemented

### 🤝 Contact Sharing System

**Components:**
- `ContactShareButton` - Quick contact sharing from property cards
- `ContactShareModal` - Comprehensive contact sharing modal with tabs
- `ContactSharesDashboard` - Manage all contact shares
- `PropertyQuickActions` - Quick action buttons for properties

**API Integration:**
- Contact requests, property offers, visit scheduling
- Email notifications via Resend
- Real-time status updates
- Comprehensive statistics and analytics

**Business Logic:**
- Rate limiting (10 contact shares per day)
- Duplicate prevention (24-hour window)
- Access control (buyer/seller permissions)
- Email delivery tracking

### 📅 Property Visit Scheduling

**Components:**
- `SellerAvailabilityManager` - Set weekly availability schedules
- `CalendarScheduling` - Interactive calendar for visit booking
- `PropertyQrCodeManager` - Generate and manage QR codes
- `VisitVerificationScanner` - QR code scanning for visit verification

**API Integration:**
- Seller availability management
- Visit request and confirmation workflow
- QR code generation with encryption
- Calendar invite integration
- Visit verification and tracking

**Security Features:**
- Encrypted QR codes with expiration
- Visit verification logging
- Device and location tracking
- Signature validation

### 🏠 Property Management

**Components:**
- `PropertyCard` - Enhanced property cards with quick actions
- `PropertyList` - Paginated property listings
- `PropertyDetails` - Comprehensive property detail pages
- `PropertyForm` - Create and edit property listings

**API Integration:**
- Property CRUD operations
- Image upload and management
- Search and filtering
- Analytics and statistics

### 📧 Bulk Email System

**Components:**
- `SendEmailResend` - Comprehensive bulk email composer
- Email template management with variable substitution
- Recipient management with CC/BCC support
- Email preview and sending options

**API Integration:**
- Resend API integration for reliable email delivery
- Bulk email sending with individual/group options
- Email tracking and delivery confirmation
- Template processing with dynamic variables

**Features:**
- **Investor Outreach**: Pre-built templates for fundraising campaigns
- **Marketing Emails**: Newsletter and promotional email templates
- **Custom Templates**: Flexible templates for any use case
- **Variable Substitution**: Dynamic content with `{{ variable_name }}` syntax
- **CC/BCC Support**: Comprehensive email distribution options
- **Email Preview**: See exactly how emails will appear to recipients
- **Individual Sending**: Send personalized emails to each recipient
- **Email Tracking**: Optional open tracking via Resend

**Access:** `/email-composer`

## React Architecture

### Server Components vs Client Components

**Server Components (Default):**
- Property listings and details
- Dashboard pages
- Static content pages
- Data fetching components

**Client Components (Interactive):**
- Contact sharing modals
- Calendar scheduling
- QR code scanner
- Form interactions

### Component Naming Convention

```
ComponentName.tsx          # Server Component
ComponentNameClient.tsx    # Client Component
```

### File Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── [country]/         # Country-specific routes
│   ├── dashboard/         # Dashboard pages
│   └── properties/        # Property pages
├── components/
│   ├── contact-sharing/   # Contact sharing components
│   ├── property-scheduling/ # Scheduling components
│   ├── email/            # Bulk email system components
│   ├── shared/           # Shared components
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── actions/          # Server Actions
│   ├── api/              # API client functions
│   └── utils/            # Utility functions
└── services/             # Business logic services
```

## API Integration Patterns

### Server Actions

```typescript
// src/lib/actions/contact-sharing-actions.ts
export async function shareContactAction(data: CreateContactShareRequest) {
  const token = await getClerkToken()
  const response = await fetch('/api/sonobrokers/contact-sharing', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    throw new Error('Failed to share contact')
  }
  
  return response.json()
}
```

### API Client Functions

```typescript
// src/lib/api/contact-sharing-api.ts
export const contactSharingApi = {
  create: async (data: CreateContactShareRequest) => {
    return apiClient.post('/sonobrokers/contact-sharing', data)
  },
  
  getAll: async (params: ContactShareSearchParams) => {
    return apiClient.get('/sonobrokers/contact-sharing', { params })
  },
  
  getById: async (id: string) => {
    return apiClient.get(`/sonobrokers/contact-sharing/${id}`)
  }
}
```

### Error Handling

```typescript
// src/lib/utils/error-handling.ts
export function handleApiError(error: any) {
  if (error.status === 401) {
    redirect('/sign-in')
  }
  
  if (error.status === 403) {
    return { error: 'Access denied' }
  }
  
  return { error: error.message || 'An unexpected error occurred' }
}
```

## Authentication Integration

### Clerk Configuration

```typescript
// src/lib/auth/clerk-config.ts
export const clerkConfig = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  secretKey: process.env.CLERK_SECRET_KEY!,
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/dashboard',
  afterSignUpUrl: '/dashboard'
}
```

### JWT Token Handling

```typescript
// src/lib/auth/token-utils.ts
export async function getClerkToken(): Promise<string | null> {
  const { getToken } = auth()
  return await getToken()
}

export function getAuthHeaders(): HeadersInit {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}
```

## State Management

### AppContext for Global State

```typescript
// src/contexts/AppContext.tsx
export const AppContext = createContext<AppContextType>({
  country: 'ca',
  userRole: 'buyer',
  setCountry: () => {},
  setUserRole: () => {}
})
```

### React Query for Server State

```typescript
// src/hooks/useContactShares.ts
export function useContactShares(params: ContactShareSearchParams) {
  return useQuery({
    queryKey: ['contact-shares', params],
    queryFn: () => contactSharingApi.getAll(params),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}
```

## UI Components

### shadcn/ui Integration

```typescript
// src/components/ui/button.tsx
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### Theme Configuration

```typescript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#72e3ad',
          900: '#006239'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif']
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
```

## Testing Strategy

### Component Testing

```typescript
// src/components/__tests__/ContactShareButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ContactShareButton } from '../ContactShareButton'

describe('ContactShareButton', () => {
  it('renders contact share button', () => {
    render(<ContactShareButton propertyId="test-123" sellerId="seller-123" />)
    expect(screen.getByText('Contact Seller')).toBeInTheDocument()
  })
  
  it('opens modal when clicked', () => {
    render(<ContactShareButton propertyId="test-123" sellerId="seller-123" />)
    fireEvent.click(screen.getByText('Contact Seller'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
```

### API Integration Testing

```typescript
// src/lib/api/__tests__/contact-sharing-api.test.ts
import { contactSharingApi } from '../contact-sharing-api'

describe('Contact Sharing API', () => {
  it('creates contact share successfully', async () => {
    const mockData = {
      propertyId: 'test-123',
      sellerId: 'seller-123',
      buyerName: 'Test Buyer',
      buyerEmail: 'test@example.com',
      shareType: 1
    }
    
    const result = await contactSharingApi.create(mockData)
    expect(result.id).toBeDefined()
    expect(result.status).toBe(1)
  })
})
```

## Performance Optimization

### Code Splitting

```typescript
// src/components/ContactShareModal.tsx
import dynamic from 'next/dynamic'

const ContactShareModal = dynamic(() => import('./ContactShareModalClient'), {
  loading: () => <div>Loading...</div>,
  ssr: false
})
```

### Image Optimization

```typescript
// src/components/PropertyCard.tsx
import Image from 'next/image'

export function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="property-card">
      <Image
        src={property.imageUrl}
        alt={property.title}
        width={400}
        height={300}
        className="rounded-lg"
        priority={property.featured}
      />
    </div>
  )
}
```

### Caching Strategy

```typescript
// src/lib/api/cache-config.ts
export const cacheConfig = {
  properties: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000  // 30 minutes
  },
  contactShares: {
    staleTime: 5 * 60 * 1000,  // 5 minutes
    cacheTime: 15 * 60 * 1000  // 15 minutes
  }
}
```

## Deployment

### Environment Configuration

```env
# .env.local
NEXT_PUBLIC_API_URL=https://localhost:5001/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_MAPBOX_API_KEY=pk.eyJ1...
```

### Build Configuration

```json
// next.config.js
module.exports = {
  experimental: {
    serverComponentsExternalPackages: ['@clerk/nextjs']
  },
  images: {
    domains: ['images.unsplash.com', 'supabase.co']
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY
  }
}
```

## Monitoring and Analytics

### Error Tracking

```typescript
// src/lib/monitoring/error-tracking.ts
export function trackError(error: Error, context?: any) {
  console.error('Application Error:', error, context)
  
  // Send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Sentry, LogRocket, etc.
  }
}
```

### Performance Monitoring

```typescript
// src/lib/monitoring/performance.ts
export function trackPageView(page: string) {
  // Google Analytics, Mixpanel, etc.
  if (typeof window !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: page,
      page_location: window.location.href
    })
  }
}
```

## Contributing

### Development Workflow

1. **Setup**: Follow the main README setup instructions
2. **Branch**: Create feature branch from `main`
3. **Develop**: Implement features with tests
4. **Test**: Run `npm test` and `npm run e2e`
5. **Build**: Verify `npm run build` succeeds
6. **PR**: Create pull request with description

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Automatic formatting
- **Testing**: Jest + React Testing Library
- **E2E**: Playwright for end-to-end tests

### Component Guidelines

- Use Server Components by default
- Client Components only for interactivity
- Proper TypeScript interfaces
- Comprehensive error handling
- Accessibility compliance (WCAG 2.1)

## Support

- **Documentation**: This docs folder
- **API Reference**: [Web API Documentation](../../SoNoBrokersWebApi/MicroSaasWebApi.App/Documentation/)
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
