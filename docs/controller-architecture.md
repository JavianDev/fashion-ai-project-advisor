# SoNoBrokers Controller Architecture Guide

## Overview

This document describes the reorganized controller architecture implemented in December 2024. The Web API now follows a clear separation between Core system functionality and SoNoBrokers business logic.

## Architecture Principles

### Separation of Concerns
- **Core Controllers**: Handle system-level operations (user management, analytics, authentication)
- **SoNoBrokers Controllers**: Handle business-specific operations (properties, subscriptions)

### Routing Structure
```
/api/
├── core/                    # Core system functionality
│   ├── user/               # User management
│   ├── user/analytics/     # User analytics & sessions
│   └── clerk/              # Authentication webhooks
├── sonobrokers/            # Business logic
│   ├── properties/         # Property management
│   ├── subscriptions/      # Subscription management
│   └── test/              # Testing endpoints
└── health                  # Health monitoring
```

## Core Controllers (`/api/core/`)

### 1. UserController (`/api/core/user`)

**Location**: `Controllers/Core/User/UserController.cs`
**Namespace**: `MicroSaasWebApi.App.Controllers.Core.User`

#### Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/core/user` | Get all users | Admin |
| GET | `/api/core/user/{id}` | Get user by ID | Admin/Self |
| POST | `/api/core/user` | Create new user | Admin |
| PUT | `/api/core/user/{id}` | Update user | Admin/Self |
| DELETE | `/api/core/user/{id}` | Delete user | Admin |
| GET | `/api/core/user/by-email/{email}` | Get user by email | Admin |
| PATCH | `/api/core/user/{id}/login-status` | Update login status | System |
| GET | `/api/core/user/profile` | Get current user profile | User |
| PUT | `/api/core/user/profile` | Update current user profile | User |
| PUT | `/api/core/user/user-type` | Update user type (Buyer/Seller) | User |
| POST | `/api/core/user/sync` | Sync user with Clerk | User |
| PUT | `/api/core/user/{id}/role` | Update user role | Admin |
| PUT | `/api/core/user/{id}/status` | Update user status | Admin |

#### Key Features
- Complete user lifecycle management
- Clerk authentication integration
- Role-based access control (USER, ADMIN, PRODUCT, OPERATOR)
- User type management (Buyer, Seller)
- Profile management with validation

### 2. UserAnalyticsController (`/api/core/user/analytics`)

**Location**: `Controllers/Core/User/UserAnalyticsController.cs`
**Namespace**: `MicroSaasWebApi.App.Controllers.Core.User`

#### Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/core/user/analytics/dashboard/overview` | Get dashboard overview | User |
| GET | `/api/core/user/analytics/users/online` | Get online users | Admin |
| GET | `/api/core/user/analytics/users/{userId}/activity` | Get user activity | Admin/Self |
| POST | `/api/core/user/analytics/users/online` | Update online status | User |

#### Key Features
- Real-time user session tracking
- Dashboard analytics and metrics
- Online user monitoring
- Activity logging and reporting

### 3. ClerkWebhookController (`/api/core/clerk/webhooks`)

**Location**: `Controllers/Core/Clerk/ClerkWebhookController.cs`
**Namespace**: `MicroSaasWebApi.App.Controllers.Core.Clerk`

#### Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/core/clerk/webhooks` | Handle Clerk webhooks | Webhook |

#### Key Features
- Clerk authentication webhook handling
- User creation and updates from Clerk
- Webhook signature verification
- Event processing (user.created, user.updated, etc.)

## SoNoBrokers Controllers (`/api/sonobrokers/`)

### 1. PropertiesController (`/api/sonobrokers/properties`)

**Location**: `Controllers/SoNoBrokers/PropertiesController.cs`
**Namespace**: `MicroSaasWebApi.Controllers.SoNoBrokers`

#### Key Features
- Property CRUD operations
- Property search and filtering
- Image management
- Property analytics
- Seller property management

### 2. SubscriptionsController (`/api/sonobrokers/subscriptions`)

**Location**: `Controllers/SoNoBrokers/SubscriptionsController.cs`
**Namespace**: `MicroSaasWebApi.Controllers.SoNoBrokers`

#### Key Features
- Subscription management
- Payment processing integration
- Plan management
- Billing operations

## Health & Monitoring

### Health Check (`/health`)

**Location**: Built-in ASP.NET Core health checks
**Purpose**: Application health monitoring

#### Features
- Database connectivity check
- Service health validation
- Dependency health monitoring
- Load balancer health checks

### Test Endpoints (`/api/sonobrokers/test`)

**Location**: `Controllers/SoNoBrokers/PropertiesController.cs` (test methods)

#### Endpoints
- `GET /api/sonobrokers/test/ping` - API connectivity test

## Authentication & Authorization

### JWT Token Validation
- All protected endpoints require valid Clerk JWT tokens
- Token validation handled by middleware
- Claims-based authorization

### Role-Based Access Control

#### User Roles
- **USER**: Standard user access
- **ADMIN**: Full system access
- **PRODUCT**: Product team access
- **OPERATOR**: Operations team access

#### User Types
- **Buyer**: Property buyers
- **Seller**: Property sellers

### Authorization Patterns

```csharp
// Admin only
[Authorize(Roles = "ADMIN")]

// User or Admin
[Authorize]

// Specific user type
[Authorize(Policy = "SellerOnly")]
```

## Service Layer Integration

### Core Services
- **UserService**: User management operations
- **UserSessionService**: Analytics and session tracking
- **ClerkWebhookService**: Webhook processing

### SoNoBrokers Services
- **PropertyService**: Property operations
- **SubscriptionService**: Subscription management
- **PropertyImageService**: Image handling

## Database Integration

### Core Tables
- `users` - User management
- `user_sessions` - Session tracking
- `user_analytics` - Analytics data

### SoNoBrokers Tables
- `properties` - Property listings
- `subscriptions` - User subscriptions
- `property_images` - Property images

## Error Handling

### Standardized Response Format
```json
{
  "success": true/false,
  "data": {},
  "message": "Success/Error message",
  "errors": [],
  "statusCode": 200,
  "timestamp": "2024-12-31T00:00:00Z"
}
```

### Error Types
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

## Testing Strategy

### Unit Tests
- Controller action tests
- Service layer tests
- Model validation tests

### Integration Tests
- API endpoint tests
- Database integration tests
- Authentication flow tests

### API Testing Tools
- Node.js test script: `test-api-connectivity.js`
- React test component: `/test/api-connectivity`
- Manual testing with curl commands

## Migration Benefits

### Before (Old Structure)
```
Controllers/SoNoBrokers/
├── UsersController.cs          # Mixed concerns
├── UserAnalyticsController.cs  # Analytics mixed with business
├── ClerkWebhookController.cs   # Auth mixed with business
└── PropertiesController.cs     # Business logic
```

### After (New Structure)
```
Controllers/
├── Core/                       # System functionality
│   ├── User/UserController.cs
│   ├── User/UserAnalyticsController.cs
│   └── Clerk/ClerkWebhookController.cs
└── SoNoBrokers/               # Business functionality
    ├── PropertiesController.cs
    └── SubscriptionsController.cs
```

### Advantages
1. **Clear Separation**: Core vs business logic
2. **Better Organization**: Logical grouping of related functionality
3. **Easier Maintenance**: Focused responsibilities
4. **Scalability**: Easy to add new core or business controllers
5. **Testing**: Isolated testing of different concerns
6. **Documentation**: Clear API structure

## Next Steps

1. **Complete Migration**: Finish moving remaining controllers
2. **Add More Core Features**: Notifications, audit logging
3. **Enhance Analytics**: Real-time dashboards
4. **Improve Testing**: Comprehensive test coverage
5. **Performance Optimization**: Caching and query optimization

## Related Documentation

- [API Integration Guide](./API-Integration.md)
- [React-API Mapping](./React-API-Mapping.md)
- [Testing Guide](./TESTING_RESULTS.md)
- [Environment Configuration](./ENVIRONMENT_CONFIGURATION.md)
