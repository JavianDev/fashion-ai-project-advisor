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
│   │
│   ├── components/                       # Component organization
│   │   ├── shared/                       # Components used across all countries
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx            # Global header with navigation
│   │   │   │   ├── Footer.tsx            # Global footer
│   │   │   │   └── Layout.tsx            # Main layout wrapper
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── HeroSection.tsx       # Shared hero component
│   │   │   │   ├── RegionCheck.tsx       # Country detection component
│   │   │   │   ├── UnsupportedRegion.tsx # Unsupported region page
│   │   │   │   └── ShowcaseCard.tsx      # Showcase card component
│   │   │   │
│   │   │   ├── properties/
│   │   │   │   ├── PropertyCard.tsx      # Property card component (server)
│   │   │   │   ├── OpenHouseCard.tsx     # Open house card component
│   │   │   │   ├── PropertySearchClient.tsx # Property search (client component)
│   │   │   │   ├── OpenHouseSearchClient.tsx # Open house search (client component)
│   │   │   │   └── GoogleMap.tsx         # Google Maps integration
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── ServiceLayout.tsx     # Service layout (server wrapper)
│   │   │   │   ├── ServiceLayoutClient.tsx # Service layout (client component)
│   │   │   │   └── MortgageCalculator.tsx # Mortgage calculator component
│   │   │   │
│   │   │   ├── sections/
│   │   │   │   ├── CallToAction.tsx      # CTA section component
│   │   │   │   └── StepsSection.tsx      # Steps section component
│   │   │   │
│   │   │   └── dev/
│   │   │       └── RegionTester.tsx      # Development region testing
│   │   │
│   │   ├── country-specific/             # Country-specific components
│   │   │   ├── ca/                       # Canada-specific components
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── PropertySearch.tsx
│   │   │   │   └── ServiceProviders.tsx
│   │   │   │
│   │   │   ├── us/                       # US-specific components
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── PropertySearch.tsx
│   │   │   │   └── StateSelector.tsx
│   │   │   │
│   │   │   └── uae/                      # UAE-specific components
│   │   │       ├── HeroSection.tsx
│   │   │       ├── PropertySearch.tsx
│   │   │       └── PostcodeValidator.tsx
│   │   │
│   │   ├── ui/                           # shadcn/ui components ONLY
│   │   │   ├── button.tsx                # Button component
│   │   │   ├── card.tsx                  # Card component
│   │   │   ├── dialog.tsx                # Dialog/Modal component
│   │   │   ├── form.tsx                  # Form components
│   │   │   ├── input.tsx                 # Input component
│   │   │   ├── select.tsx                # Select dropdown component
│   │   │   ├── slider.tsx                # Slider component
│   │   │   ├── badge.tsx                 # Badge component
│   │   │   ├── label.tsx                 # Label component
│   │   │   ├── navigation-menu.tsx       # Navigation menu component
│   │   │   ├── dropdown-menu.tsx         # Dropdown menu component
│   │   │   └── [other-shadcn-components].tsx # Additional shadcn/ui components
│   │   │
│   │   └── _archive/                     # Legacy components (cleaned up)
│   │       ├── ✅ services/ folder       # REMOVED - All components migrated
│   │       ├── ✅ RegionCheck.tsx        # MOVED to shared/common/
│   │       ├── ✅ UnsupportedRegion.tsx  # MOVED to shared/common/
│   │       ├── ✅ ShowcaseCard.tsx       # MOVED to shared/common/
│   │       ├── ✅ OpenHouseCard.tsx      # MOVED to shared/properties/
│   │       ├── ✅ sections/ folder       # MOVED to shared/sections/
│   │       ├── ✅ PropertyCard.tsx       # REMOVED (using shared version)
│   │       ├── ✅ Logo component refs    # FIXED (replaced with text)
│   │       └── 📁 Remaining legacy       # Non-critical archive components
│   │
│   ├── lib/                              # Utility libraries
│   │   ├── config/
│   │   │   ├── countries.ts              # Country configurations
│   │   │   ├── features.ts               # Feature flags per country
│   │   │   └── database.ts               # Database configuration
│   │   ├── utils/
│   │   │   ├── country-detection.ts      # Country detection logic
│   │   │   ├── geo-utils.ts              # Geographical utilities
│   │   │   ├── feature-flags.ts          # Feature flag utilities
│   │   │   └── api-client.ts             # .NET API client
│   │   ├── hooks/
│   │   │   ├── useCountryFeatures.ts     # Hook for country-specific features
│   │   │   ├── useRegionalData.ts        # Hook for regional data
│   │   │   └── useAppContext.ts          # App context hook
│   │   └── types/
│   │       ├── country.ts                # Country-related types
│   │       ├── regional.ts               # Regional data types
│   │       ├── property.ts               # Property types
│   │       └── user.ts                   # User types
│   │
│   ├── content/                          # Country-specific content
│   │   ├── ca/
│   │   │   ├── legal.md
│   │   │   ├── privacy-policy.md
│   │   │   ├── terms-of-service.md
│   │   │   └── services.md
│   │   ├── us/
│   │   │   ├── legal.md
│   │   │   ├── privacy-policy.md
│   │   │   ├── terms-of-service.md
│   │   │   └── services.md
│   │   ├── uae/
│   │   │   ├── legal.md
│   │   │   ├── privacy-policy.md
│   │   │   ├── terms-of-service.md
│   │   │   └── services.md
│   │   └── unsupported/
│   │       └── message.md
│   │
│   └── styles/                           # Styling
│       ├── globals.css
│       ├── countries/
│       │   ├── ca.css                    # Canada-specific styles
│       │   ├── us.css                    # US-specific styles
│       │   └── uae.css                   # UAE-specific styles
│       └── components/
│           └── [component-name].module.css
│
├── public/
│   ├── images/
│   │   ├── ca/                           # Canada-specific images
│   │   ├── us/                           # US-specific images
│   │   ├── uae/                          # UAE-specific images
│   │   └── shared/                       # Shared images
│   └── locales/                          # Translation files
│       ├── ca/
│       │   ├── en.json
│       │   └── fr.json
│       ├── us/
│       │   └── en.json
│       └── uae/
│           └── en.json
│
├── docs/                                 # Documentation
├── prisma/                               # Database schema (legacy)
└── package.json
```
