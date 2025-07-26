# SonoBrokers Platform - System Patterns

## System Architecture

- **Frontend:** Next.js SPA with server-side rendering for SEO, Tailwind CSS for styling, Headless UI/Radix UI for components
- **Service Layer:** Next.js API routes as serverless functions, handling business logic and integration with external services
- **Data Layer:** Supabase PostgreSQL with PostGIS for geospatial queries, Prisma ORM for schema and migrations
- **Authentication:** Clerk.com for user management and JWT-based auth, with role-based access control (RBAC)
- **Payments:** Stripe Connect for listing, subscription, and service payments
- **Workflow Automation:** Make.com/n8n for notifications and process management
- **File Storage:** Supabase Storage for images and documents
- **Support & Analytics:** Crisp for live chat, Google Analytics 4 for tracking
- **Theme System:** Radix UI shadn cn ui theme (green/gray) injected as CSS variables for both light and dark themes

## Key Technical Decisions

- Next.js chosen for SSR, API routes, and modern React features
- Supabase selected for managed PostgreSQL and real-time features
- Clerk.com for robust, multi-role authentication
- Stripe for secure, flexible payments
- Use of SaaS integrations to accelerate development and ensure best practices
- Serverless architecture for scalability and cost efficiency
- Radix UI color palette and theme system for a clean, professional look

## Design Patterns

- **Service Layer Pattern:** API routes encapsulate business logic, decoupling frontend from backend
- **Repository Pattern:** Prisma models abstract database access
- **RBAC:** Role-based access enforced at API and UI layers
- **Event-Driven:** Workflow automation via Make.com/n8n for notifications and process triggers
- **Modular UI:** Component-driven design with Headless UI, Radix, DaisyUI, and Shadcn UI
- **Region-Aware Routing:** Country detection on first load, with region-based routing and unsupported region fallback
- **Role-Based Onboarding:** Onboarding flow prompts user to select buyer/seller, creates DB profile, and sets dashboard mode
- **Role Switcher:** (Upcoming) Modern, animated control in dashboard to switch between buyer/seller modes
- **Slim Animated UI:** All buttons and switches are slim, animated, and use Radix color variables for a world-class look

## Component Relationships

- User flows: Auth → Onboarding (country/role) → Listing → Search → Messaging → Transaction
- API routes interact with Prisma models and external services
- UI components consume API endpoints and reflect real-time state
- Integrations (Stripe, Clerk, Supabase, etc.) are abstracted in the service layer
- Theme and palette are globally available via CSS variables
