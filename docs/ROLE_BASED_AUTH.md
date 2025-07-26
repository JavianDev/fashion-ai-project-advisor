# Role-Based Authentication System

## Overview

This document describes the role-based authentication system implemented for SoNoBrokers. The system maps Clerk authentication users to the SNB database and provides role-based access control with user type management. All enums are dynamically retrieved from the PostgreSQL database to ensure consistency and allow for easy updates without code changes.

**📋 Related Documentation:**

- [Application Flow Rules with AppContext](./APPLICATION_FLOW_RULES.md) - Comprehensive flow rules and geolocation routing
- [Dynamic Enums](./dynamic-enums.md) - Database-driven enum system
- [Region Testing](./region-testing.md) - Testing geolocation features

## Integration with Application Flow

This role-based authentication system works seamlessly with the [Application Flow Rules](./APPLICATION_FLOW_RULES.md) to provide:

1. **Geolocation-based Routing**: Users are routed to country-specific dashboards based on their location
2. **Role-based Menu Systems**: Different menu items and settings based on user roles
3. **Admin-specific Features**: Special admin user with enhanced capabilities
4. **Country-specific Role Management**: Role settings accessible via country-specific routes

## Database Schema & Enums

### User Roles (UserRole enum) - Database Driven

The UserRole enum is stored in PostgreSQL and retrieved dynamically:

- `ADMIN`: Full system access, can manage users and roles
- `USER`: Regular user access (default for new users)
- `PRODUCT`: Product management access
- `OPERATOR`: Operations and moderation access
- `SERVICE_PROVIDER`: Service provider access for contractors, lawyers, etc.

### User Types (UserType enum) - Database Driven

The UserType enum is stored in PostgreSQL and retrieved dynamically:

- `Buyer`: Property Buyer (default for new users)
- `Seller`: Property Seller

**Note**: Regular users can only switch between `Buyer` and `Seller`. Only admins can assign `SERVICE_PROVIDER` or other special types. The enum values are stored in proper case in the database and displayed as-is in the UI.

### All Database Enums - Dynamically Retrieved

The system uses the following database-driven enums that are retrieved via `enumService.ts`:

#### Core User Enums

- **UserRole**: `ADMIN`, `USER`, `PRODUCT`, `OPERATOR`, `SERVICE_PROVIDER`
- **UserType**: `Buyer`, `Seller`
- **Country**: `CA`, `US`

#### Property & Business Enums

- **PropertyStatus**: `pending`, `active`, `sold`, `expired`
- **ServiceType**: `lawyer`, `photographer`, `inspector`, `appraiser`, `home_inspector`, `mortgage_broker`, `insurance_agent`, `contractor`, `cleaner`, `stager`, `marketing_agency`
- **BookingStatus**: `pending`, `confirmed`, `completed`, `cancelled`
- **OfferStatus**: `pending`, `reviewed`, `accepted`, `rejected`
- **AccessType**: `qr_scan`, `online_access`
- **SubscriptionStatus**: `active`, `inactive`, `cancelled`, `past_due`, `unpaid`
- **AdvertiserPlan**: `basic`, `premium`, `enterprise`
- **AdvertiserStatus**: `pending`, `active`, `suspended`, `cancelled`

### Database Tables

#### User Table

Main user table that maps to Clerk authentication:

- `id`: UUID primary key
- `email`: Unique email address
- `fullName`: User's full name
- `firstName`: First name
- `lastName`: Last name
- `phone`: Phone number
- `address`: JSON address data
- `clerkUserId`: Maps to Clerk user ID
- `authUserId`: Maps to Supabase auth.users.id
- `role`: UserRole enum (dynamically retrieved from database)
- `userType`: SnbUserType enum (dynamically retrieved from database)
- `isActive`: Boolean flag for user status
- `createdByAdmin`: Reference to admin who created the user
- `lastLoginAt`: Last login timestamp
- `loggedIn`: Current login status
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

#### role_permissions

Permission mapping table:

- `id`: UUID primary key
- `role`: UserRole enum
- `permission`: Permission string (read, write, delete, etc.)
- `resource`: Optional resource identifier
- `createdAt`: Creation timestamp

## Dynamic Enum System

### Enum Service (`/services/enumService.ts`)

All enums are retrieved dynamically from the PostgreSQL database using raw SQL queries:

```typescript
// Get countries from database
export async function getCountriesFromDatabase() {
  const result = await prisma.$queryRaw`
    SELECT enumlabel
    FROM pg_enum
    WHERE enumtypid = (
      SELECT oid
      FROM pg_type
      WHERE typname = 'Country'
    )
    ORDER BY enumlabel;
  `;
  // Returns: [{ code: 'CA', name: 'Canada', flag: '🇨🇦' }, ...]
}

// Get user types from database
export async function getUserTypesFromDatabase() {
  const result = await prisma.$queryRaw`
    SELECT enumlabel
    FROM pg_enum
    WHERE enumtypid = (
      SELECT oid
      FROM pg_type
      WHERE typname = 'UserType'
    )
    ORDER BY enumlabel;
  `;
  // Returns: [{ value: 'Buyer', label: 'Buyer' }, { value: 'Seller', label: 'Seller' }]
}
```

### Benefits of Database-Driven Enums

1. **No Code Changes**: Add new enum values directly in database
2. **Consistency**: Single source of truth for all enum values
3. **Caching**: 5-minute cache to reduce database queries
4. **Type Safety**: TypeScript types generated from Prisma schema
5. **Dynamic UI**: Components automatically reflect new enum values
6. **Direct Display**: Database values stored in proper case and displayed as-is (Buyer/Seller)

### How to Add New Enum Values

To add new enum values without code changes:

```sql
-- Add new user type
ALTER TYPE "UserType" ADD VALUE 'agent';

-- Add new country
ALTER TYPE "Country" ADD VALUE 'MX';

-- Add new service type
ALTER TYPE "ServiceType" ADD VALUE 'real_estate_agent';
```

The UI will automatically pick up these changes after the 5-minute cache expires.

### Enhanced AppContext Implementation

The system uses an enhanced AppContext that integrates role-based authentication with geolocation routing:

```typescript
// AppContext.tsx - Enhanced with role and permission management
import { SnbUserType, UserRole, Country } from "@prisma/client";

export type UserType = SnbUserType; // Buyer | Seller
export type { UserRole, Country }; // ADMIN | USER | PRODUCT | OPERATOR | SERVICE_PROVIDER

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
  userRole: UserRole | null; // Current user's role
  permissions: Permission[]; // User's permissions
  isAdmin: boolean; // Special admin flag

  // Loading States
  isLoading: boolean;
  isUserLoading: boolean;
  isRegionLoading: boolean;

  // Functions
  refreshSnbUser: () => Promise<void>;
  checkPermission: (permission: string, resource?: string) => boolean;
  hasRole: (roles: UserRole[]) => boolean;
  validateAndSetRegion: () => Promise<void>;
}

// Usage in components
const { country, userRole, isAdmin, checkPermission, hasRole } =
  useAppContext();

// Check permissions
if (checkPermission("manage_users")) {
  // Show user management UI
}

// Check roles
if (hasRole(["ADMIN", "PRODUCT"])) {
  // Show admin/product features
}

// Admin-specific features
if (isAdmin) {
  // Show admin-only features
}
```

## Authentication Flow

### 1. User Login

When a user logs in through Clerk:

1. Clerk authenticates the user
2. System calls `UserService.mapAuthUserToSnbUser()`
3. If user exists in SNB database:
   - Updates login timestamp and auth mapping
   - Preserves existing `userType` and `role`
4. If user doesn't exist:
   - Creates new user with default role `USER` and userType `buyer`
   - Maps Clerk user ID to SNB user

### 2. User Type Management

Users can change their `userType` after login:

- Regular users can only switch between `Buyer` and `Seller`
- Available user types are retrieved dynamically from database via `getUserTypesFromDatabase()`
- Admins can assign any userType including `SERVICE_PROVIDER`
- Changes are persisted in the database and reflected in AppContext
- UI components automatically update based on database enum values

### 3. Role Management

Only admins can manage user roles:

- Grant admin roles to other users
- Remove admin roles (except their own)
- Assign `PRODUCT`, `OPERATOR`, or `SERVICE_PROVIDER` roles
- All available roles are retrieved dynamically from database
- Role changes require admin authentication and are immediately reflected

## API Endpoints

### User Management

- `GET /api/user/profile` - Get current user profile
- `PATCH /api/user/profile` - Update user profile
- `PATCH /api/user/user-type` - Update user type (buyer/seller)

### Admin Management

- `GET /api/admin/users` - List all users (paginated)
- `POST /api/admin/users` - Create new user
- `GET /api/admin/users/[id]` - Get user by ID
- `PATCH /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Deactivate user
- `POST /api/admin/roles` - Grant role to user
- `DELETE /api/admin/roles` - Remove role from user
- `GET /api/admin/dashboard` - Admin dashboard statistics

### Testing

- `GET /api/test-auth` - Test authentication flow

## Permission System

### Default Permissions

#### ADMIN

- Full access to all resources
- User management
- Role management
- Admin dashboard access
- Bulk email/notification sending

#### USER

- Read/write own profile
- Read properties
- Save properties and searches
- Write own properties

#### PRODUCT

- User permissions plus:
- Manage all listings
- View analytics
- Product management features

#### OPERATOR

- User permissions plus:
- Content moderation
- Support ticket management
- Operations dashboard access

#### SERVICE_PROVIDER

- User permissions plus:
- Service provider specific features
- Booking management
- Service portfolio management
- Client communication tools

## Current Models & Latest Implementation

### User Model (Prisma Schema)

```typescript
model User {
  id                  String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email               String            @unique
  fullName            String
  firstName           String?
  lastName            String?
  phone               String?
  address             Json?
  clerkUserId         String?           @unique
  authUserId          String?           @unique
  role                UserRole?         @default(USER)
  userType            SnbUserType?      @default(buyer)
  isActive            Boolean?          @default(true)
  createdByAdmin      String?           @db.Uuid
  lastLoginAt         DateTime?         @db.Timestamptz(6)
  loggedIn            Boolean?          @default(false)
  createdAt           DateTime?         @default(now()) @db.Timestamptz(6)
  updatedAt           DateTime?         @default(now()) @updatedAt @db.Timestamptz(6)
  // ... other fields
}

enum UserRole {
  ADMIN
  USER
  PRODUCT
  OPERATOR
  SERVICE_PROVIDER
}

enum SnbUserType {
  Buyer
  Seller
  @@map("UserType")
}
```

### What Happens with Latest Models

1. **Dynamic Enum Loading**: All enum values are loaded from PostgreSQL at runtime
2. **Type Safety**: Prisma generates TypeScript types from database schema
3. **UI Updates**: Components automatically reflect new enum values without code changes
4. **Caching**: 5-minute cache reduces database queries for enum values
5. **Direct Display**: Database values stored in proper case and displayed as-is (Buyer/Seller)
6. **Geolocation Integration**: Country enum drives geolocation-based routing
7. **Role-Based Access**: UserRole enum controls access to different features
8. **Service Provider Support**: New SERVICE_PROVIDER role enables contractor features

### Adding New Enum Values

When you add new enum values to the database:

```sql
-- Add new user type (will appear as "Agent" in UI)
ALTER TYPE "UserType" ADD VALUE 'Agent';

-- Add new role
ALTER TYPE "UserRole" ADD VALUE 'MODERATOR';

-- Add new country
ALTER TYPE "Country" ADD VALUE 'MX';
```

The system will automatically:

1. Pick up new values after cache expires (5 minutes)
2. Display them in dropdowns and selectors
3. Allow users to select new values
4. Maintain type safety through Prisma-generated types
5. Update routing for new countries (if applicable)

## Usage Examples

### Check User Authentication

```typescript
import { getAuthUser } from "@/lib/auth";

const user = await getAuthUser();
if (user) {
  console.log(
    `User: ${user.email}, Role: ${user.role}, Type: ${user.userType}`
  );
}
```

### Require Admin Access

```typescript
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin(); // Redirects if not admin
  // Admin-only logic here
}
```

### Check Permissions

```typescript
import { hasPermission } from "@/lib/auth";

const user = await getAuthUser();
if (hasPermission(user, "write", "properties")) {
  // User can write properties
}
```

### Update User Type

```typescript
// API call to update user type (database value is proper case)
const response = await fetch("/api/user/user-type", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userType: "Seller" }), // proper case in database
});

// In UI components, display as-is from database
const userTypeDisplay = userType; // Already proper case: "Buyer" or "Seller"
```

### Using Dynamic Enums in Components

```typescript
// Get enum values from database
const { countries, userTypes } = useAppContext();

// userTypes will be: [{ value: 'Buyer', label: 'Buyer' }, { value: 'Seller', label: 'Seller' }]
// countries will be: [{ code: 'CA', name: 'Canada', flag: '🇨🇦' }, { code: 'US', name: 'United States', flag: '🇺🇸' }]

// Use in dropdown
<Select>
  {userTypes.map(type => (
    <option key={type.value} value={type.value}>
      {type.label} {/* Displays "Buyer" or "Seller" */}
    </option>
  ))}
</Select>
```

## Admin Features

### Special Admin User

- Email: `javian.picardo.sonobrokers@gmail.com`
- Role: `ADMIN`
- Can access admin dashboard
- Can send bulk emails/notifications
- Can manage other admin users

### Admin Dashboard

Provides statistics on:

- Total users by role and type
- Active users
- Recent registrations
- Login activity
- Subscription statistics

### Bulk Operations

Admins can perform bulk operations:

- Send group emails
- Send bulk notifications
- Manage multiple users

## Security Considerations

1. **Role Validation**: All role changes require admin authentication
2. **Self-Protection**: Admins cannot remove their own admin role
3. **User Type Restrictions**: Regular users can only be Buyer/Seller
4. **Permission Checks**: All sensitive operations check permissions
5. **Active Status**: Deactivated users lose all access

## Migration Notes

- Database schema created directly (no migrations needed as tables were empty)
- Existing user data preserved during schema updates
- Backward compatible with existing authentication flows
