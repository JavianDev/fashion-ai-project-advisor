## 🚨 **SoNoBrokers Folder Structure - Next.js 15 (Updated)**

### Current Implementation Status

✅ **Completed**: Archive migration, server/client component separation, service organization
✅ **Active**: [country] dynamic routing, middleware, role-based authentication
✅ **Implemented**: shadcn/ui integration, proper component organization
📋 **Planned**: Content management, advanced factories

### Recent Updates (Latest Migration)

🎯 **Archive Migration Completed**: All components moved from `_archive` to proper locations
🔧 **Server/Client Separation**: ServiceLayout split into server wrapper + client component
🗑️ **Cleanup**: Removed duplicate/outdated service components
✅ **Build Success**: All imports fixed, no broken references

---

## 📁 **Complete Project Structure**

```
SoNoBrokers/
├── src/
│   ├── app/                              # Next.js 15 App Router
│   │   ├── [country]/                    # Dynamic country routing (CA, US, UAE)
│   │   │   ├── page.tsx                  # Country-specific home page
│   │   │   ├── layout.tsx                # Country-specific layout
│   │   │   ├── loading.tsx               # Country-specific loading
│   │   │   ├── not-found.tsx             # Country-specific 404
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx              # Country dashboard
│   │   │   │   └── layout.tsx            # Dashboard layout
│   │   │   │
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx              # Properties listing (server component)
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx          # Property detail
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   └── page.tsx      # Edit property
│   │   │   │   │   └── open-house/
│   │   │   │   │       └── page.tsx      # Open house page
│   │   │   │   ├── new/
│   │   │   │   │   ├── page.tsx          # Create property
│   │   │   │   │   └── ai/
│   │   │   │   │       └── page.tsx      # AI property creator
│   │   │   │   └── open-houses/
│   │   │   │       └── page.tsx          # Open houses listing
│   │   │   │
│   │   │   ├── services/                 # Service pages (all server components)
│   │   │   │   ├── page.tsx              # Services overview
│   │   │   │   ├── legal/
│   │   │   │   │   ├── page.tsx          # Legal services page
│   │   │   │   │   └── LegalService.tsx  # Legal service component
│   │   │   │   ├── photography/
│   │   │   │   │   ├── page.tsx          # Photography services
│   │   │   │   │   └── PhotographyService.tsx
│   │   │   │   ├── mortgage/
│   │   │   │   │   ├── page.tsx          # Mortgage services
│   │   │   │   │   └── MortgageService.tsx
│   │   │   │   ├── mortgage-calculator/
│   │   │   │   │   └── page.tsx          # Mortgage calculator
│   │   │   │   ├── home-inspection/
│   │   │   │   │   ├── page.tsx          # Home inspection
│   │   │   │   │   └── HomeInspectionService.tsx
│   │   │   │   ├── insurance/
│   │   │   │   │   ├── page.tsx          # Insurance services
│   │   │   │   │   └── InsuranceService.tsx
│   │   │   │   ├── moving/
│   │   │   │   │   ├── page.tsx          # Moving services
│   │   │   │   │   └── MovingService.tsx
│   │   │   │   ├── staging/
│   │   │   │   │   ├── page.tsx          # Staging services
│   │   │   │   │   └── StagingService.tsx
│   │   │   │   ├── marketing/
│   │   │   │   │   ├── page.tsx          # Marketing services
│   │   │   │   │   └── MarketingService.tsx
│   │   │   │   └── ai-property-creator/
│   │   │   │       └── page.tsx          # AI property creator
│   │   │   │
│   │   │   ├── resources/                # Resource pages
│   │   │   │   ├── page.tsx              # Resources overview
│   │   │   │   ├── buyers-guide/
│   │   │   │   ├── seller-guide/
│   │   │   │   ├── market-analysis/
│   │   │   │   ├── commission-calculator/
│   │   │   │   ├── pricing-calculator/
│   │   │   │   └── tax-calculator/
│   │   │   │
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx              # Admin dashboard
│   │   │   │   ├── settings/
│   │   │   │   │   └── page.tsx          # Admin settings
│   │   │   │   └── users/
│   │   │   │       └── page.tsx          # User management
│   │   │   │
│   │   │   ├── user/
│   │   │   │   ├── settings/
│   │   │   │   │   └── page.tsx          # User settings
│   │   │   │   └── profile/
│   │   │   │       └── page.tsx          # User profile
│   │   │   │
│   │   │   ├── advertise/
│   │   │   │   └── page.tsx              # Advertise page
│   │   │   │
│   │   │   ├── contact/
│   │   │   │   └── page.tsx              # Contact page
│   │   │   │
│   │   │   └── list-property/
│   │   │       └── page.tsx              # List property page
│   │   │
│   │   ├── unsupported-region/
│   │   │   ├── page.tsx                  # Unsupported region page
│   │   │   └── layout.tsx                # Minimal layout
│   │   │
│   │   ├── region-tester/
│   │   │   └── page.tsx                  # Development region testing
│   │   │
│   │   ├── api/                          # API routes (to be migrated to .NET)
│   │   │   ├── geo/
│   │   │   ├── properties/
│   │   │   ├── users/
│   │   │   ├── admin/
│   │   │   └── stripe/
│   │   │
│   │   ├── globals.css                   # Global styles
│   │   ├── layout.tsx                    # Root layout
│   │   └── middleware.ts                 # Country detection & routing
```
