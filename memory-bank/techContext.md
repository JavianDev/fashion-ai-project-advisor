# SonoBrokers Platform - Tech Context

## Technologies Used

- **Frontend:** Next.js (React 18), Tailwind CSS, Headless UI, Radix UI, DaisyUI, Shadcn UI
- **State Management:** React Context API, SWR
- **Backend/API:** Next.js API Routes (serverless functions)
- **Database:** Supabase (PostgreSQL with PostGIS)
- **Authentication:** Clerk.com (JWT-based)
- **File Storage:** Supabase Storage
- **Payments:** Stripe Connect
- **Workflow Automation:** Make.com, n8n
- **Maps:** Google Maps JavaScript API
- **Support:** Crisp live chat
- **Analytics:** Google Analytics 4
- **Email:** SendGrid or AWS SES
- **SMS:** Twilio
- **DevOps:** Vercel (hosting), GitHub Actions (CI/CD), Sentry (monitoring), Vercel Analytics
- **Theme System:** Radix UI palette (green/gray) as CSS variables for both light and dark themes

## Development Setup

- Node.js, npm, and Next.js CLI
- Environment variables managed via Vercel
- Local development with hot reload (`npm run dev`)
- Prisma for database schema and migrations

## Technical Constraints

- Must support serverless deployment (Vercel)
- Must be compatible with Supabase managed PostgreSQL
- Must use Clerk.com for authentication
- Must support Stripe for payments
- Must be accessible (WCAG 2.1 AA)
- Must support English and French (i18n)
- UI/UX is world-class, modern, and professional, based on Radix UI palette and theme system
- All buttons and switches are slim, animated, and use Radix color variables
- Region-aware routing and role-based onboarding/dashboard are core flows

## Dependencies

- All major SaaS integrations (Clerk, Stripe, Supabase, Google Maps, Crisp, etc.)
- Modern browser support (Chrome, Firefox, Safari, Edge)
- Responsive and mobile-first design
