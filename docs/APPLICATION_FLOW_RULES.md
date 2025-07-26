# Application Flow Rules with AppContext

## Overview

This document describes the comprehensive application flow rules for SoNoBrokers, including geolocation-based routing, role-based authentication, and AppContext state management. The system ensures users are properly routed based on their geographic location and provides seamless access to all application features with authentication only required for specific protected actions.

## Core Principles

### Server-First Architecture with AppContext Integration

**Server-Side Components Priority:**

- All pages use server components with `auth()` checks where appropriate
- Server components pass authentication state to client components via props
- AppContext provides client-side state management for interactive features
- Minimize client-side authentication logic

**AppContext Role:**

- Client-side state synchronization with server-provided auth state
- Geographic context (`country`, `userType`) management
- Interactive UI state (modals, loading states)
- Bridge between server auth state and client components

### Hybrid Authentication Strategy

**Server-Side Authentication:**

- Page-level auth checks using `auth()` from `@clerk/nextjs/server`
- Server components determine authentication requirements
- Pass auth state as props to client components

**Client-Side Enhancement:**

- AppContext synchronizes with server-provided auth state
- Handles interactive authentication flows (signin modals)
- Manages user preferences and UI state

**Public Access with Progressive Authentication:**

- All pages accessible without authentication (server renders public view)
- Protected features show signin prompts when accessed
- Dashboard and user-specific pages require authentication

## Project Architecture

### SoNoBrokers Application Structure

**Technology Stack:**

- **Frontend**: Next.js 15 with React 18, TypeScript
- **Backend**: .NET Web API (separate project)
- **Database**: PostgreSQL/Supabase with Prisma ORM
- **Authentication**: Clerk with custom SNB user mapping
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: React Context (AppContext) as single source of truth
- **Routing**: Next.js App Router with country-specific routes

**Key Features:**

- **Geolocation-based Routing**: Automatic country detection and routing
- **Role-based Authentication**: Dynamic role and permission system
- **Multi-country Support**: CA (Canada), US (United States), and UAE (United Arab Emirates)
- **Property Management**: Listings, searches, and saved properties
- **Service Provider Network**: Lawyers, photographers, inspectors, etc.
- **Admin Dashboard**: User management, bulk operations, analytics

### Database-Driven Enums

All enums are dynamically retrieved from PostgreSQL database:

#### Core User Enums

- **Country**: `CA`, `US`, `UAE` (expandable for future markets)
- **UserRole**: `ADMIN`, `USER`, `PRODUCT`, `OPERATOR`, `SERVICE_PROVIDER`
- **UserType**: `Buyer`, `Seller` (proper case in database)

#### Business Enums

- **PropertyStatus**: `pending`, `active`, `sold`, `expired`
- **ServiceType**: `lawyer`, `photographer`, `inspector`, `appraiser`, etc.
- **BookingStatus**: `pending`, `confirmed`, `completed`, `cancelled`
- **SubscriptionStatus**: `active`, `inactive`, `cancelled`, `past_due`

## Application Flow Rules

### Step 1: Initial Application Load with Middleware Region Check

When the application loads, a middleware-level region check is performed:

#### 1.1 Browser IP Detection

```typescript
// RegionCheck.tsx and middleware.ts work together
const checkRegion = async () => {
  // Priority order:
  // 1. Test override (localStorage.testCountry)
  // 2. Localhost detection (defaults to CA)
  // 3. Cached country (localStorage.userCountry)
  // 4. API geolocation call (/api/geo)
  // 5. Fallback to CA on error
};
```

#### 1.2 Country Validation

```typescript
const SUPPORTED_REGIONS = ["US", "CA", "UAE"]; // From database enum

// Validate against database-driven Country enum
const supportedCountries = await getCountriesFromDatabase();
if (!supportedCountries.map((c) => c.code).includes(country)) {
  redirect(`/unsupported-region?country=${country}`);
}
```

#### 1.3 AppContext Country Storage

```typescript
// Store in AppContext (NOT localStorage/sessionStorage as preferred)
const { setCountry } = useAppContext();
setCountry(detectedCountry as Country); // CA, US, or UAE enum value
```

### Step 2: Public Access Architecture

#### 2.1 All Pages Publicly Accessible

**Core Principle**: All application pages are accessible without authentication by default.

```typescript
// No server-side auth() checks on public pages
export default async function PropertiesPage({ params }: PageProps) {
  const { country } = await params;

  // No authentication required - AppContext handles user state
  return (
    <PropertySearchClient
      country={country}
      // AppContext provides authentication state to client components
    />
  );
}
```

#### 2.2 Valid Country Routing

For users from supported countries (CA, US, UAE):

```typescript
// Redirect to country-specific landing page
if (country === "CA") {
  router.push("/ca"); // www.localhost:3000/ca
}
if (country === "US") {
  router.push("/us"); // www.localhost:3000/us
}
if (country === "UAE") {
  router.push("/uae"); // www.localhost:3000/uae
}
```

#### 2.2 Unsupported Country Routing

For users from unsupported countries:

```typescript
router.push(`/unsupported-region?country=${country}`);
// Example: /unsupported-region?country=FR
```

1. User visits site
   ↓
2. RegionCheck (Layout level)
   ↓ calls /api/geo
   ↓ 
3. Next.js API route (/api/geo)
   ↓ calls ipapi.co
   ↓
4. External IP service returns country
   ↓
5. RegionCheck validates & caches
   ↓
6. CountryDetector (Component level)
   ↓ uses geo.ts functions
   ↓
7. geo.ts calls external services directly
   ↓
8. Final routing decision made

#### 2.3 Country-Specific Landing Pages

- **Canada**: `/ca/page.tsx` - Canadian market content
- **US**: `/us/page.tsx` - US market content
- **UAE**: `/uae/page.tsx` - UAE market content
- **Unsupported**: `/unsupported-region/page.tsx` - Coming soon message

### Step 3: Protected Actions and Authentication Flow

#### 3.1 Protected Action Pattern

When users attempt protected actions, trigger signin modal and continue after authentication:

```typescript
// Example: List Property submission
const handleListPropertySubmit = async (propertyData: PropertyData) => {
  const { isSignedIn, userId } = useAppContext();

  if (!isSignedIn) {
    // Show signin modal with callback
    showSignInModal({
      onSuccess: () => handleListPropertySubmit(propertyData),
      message: "Please sign in to list your property",
    });
    return;
  }

  // User is authenticated, proceed with action
  await submitPropertyListing(propertyData, userId);
};
```

#### 3.2 Dashboard Access Control

Only the Dashboard requires authentication at the page level:

```typescript
// Dashboard page - ONLY page with server-side auth check
export default async function DashboardPage({ params }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Dashboard content for authenticated users only
  return <DashboardClient />;
}
```

### Step 4: Authenticated User Dashboard Routing

#### 4.1 Post-Login Redirection

After successful authentication via Clerk:

```typescript
// Use AppContext for country-aware dashboard routing
const { country } = useAppContext();

const redirectToDashboard = async () => {
  const dashboardUrl = `/${country.toLowerCase()}/dashboard`;
  router.push(dashboardUrl);
};

// Results in:
// CA users: /ca/dashboard
// US users: /us/dashboard
// UAE users: /uae/dashboard
```

#### 4.2 Sign-out Redirection

When users sign out:

```typescript
const handleSignOut = async () => {
  await signOut();
  const { country } = useAppContext();
  const landingUrl = `/${country.toLowerCase()}`; // /ca, /us, or /uae
  router.push(landingUrl);
};
```

### Step 4: Role-Based Header Menu System

#### 4.1 Admin User (javian.picardo.sonobrokers@gmail.com)

Special admin user gets additional "Admin Settings" dropdown:

```typescript
// Header.tsx - Admin-specific menu
{snbUser?.email === 'javian.picardo.sonobrokers@gmail.com' && (
  <DropdownMenuItem asChild>
    <Link href={`/${country.toLowerCase()}/admin/settings`}
          className="flex items-center text-gray-600 font-medium">
      <Settings className="mr-2 h-4 w-4" />
      <span>Admin Settings</span>
    </Link>
  </DropdownMenuItem>
)}
```

**Admin Features:**

- User management (CRUD operations)
- Role assignment (PRODUCT, OPERATOR, SERVICE_PROVIDER)
- Bulk email/notification sending
- Analytics and reporting
- System configuration

#### 4.2 Role-Based Settings Menu

Other authenticated users get role-specific settings:

```typescript
// Dynamic role-based menu generation
const getRoleSettingsUrl = (country: string, role: UserRole) => {
  const roleMap = {
    PRODUCT: "product",
    OPERATOR: "operator",
    SERVICE_PROVIDER: "service-provider",
    USER: "user",
  };
  return `/${country.toLowerCase()}/${roleMap[role]}/settings`;
};

// Examples:
// PRODUCT role: /ca/product/settings
// OPERATOR role: /us/operator/settings
// SERVICE_PROVIDER role: /ca/service-provider/settings
```

**Role-Specific Features:**

- **PRODUCT**: Product management, analytics, inventory
- **OPERATOR**: Content moderation, support tickets, operations
- **SERVICE_PROVIDER**: Service portfolio, bookings, client management
- **USER**: Profile settings, preferences, saved items

## AppContext Implementation

### Enhanced AppContext Structure

```typescript
interface AppContextType {
  // Geographic & User Context
  country: Country; // CA | US (from database enum)
  setCountry: (country: Country) => void;
  userType: UserType; // Buyer | Seller (from database enum)
  setUserType: (type: UserType) => void;

  // Authentication Context
  clerkUser: any; // Clerk user object
  snbUser: SnbUser | null; // SNB database user
  isSignedIn: boolean;
  userId: string | null;
  userEmail: string | null;

  // Role & Permissions
  userRole: UserRole; // ADMIN | USER | PRODUCT | OPERATOR | SERVICE_PROVIDER
  permissions: Permission[];
  isAdmin: boolean;

  // Loading States
  isLoading: boolean;
  isUserLoading: boolean;
  isRegionLoading: boolean;

  // Functions
  refreshSnbUser: () => Promise<void>;
  checkPermission: (permission: string, resource?: string) => boolean;
  hasRole: (roles: UserRole[]) => boolean;
}
```

### AppContext Provider Enhancement

```typescript
export function AppProvider({
  children,
  initialCountry,
  initialUserType,
}: AppProviderProps) {
  // Region detection and validation
  const [country, setCountryState] = useState<Country>(initialCountry);
  const [isRegionLoading, setIsRegionLoading] = useState(true);

  // User authentication and role management
  const [snbUser, setSnbUser] = useState<SnbUser | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // Region validation on mount
  useEffect(() => {
    validateAndSetRegion();
  }, []);

  // User role and permission loading
  useEffect(() => {
    if (isSignedIn && snbUser) {
      loadUserPermissions();
    }
  }, [isSignedIn, snbUser]);

  const validateAndSetRegion = async () => {
    try {
      const detectedCountry = await detectUserRegion();
      const supportedCountries = await getCountriesFromDatabase();

      if (supportedCountries.map((c) => c.code).includes(detectedCountry)) {
        setCountryState(detectedCountry as Country);
      } else {
        router.push(`/unsupported-region?country=${detectedCountry}`);
      }
    } catch (error) {
      setCountryState("CA"); // Fallback to Canada
    } finally {
      setIsRegionLoading(false);
    }
  };
}
```

## Routing Structure

### Country-Specific Routes

```
/ca/                    # Canada landing page
/ca/dashboard          # Canada dashboard
/ca/admin/settings     # Admin settings (Canada)
/ca/product/settings   # Product role settings (Canada)
/ca/operator/settings  # Operator role settings (Canada)
/ca/service-provider/settings # Service provider settings (Canada)

/us/                   # US landing page
/us/dashboard          # US dashboard
/us/admin/settings     # Admin settings (US)
/us/product/settings   # Product role settings (US)
/us/operator/settings  # Operator role settings (US)
/us/service-provider/settings # Service provider settings (US)
```

### Protected Routes

```typescript
// middleware.ts
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/*/dashboard(.*)", // Country-specific dashboards
  "/*/admin(.*)", // Admin routes
  "/*/product(.*)", // Product role routes
  "/*/operator(.*)", // Operator role routes
  "/*/service-provider(.*)", // Service provider routes
]);
```

## Security & Permissions

### Role Hierarchy

1. **ADMIN**: Full system access, user management
2. **PRODUCT**: Product management, analytics access
3. **OPERATOR**: Content moderation, support operations
4. **SERVICE_PROVIDER**: Service-specific features
5. **USER**: Basic user features

### Permission Checking

```typescript
// Permission validation in components
const { checkPermission, hasRole } = useAppContext();

// Check specific permission
if (checkPermission("manage_users")) {
  // Show user management UI
}

// Check role-based access
if (hasRole(["ADMIN", "PRODUCT"])) {
  // Show admin/product features
}
```

### Special Admin Features

The admin user `javian.picardo.sonobrokers@gmail.com` has additional capabilities:

- Access to all country-specific admin panels
- User role assignment and management
- Bulk email and notification sending
- System-wide analytics and reporting
- Database enum management (future feature)

## Error Handling & Fallbacks

### Region Detection Failures

```typescript
// Fallback hierarchy for region detection
1. Test override (development)
2. Localhost detection → CA
3. Cached user country
4. API geolocation
5. Default fallback → CA
```

### Authentication Failures

```typescript
// Redirect unauthenticated users
if (!isSignedIn && isProtectedRoute) {
  router.push("/sign-in");
}

// Handle role-based access
if (!hasRole(requiredRoles)) {
  router.push("/unauthorized");
}
```

### Database Connection Issues

```typescript
// Fallback enum values when database is unavailable
const fallbackCountries = [
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "US", name: "United States", flag: "🇺🇸" },
];
```

## Testing & Development

### AppContext Flow Testing

#### 1. Public Access Testing

**Verify unauthenticated users can access all pages:**

- ✅ Properties page (`/[country]/properties`)
- ✅ List Property page (`/[country]/list-property`) - shows form but requires signin on submit
- ✅ Resources pages (`/[country]/resources/*`)
- ✅ Services pages (`/[country]/services/*`)
- ✅ Landing pages (`/[country]`)

#### 2. Authentication Flow Testing

**Verify Dashboard access control:**

- ✅ Dashboard requires authentication (`/[country]/dashboard`)
- ✅ Unauthenticated users redirected to sign-in
- ✅ Header shows Dashboard link only when signed in

#### 3. Protected Actions Testing

**Verify protected actions trigger signin:**

- ✅ List Property form submission
- ✅ Save property to favorites
- ✅ Contact service providers
- ✅ User-specific data access

#### 4. AppContext State Management Testing

**Verify AppContext provides consistent state:**

- ✅ All components use AppContext exclusively (no direct Clerk hooks)
- ✅ Authentication state synchronized across components
- ✅ User data accessible through AppContext
- ✅ Country and user type properly managed

#### 5. Multi-Country Testing

**Verify all 3 countries work correctly:**

- ✅ Canada (CA) - `/ca/*` routes
- ✅ United States (US) - `/us/*` routes
- ✅ United Arab Emirates (UAE) - `/uae/*` routes

### Region Testing

Use the RegionTester component at `/region-tester` (development only):

```typescript
// Test different countries
localStorage.setItem("testCountry", "CA"); // Test Canada
localStorage.setItem("testCountry", "US"); // Test US
localStorage.setItem("testCountry", "UAE"); // Test UAE
localStorage.setItem("testCountry", "FR"); // Test unsupported region
```

### Role Testing

```typescript
// Test different user roles in development
const testUser = {
  email: "test@example.com",
  role: "PRODUCT", // Test product role features
  userType: "Seller",
};
```

### Component Integration Testing

**Verify components updated to use AppContext:**

- ✅ PropertySearchClient
- ✅ OpenHouseSearchClient
- ✅ PropertyListingForm
- ✅ HeaderClient
- ✅ FooterClient
- ✅ ButtonSignin
- ✅ Dashboard components
- ✅ Sign-in/Sign-up pages

## Configuration

### Environment Variables

```bash
# Required for geolocation and routing
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Admin configuration
ADMIN_EMAIL=javian.picardo.sonobrokers@gmail.com
```

### Database Setup

Ensure the following enums exist in your PostgreSQL database:

```sql
-- Country enum
CREATE TYPE "Country" AS ENUM ('CA', 'US');

-- UserRole enum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'PRODUCT', 'OPERATOR', 'SERVICE_PROVIDER');

-- UserType enum
CREATE TYPE "UserType" AS ENUM ('Buyer', 'Seller');
```

---

This document serves as the comprehensive guide for understanding and implementing the SoNoBrokers application flow rules with AppContext integration. All features are designed to work together seamlessly while maintaining security, performance, and user experience standards.
