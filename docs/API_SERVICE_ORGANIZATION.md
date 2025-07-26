# API Service Organization Guide

## Overview

This document clarifies the organization and separation of concerns between different API service files in the SoNoBrokers React application.

## File Structure & Responsibilities

### 🔐 **auth-api.ts** - Authentication & Current User Operations

**Purpose**: Handles authentication state and current user operations

**Responsibilities**:
- Current user profile operations (`getCurrentUserProfile`, `updateUserProfile`)
- User type management (`updateUserType`) - Buyer/Seller selection
- Clerk authentication integration (`syncUserWithClerk`)
- Authentication state checks (`isAuthenticated`, `isAdmin`, `isProductUser`)
- Authentication utilities (`getAuthToken`, `getUserRole`)

**Key Functions**:
```typescript
// Current user operations
getCurrentUserProfile(): Promise<UserProfile | null>
updateUserProfile(data: UpdateUserProfileRequest): Promise<UserProfile | null>
updateUserType(userType: 'Buyer' | 'Seller'): Promise<UserProfile | null>

// Authentication state
isAuthenticated(): Promise<boolean>
isAdmin(): Promise<boolean>
isProductUser(): Promise<boolean>
getUserRole(): Promise<string | null>

// Clerk integration
syncUserWithClerk(): Promise<UserProfile | null>
getAuthToken(): Promise<string | null>
```

**API Endpoints Used**:
- `GET /api/core/user/profile` - Get current user profile
- `PUT /api/core/user/profile` - Update current user profile
- `PUT /api/core/user/user-type` - Update user type (Buyer/Seller)
- `POST /api/core/user/sync` - Sync with Clerk

---

### 👥 **user-api.ts** - User Management Operations

**Purpose**: Handles user management and administration functions

**Responsibilities**:
- User CRUD operations (admin functions)
- User search and filtering
- User role/status management (admin operations)
- User login status updates
- User administration functions

**Key Functions**:
```typescript
// User CRUD (Admin operations)
getAllUsers(): Promise<UserProfile[]>
getUserById(id: string): Promise<UserProfile | null>
getUserByEmail(email: string): Promise<UserProfile | null>
createUser(userData: CreateUserRequest): Promise<UserProfile | null>
deleteUser(id: string): Promise<boolean>

// User administration
updateUserRole(userId: string, role: string): Promise<UserProfile | null>
updateUserStatus(userId: string, isActive: boolean): Promise<UserProfile | null>
updateUserLoginStatus(id: string, loggedIn: boolean): Promise<void>

// User search & filtering
searchUsers(params: UserSearchParams): Promise<UserSearchResponse | null>
getUsersByType(userType: 'Buyer' | 'Seller'): Promise<UserProfile[]>
```

**API Endpoints Used**:
- `GET /api/core/user` - Get all users
- `GET /api/core/user/{id}` - Get user by ID
- `GET /api/core/user/by-email/{email}` - Get user by email
- `POST /api/core/user` - Create user
- `PUT /api/core/user/{id}` - Update user
- `DELETE /api/core/user/{id}` - Delete user
- `PUT /api/core/user/{id}/role` - Update user role
- `PUT /api/core/user/{id}/status` - Update user status
- `PATCH /api/core/user/{id}/login-status` - Update login status

---

### 🏠 **properties-api.ts** - Property Management

**Purpose**: Handles property-related operations

**Responsibilities**:
- Property CRUD operations
- Property search and filtering
- Property image management
- Property analytics

---

### 🎯 **Other API Services**

- **advertisers-api.ts** - Service provider management
- **ai-property-api.ts** - AI-powered property services
- **admin-api.ts** - Administrative operations
- **contact-sharing-api.ts** - Contact sharing functionality
- **messaging-api.ts** - Real-time messaging
- **stripe-api.ts** - Payment processing

## Usage Guidelines

### ✅ **When to use auth-api.ts**

```typescript
import { getCurrentUserProfile, updateUserType, isAdmin } from '@/lib/api/auth-api'

// Getting current user's profile
const profile = await getCurrentUserProfile()

// Updating current user's type
await updateUserType('Seller')

// Checking authentication state
const isUserAdmin = await isAdmin()
```

### ✅ **When to use user-api.ts**

```typescript
import { getAllUsers, updateUserRole, getUserById } from '@/lib/api/user-api'

// Admin operations - managing other users
const allUsers = await getAllUsers()
await updateUserRole(userId, 'ADMIN')
const user = await getUserById(userId)
```

## Migration Notes

### ✅ **Completed Changes**

1. **Consolidated Duplicate Files**: Merged `users-api.ts` into `user-api.ts`
2. **Updated Endpoints**: All endpoints now use new Core controller structure (`/api/core/user/*`)
3. **Clear Separation**: Authentication vs User Management operations
4. **Consistent Patterns**: Unified error handling and authentication

### ⚠️ **Important Notes**

1. **Authentication Required**: All functions require valid Clerk JWT tokens
2. **Admin Functions**: User management operations typically require admin privileges
3. **Error Handling**: Both services use consistent error handling patterns
4. **Type Safety**: Full TypeScript support with proper type definitions

## API Endpoint Mapping

### Core User Endpoints (`/api/core/user/*`)

| Endpoint | Method | Used By | Purpose |
|----------|--------|---------|---------|
| `/api/core/user/profile` | GET | auth-api.ts | Get current user profile |
| `/api/core/user/profile` | PUT | auth-api.ts | Update current user profile |
| `/api/core/user/user-type` | PUT | auth-api.ts | Update user type (Buyer/Seller) |
| `/api/core/user/sync` | POST | auth-api.ts | Sync with Clerk |
| `/api/core/user` | GET | user-api.ts | Get all users (admin) |
| `/api/core/user/{id}` | GET | user-api.ts | Get user by ID (admin) |
| `/api/core/user/{id}` | PUT | user-api.ts | Update user (admin) |
| `/api/core/user/{id}` | DELETE | user-api.ts | Delete user (admin) |
| `/api/core/user/{id}/role` | PUT | user-api.ts | Update user role (admin) |
| `/api/core/user/{id}/status` | PUT | user-api.ts | Update user status (admin) |

## Best Practices

1. **Use Appropriate Service**: Choose auth-api.ts for current user operations, user-api.ts for admin operations
2. **Error Handling**: Always handle authentication errors and API failures
3. **Type Safety**: Use provided TypeScript types for all operations
4. **Consistent Patterns**: Follow established patterns for new API functions
5. **Documentation**: Keep this guide updated when adding new functions

## Testing

Both services can be tested using the API connectivity test tools:
- Node.js script: `test-api-connectivity.js`
- React component: `/test/api-connectivity`

The test tools validate all endpoints and provide real-time feedback on API connectivity and functionality.
