# SonoBrokers Platform - Active Context

## Current Work Focus
- UI/UX modernization: Radix UI color palette, theme system, slim animated buttons and switches
- Country detection and onboarding flow (Canada/USA, unsupported region fallback)
- Role-based onboarding and dashboard (buyer/seller, with default seller mode)
- Modern, animated role switcher in dashboard with instant UI updates (DB persistence TODO)
- Memory Bank documentation for all major changes
- Documentation/memory bank is now fully up to date with latest UI/UX, theme, onboarding, and region/role logic
- Next: Further polish onboarding, dashboard, property cards, chat, and other key UI components

## Recent Changes
- Injected Radix UI green/gray palette as CSS variables for both light and dark themes
- Refactored all buttons and switches to be slim, animated, and use Radix color variables
- Implemented a modern, animated theme switcher (Radix UI Switch) in the header
- Updated all major call-to-action, chat, checkout, and portal buttons to use the new Button
- Country detection on first load, with region-based routing and fallback
- Role selection onboarding (buyer/seller) with DB profile creation
- Dashboard now role-aware and redirects to onboarding if role is unset
- Modern, animated role switcher is live in the dashboard
- Documentation/memory bank is now fully up to date with latest UI/UX, theme, onboarding, and region/role logic

## Next Steps
- Further polish onboarding, dashboard, property cards, chat, and other key UI components (Phase 3)
- Update Memory Bank after each major feature

## Active Decisions & Considerations
- Clerk.com manages authentication; DB tracks user login/logout and role
- Prisma used for all nobrokers schema tables, with BuyerProfile/SellerProfile for extensibility
- All integrations (Stripe, Google Maps, Resend, etc.) included with documentation
- Real-time messaging to be implemented (Pusher/Ably or similar)
- UI/UX must be world-class, modern, and accessible
- Memory Bank updated after each major feature 