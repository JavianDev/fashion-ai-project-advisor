# SoNoBrokers Application Flow - Quick Reference

## 🔄 Request Flow Overview

```
User Request → Middleware → Authentication → Layout → RegionCheck → AppContext → Content
```

## 🎯 Key Components

### 1. **Middleware** (`src/middleware.ts`)

- **Purpose**: Traffic controller for all requests
- **Functions**: Route protection, authentication, region validation
- **Modes**: Launch mode vs Normal mode

### 2. **Layout** (`src/app/layout.tsx`)

- **Purpose**: Provider hierarchy and error boundaries
- **Structure**: ErrorBoundary → Clerk → Theme → AppContext
- **Modes**: Launch page vs Full app

### 3. **RegionCheck** (`src/components/shared/common/RegionCheck.tsx`)

- **Purpose**: Country detection and validation
- **Supported**: CA, US, UAE
- **Fallback**: Redirect to unsupported region page

### 4. **AppContext** (`src/contexts/AppContext.tsx`)

- **Purpose**: Global state management
- **Manages**: Country, user data, authentication, roles
- **Integration**: Syncs with Clerk and SNB database

## 🌍 Country Support

| Country          | Code | Features                       | Compliance             |
| ---------------- | ---- | ------------------------------ | ---------------------- |
| 🇨🇦 Canada        | CA   | Bilingual, MLS alternatives    | Provincial regulations |
| 🇺🇸 United States | US   | State-specific, Title services | Federal/State laws     |
| 🇦🇪 UAE           | UAE  | Arabic support, Investment     | RERA compliance        |

## 🔐 Authentication Flow

```
Request → Clerk Auth → SNB User Lookup → Role/Permission Loading → Content
```

### User Roles

- **ADMIN**: Full system access
- **USER**: Standard buyer/seller
- **PRODUCT**: Product management
- **OPERATOR**: Content moderation
- **SERVICE_PROVIDER**: Professional services

## 📁 Folder Structure

### Current Issues

```
src/
├── lib/           # Core utilities
├── libs/          # ❌ Legacy (needs consolidation)
├── services/      # Business services
├── utils/         # ❌ Scattered utilities
└── helpers/       # ❌ Scattered helpers
```

### Recommended Structure

```
src/
├── lib/           # ✅ Core utilities only
├── services/      # ✅ All business logic
├── contexts/      # ✅ React contexts
├── components/    # ✅ UI components
├── hooks/         # ✅ Custom hooks
└── types/         # ✅ TypeScript types
```

## 🚨 Current Issues

### ❌ Known Problems

1. **Clerk API Authentication**: "Client Component" errors in API routes
2. **Folder Structure**: Scattered service directories
3. **Performance**: Some optimization opportunities

### ✅ Working Features

- Middleware with error handling
- Region detection (CA/US/UAE)
- Layout provider hierarchy
- Error boundaries
- Launch mode functionality
- Concierge services

## 🔧 Quick Fixes

### Fix Environment Configuration

```bash
# Issue: .env.development.local overrides .env
# Solution: Remove .env.development.local to use .env as primary source
rm .env.development.local

# Update .gitignore to properly ignore local env files
# Add these lines to .gitignore:
.env*.local
.env.development.local
.env.production.local
```

**Environment File Priority (Next.js):**

1. `.env.development.local` ← **HIGHEST** (overrides everything)
2. `.env.local` ← (all environments, gitignored)
3. `.env.development` ← (development only)
4. `.env` ← **LOWEST** (should be your main config)

### Fix Authentication Issues

```typescript
// Use getAuthUserAPI() for API routes instead of getAuthUser()
import { getAuthUserAPI } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUserAPI();
  // Handle authentication
}
```

### Fix Region Tester

```typescript
// Correct import path (component is in proper location)
import { RegionTester } from "@/components/shared/dev/RegionTester";
```

### Consolidate Services

```bash
# Move libs content to services
mv src/libs/* src/services/
# Update imports across codebase
```

## 🎯 Development Workflow

### Testing Different Countries

1. Open `/region-tester` in development
2. Set test country in localStorage
3. Refresh to test country-specific features

### Launch Mode Toggle

```bash
# Enable launch mode
NEXT_PUBLIC_LAUNCH_MODE=true

# Disable launch mode (normal operation)
NEXT_PUBLIC_LAUNCH_MODE=false
```

### Error Debugging

1. Check browser console for client errors
2. Check server logs for API errors
3. Use ErrorBoundary fallbacks for crash recovery

## 📊 Performance Tips

### Caching Strategy

- User preferences: localStorage (persistent)
- User profiles: 5-minute cache
- Country detection: Session cache

### Loading Optimization

- Skeleton UI for initial loads
- Lazy loading for non-critical components
- Progressive data loading

## 🔮 Next Steps

### Immediate (Q1 2025)

1. Fix Clerk authentication in API routes
2. Consolidate folder structure
3. Enhance error monitoring

### Medium-term (Q2 2025)

1. Advanced caching mechanisms
2. Real-time features
3. Mobile optimization

### Long-term (Q3 2025)

1. Mobile application
2. Additional countries
3. Advanced analytics

---

**Quick Links:**

- [Full Architecture Document](./APPLICATION_FLOW_ARCHITECTURE.md)
- [Project Requirements](./PROJECT_REQUIREMENTS_DOCUMENT.md)
- [Development Setup](../README.md)

**Last Updated**: June 19, 2025
