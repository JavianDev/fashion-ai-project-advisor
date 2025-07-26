/**
 * Authentication utility functions
 * Defines when authentication is required vs when it's optional
 */

export type AuthRequiredAction = 
  | 'save-property'
  | 'like-property'
  | 'save-search'
  | 'list-property'
  | 'contact-agent'
  | 'schedule-viewing'
  | 'submit-offer'
  | 'access-dashboard'
  | 'access-profile'
  | 'access-settings'
  | 'access-saved-properties'
  | 'access-saved-searches';

export type PublicAction = 
  | 'browse-properties'
  | 'view-property-details'
  | 'search-properties'
  | 'filter-properties'
  | 'view-services'
  | 'view-resources'
  | 'view-about'
  | 'view-contact'
  | 'view-pricing'
  | 'view-faq'
  | 'view-blog'
  | 'view-market-analytics'
  | 'view-list-property-form'; // Can view the form, but auth required to submit

/**
 * Check if an action requires authentication
 */
export function requiresAuth(action: AuthRequiredAction | PublicAction): action is AuthRequiredAction {
  const authRequiredActions: AuthRequiredAction[] = [
    'save-property',
    'like-property', 
    'save-search',
    'list-property',
    'contact-agent',
    'schedule-viewing',
    'submit-offer',
    'access-dashboard',
    'access-profile',
    'access-settings',
    'access-saved-properties',
    'access-saved-searches'
  ];
  
  return authRequiredActions.includes(action as AuthRequiredAction);
}

/**
 * Get user-friendly message for when auth is required
 */
export function getAuthRequiredMessage(action: AuthRequiredAction): string {
  const messages: Record<AuthRequiredAction, string> = {
    'save-property': 'Sign in to save properties to your favorites',
    'like-property': 'Sign in to like and track properties',
    'save-search': 'Sign in to save your search filters',
    'list-property': 'Sign in to list your property',
    'contact-agent': 'Sign in to contact real estate professionals',
    'schedule-viewing': 'Sign in to schedule property viewings',
    'submit-offer': 'Sign in to submit offers on properties',
    'access-dashboard': 'Sign in to access your dashboard',
    'access-profile': 'Sign in to view your profile',
    'access-settings': 'Sign in to access account settings',
    'access-saved-properties': 'Sign in to view your saved properties',
    'access-saved-searches': 'Sign in to view your saved searches'
  };
  
  return messages[action] || 'Sign in to continue';
}

/**
 * Navigation items that are always accessible (no auth required)
 */
export const PUBLIC_ROUTES = [
  '/',
  '/ca',
  '/us',
  '/properties',
  '/services',
  '/resources',
  '/about',
  '/contact',
  '/pricing',
  '/faq',
  '/blog',
  '/list-property', // Can view form, auth required for submission
  '/market-analysis',
  '/how-it-works',
  '/terms',
  '/privacy-policy',
  '/cookies'
] as const;

/**
 * Routes that require authentication
 */
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/settings',
  '/saved-properties',
  '/saved-searches',
  '/my-listings'
] as const;

/**
 * Check if a route is public (no auth required)
 */
export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some(route => path.startsWith(route));
}

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(path: string): boolean {
  return PROTECTED_ROUTES.some(route => path.startsWith(route));
}
