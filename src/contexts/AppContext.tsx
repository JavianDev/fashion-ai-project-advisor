'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { SnbUserType, UserRole, UserProfile } from '@/types'
import { Country, detectCountryFromIP, initializeCountryRouting, performCountryRedirect, getCurrentCountryFromPath } from '@/lib/lib/geo'
import { getCurrentUserClient, handleLogout } from '@/lib/lib/auth-client'

export type UserType = SnbUserType
export type { UserRole, Country }
// Theme is now handled by next-themes ThemeProvider

interface Permission {
  permission: string
  resource?: string | null
}

interface SnbUser {
  id: string
  email: string
  fullName: string
  firstName?: string
  lastName?: string
  phone?: string
  userType: UserType
  role: UserRole
  isActive: boolean
  clerkUserId?: string
  authUserId?: string
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

interface AppContextType {
  // Geographic & User Context
  userType: UserType
  setUserType: (type: UserType) => void
  country: Country
  setCountry: (country: Country) => void

  // Authentication Context (synced with server state)
  clerkUser: any // Clerk user object
  snbUser: SnbUser | null
  isSignedIn: boolean
  userId: string | null
  userEmail: string | null

  // Server-provided auth state
  serverAuthState: {
    isSignedIn: boolean
    userId: string | null
    userEmail: string | null
  } | null
  setServerAuthState: (state: { isSignedIn: boolean; userId: string | null; userEmail: string | null }) => void

  // Role & Permissions
  userRole: UserRole | null
  permissions: Permission[]
  isAdmin: boolean

  // Loading states
  isLoading: boolean
  isUserLoading: boolean
  isRegionLoading: boolean

  // Functions
  refreshSnbUser: () => Promise<void>
  handlePostAuthentication: () => Promise<void>
  clearAuthenticationData: () => void
  checkPermission: (permission: string, resource?: string) => boolean
  hasRole: (roles: UserRole[]) => boolean
  validateAndSetRegion: () => Promise<void>
  showSignInModal: (options?: { onSuccess?: () => void; message?: string }) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    // During SSR or static generation, return a default context to prevent errors
    if (typeof window === 'undefined') {
      return {
        userType: 'Buyer' as UserType,
        setUserType: () => { },
        country: 'CA' as Country,
        setCountry: () => { },
        clerkUser: null,
        snbUser: null,
        isSignedIn: false,
        userId: null,
        userEmail: null,
        serverAuthState: null,
        setServerAuthState: () => { },
        userRole: null,
        permissions: [],
        isAdmin: false,
        isLoading: true,
        isUserLoading: true,
        isRegionLoading: true,
        refreshSnbUser: async () => { },
        handlePostAuthentication: async () => { },
        clearAuthenticationData: () => { },
        checkPermission: () => false,
        hasRole: () => false,
        validateAndSetRegion: async () => { },
        showSignInModal: () => { }
      } as AppContextType;
    }
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

interface AppProviderProps {
  children: React.ReactNode
  initialCountry?: Country
  initialUserType?: UserType
}

export function AppProvider({
  children,
  initialCountry = 'CA' as Country,
  initialUserType = 'Buyer' as SnbUserType
}: AppProviderProps) {
  // Basic state - use initial values to prevent hydration mismatch
  const [userType, setUserTypeState] = useState<UserType>(initialUserType)
  const [country, setCountryState] = useState<Country>(initialCountry)
  const [isLoading, setIsLoading] = useState(true)
  const [isUserLoading, setIsUserLoading] = useState(true)
  const [isRegionLoading, setIsRegionLoading] = useState(true)
  const [snbUser, setSnbUser] = useState<SnbUser | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [mounted, setMounted] = useState(false)

  // Server auth state synchronization
  const [serverAuthState, setServerAuthState] = useState<{
    isSignedIn: boolean
    userId: string | null
    userEmail: string | null
  } | null>(null)

  // Clerk hooks
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn: clerkIsSignedIn } = useUser()

  // Router and pathname
  const router = useRouter()
  const pathname = usePathname()

  // Derived values - prefer server auth state if available
  const isSignedIn = serverAuthState?.isSignedIn ?? (clerkIsSignedIn || false)
  const userId = serverAuthState?.userId ?? (clerkUser?.id || null)
  const userEmail = serverAuthState?.userEmail ?? (clerkUser?.emailAddresses?.[0]?.emailAddress || null)
  const userRole = snbUser?.role || null
  const isAdmin = snbUser?.email === 'javian.picardo.sonobrokers@gmail.com' || snbUser?.role === 'ADMIN'

  // Helper functions
  const checkPermission = (permission: string, resource?: string): boolean => {
    if (!snbUser || !snbUser.isActive) return false
    if (isAdmin) return true // Admin has all permissions

    return permissions.some(p =>
      p.permission === permission &&
      (resource ? p.resource === resource : true)
    )
  }

  const hasRole = (roles: UserRole[]): boolean => {
    if (!snbUser || !snbUser.isActive) return false
    return userRole ? roles.includes(userRole) : false
  }

  const validateAndSetRegion = async (): Promise<void> => {
    try {
      setIsRegionLoading(true)
      console.log('Validating and setting region...')

      // First, check if we're already on a valid country route
      const currentCountry = getCurrentCountryFromPath()
      if (currentCountry) {
        console.log(`Already on valid country route: ${currentCountry}`)
        setCountryState(currentCountry)
        setIsRegionLoading(false)
        return
      }

      // Initialize country routing (IP detection + validation)
      const routing = await initializeCountryRouting()

      if (routing.shouldRedirect) {
        console.log(`Redirecting from ${routing.currentPath} to ${routing.redirectPath}`)
        // Perform the redirect to proper country route
        performCountryRedirect(routing.redirectPath)
        return // Don't continue since we're redirecting
      }

      // Set the detected country
      setCountryState(routing.detectedCountry)

      // Store in localStorage for future reference
      if (typeof window !== 'undefined') {
        localStorage.setItem('snb-user-country', routing.detectedCountry)
      }

      console.log(`Region validated and set to: ${routing.detectedCountry}`)
    } catch (error) {
      console.error('Error validating region:', error)
      setCountryState(Country.CA) // Fallback to Canada
    } finally {
      setIsRegionLoading(false)
    }
  }

  // Function to fetch SNB user data from .NET Web API - called immediately after login
  const fetchSnbUser = async () => {
    if (!isSignedIn || !userId || !userEmail) {
      setSnbUser(null)
      setIsUserLoading(false)
      return
    }

    try {
      setIsUserLoading(true)
      console.log('Fetching SNB user data from database after login...')

      // Check cache first (for performance) - but only for recent logins
      const cacheKey = `snb-user-${userId}`
      const cachedUser = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null
      const cacheTimestamp = typeof window !== 'undefined' ? localStorage.getItem(`${cacheKey}-timestamp`) : null

      // Use cache if it's less than 2 minutes old (shorter cache for auth context)
      if (cachedUser && cacheTimestamp) {
        const cacheAge = Date.now() - parseInt(cacheTimestamp)
        if (cacheAge < 2 * 60 * 1000) { // 2 minutes
          const userData = JSON.parse(cachedUser)
          setSnbUser({
            ...userData,
            createdAt: new Date(userData.createdAt),
            updatedAt: new Date(userData.updatedAt),
            lastLoginAt: userData.lastLoginAt ? new Date(userData.lastLoginAt) : undefined
          })
          console.log('Using cached user data for auth context')
          setIsUserLoading(false)
          return
        }
      }

      // Call database immediately after login to populate auth context
      // This gets user details from auth.users or public.user table
      console.log('Calling database to populate auth context for user:', userId)

      if (!clerkUser) {
        console.log('No Clerk user available, skipping database call')
        setIsUserLoading(false)
        return
      }

      const authUser = await getCurrentUserClient(clerkUser)

      if (authUser) {
        console.log('Database returned user details for auth context:', authUser.role, authUser.userType)

        const userData = {
          id: authUser.id,
          email: authUser.email,
          fullName: authUser.fullName,
          firstName: authUser.firstName,
          lastName: authUser.lastName,
          phone: '', // Will be updated when available
          userType: authUser.userType,
          role: authUser.role,
          isActive: authUser.isActive,
          clerkUserId: userId,
          authUserId: authUser.id,
          createdAt: new Date(), // Will be updated with actual data
          updatedAt: new Date(), // Will be updated with actual data
          lastLoginAt: new Date() // Current login
        }

        setSnbUser(userData)

        // Cache the user data
        if (typeof window !== 'undefined') {
          localStorage.setItem(cacheKey, JSON.stringify({
            ...userData,
            createdAt: userData.createdAt.toISOString(),
            updatedAt: userData.updatedAt.toISOString(),
            lastLoginAt: userData.lastLoginAt?.toISOString()
          }))
          localStorage.setItem(`${cacheKey}-timestamp`, Date.now().toString())
        }

        // Update userType from SNB user data if available (only Buyer/Seller allowed)
        if (authUser.userType && ['Buyer', 'Seller'].includes(authUser.userType)) {
          setUserTypeState(authUser.userType)
          if (typeof window !== 'undefined') {
            localStorage.setItem('sonobrokers-usertype', authUser.userType)
          }
        }

        // Load user permissions if available
        if (authUser.permissions && authUser.permissions.length > 0) {
          setPermissions(authUser.permissions.map(p => ({ permission: p, resource: null as string | null })))
          if (typeof window !== 'undefined') {
            localStorage.setItem('snb-permissions-cache', JSON.stringify(authUser.permissions))
          }
        }

        console.log('SNB user data loaded successfully from .NET Web API')
      } else {
        // User not found in .NET Web API - this shouldn't happen with getAuthUser
        console.log('User not found in .NET Web API, clearing local state')
        setSnbUser(null)
        setPermissions([])

        // Clear cache
        if (typeof window !== 'undefined') {
          localStorage.removeItem(cacheKey)
          localStorage.removeItem(`${cacheKey}-timestamp`)
          localStorage.removeItem('snb-permissions-cache')
        }
      }
    } catch (error) {
      console.error('Failed to fetch SNB user data:', error)
      setSnbUser(null)
      setPermissions([])

      // Clear cache on error
      if (typeof window !== 'undefined') {
        const cacheKey = `snb-user-${userId}`
        localStorage.removeItem(cacheKey)
        localStorage.removeItem(`${cacheKey}-timestamp`)
        localStorage.removeItem('snb-permissions-cache')
      }
    } finally {
      setIsUserLoading(false)
    }
  }

  const refreshSnbUser = async () => {
    if (isSignedIn) {
      setIsUserLoading(true)
      await fetchSnbUser()
    }
  }

  // Function to handle post-authentication setup
  const handlePostAuthentication = async () => {
    if (!isSignedIn || !userId || !userEmail) return

    try {
      // Clear any stale cache
      if (typeof window !== 'undefined') {
        const cacheKey = `snb-user-${userId}`
        localStorage.removeItem(cacheKey)
        localStorage.removeItem(`${cacheKey}-timestamp`)
      }

      // Fetch fresh user data
      await fetchSnbUser()

      // Trigger any additional post-auth actions
      console.log('Post-authentication setup completed for user:', userEmail)
    } catch (error) {
      console.error('Error in post-authentication setup:', error)
    }
  }

  // Function to clear authentication data on sign out
  const clearAuthenticationData = () => {
    setSnbUser(null)
    setPermissions([])
    setIsUserLoading(false)

    // Clear all cached authentication data
    if (typeof window !== 'undefined') {
      // Clear user-specific cache
      if (userId) {
        const cacheKey = `snb-user-${userId}`
        localStorage.removeItem(cacheKey)
        localStorage.removeItem(`${cacheKey}-timestamp`)
      }

      // Clear general auth cache
      localStorage.removeItem('snb-user-cache')
      localStorage.removeItem('snb-permissions-cache')

      // Keep userType and country preferences but clear auth-specific data
      console.log('Authentication data cleared')
    }
  }

  // Theme is now handled by next-themes ThemeProvider

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize from localStorage and fetch user data
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const savedUserType = localStorage.getItem('sonobrokers-usertype') as UserType
      const savedCountry = localStorage.getItem('sonobrokers-country') as Country

      if (savedUserType && ['Buyer', 'Seller'].includes(savedUserType)) {
        setUserTypeState(savedUserType)
      }

      if (savedCountry && ['CA', 'US', 'UAE'].includes(savedCountry)) {
        setCountryState(savedCountry)
      }

      setIsLoading(false)
    }
  }, [mounted])

  // Fetch SNB user data when Clerk user is loaded or authentication state changes
  useEffect(() => {
    if (isClerkLoaded) {
      if (clerkIsSignedIn && userId && userEmail) {
        // User is signed in, fetch their SNB profile
        fetchSnbUser()
      } else {
        // User is not signed in, clear SNB user data
        setSnbUser(null)
        setIsUserLoading(false)
        setPermissions([])

        // Clear any cached user data from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('snb-user-cache')
          localStorage.removeItem('snb-permissions-cache')
        }
      }
    }
  }, [isClerkLoaded, clerkIsSignedIn, userId, userEmail])

  // Listen for authentication state changes and refresh user data
  useEffect(() => {
    if (mounted && isClerkLoaded && clerkIsSignedIn && userId) {
      // When user signs in, ensure we have the latest user data
      const timeoutId = setTimeout(() => {
        refreshSnbUser()
      }, 500) // Small delay to ensure Clerk user is fully loaded

      return () => clearTimeout(timeoutId)
    }
  }, [mounted, isClerkLoaded, clerkIsSignedIn, userId])

  // Extract country from URL if present
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split('/')
      const urlCountry = pathSegments[1]?.toLowerCase()

      if (urlCountry && ['ca', 'us', 'uae'].includes(urlCountry)) {
        // Convert lowercase URL to uppercase enum value
        const countryEnum = urlCountry.toUpperCase() as Country;
        setCountryState(countryEnum)
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('sonobrokers-country', countryEnum)
        }
      }
    }
  }, [pathname])



  const setUserType = async (type: UserType) => {
    setUserTypeState(type)
    // Save to localStorage only when mounted
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('sonobrokers-usertype', type)
    }

    // Update in database if user is signed in
    if (isSignedIn && snbUser) {
      try {
        const response = await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userType: type })
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            setSnbUser({
              ...snbUser,
              userType: result.data.userType,
              updatedAt: new Date(result.data.updatedAt)
            })
          }
        }
      } catch (error) {
        console.error('Failed to update user type in database:', error)
      }
    }

    // Update URL if we're on a country-specific page
    if (pathname && pathname.startsWith(`/${country}/`)) {
      // Add userType as query parameter if needed
      const url = new URL(window.location.href)
      url.searchParams.set('userType', type)
      router.replace(url.pathname + url.search)
    }
  }

  const setCountry = (newCountry: Country) => {
    setCountryState(newCountry)
    // Save to localStorage only when mounted
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('sonobrokers-country', newCountry)
    }

    // Update URL if we're on a country-specific page
    if (pathname) {
      const pathSegments = pathname.split('/')
      const currentCountry = pathSegments[1]?.toLowerCase()

      if (currentCountry && ['ca', 'us', 'uae'].includes(currentCountry)) {
        // Replace the country in the URL (convert enum to lowercase for URL)
        const newCountryUrl = newCountry.toLowerCase();
        const newPath = pathname.replace(`/${currentCountry}/`, `/${newCountryUrl}/`)
        const url = new URL(window.location.href)
        router.push(newPath + url.search)
      } else if (pathname === '/' || pathname === '') {
        // Redirect to country-specific home page (convert enum to lowercase for URL)
        const newCountryUrl = newCountry.toLowerCase();
        router.push(`/${newCountryUrl}`)
      }
    }
  }



  // Show signin modal function - integrates with existing auth utilities
  const showSignInModal = (options?: { onSuccess?: () => void; message?: string }) => {
    // Use existing auth-utils for consistent messaging
    const message = options?.message || 'Please sign in to continue'

    // Store the callback for after authentication
    if (options?.onSuccess && typeof window !== 'undefined') {
      sessionStorage.setItem('pendingAction', JSON.stringify({
        message,
        timestamp: Date.now()
      }))
    }

    // Redirect to sign-in page with current path for redirect back
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      const signInUrl = `/sign-in?redirect=${encodeURIComponent(currentPath)}`
      window.location.href = signInUrl
    }
  }

  const value: AppContextType = {
    // Geographic & User Context
    userType,
    setUserType,
    country,
    setCountry,

    // Authentication Context
    clerkUser,
    snbUser,
    isSignedIn,
    userId,
    userEmail,

    // Server auth state
    serverAuthState,
    setServerAuthState,

    // Role & Permissions
    userRole,
    permissions,
    isAdmin,

    // Loading states
    isLoading,
    isUserLoading,
    isRegionLoading,

    // Functions
    refreshSnbUser,
    handlePostAuthentication,
    clearAuthenticationData,
    checkPermission,
    hasRole,
    validateAndSetRegion,
    showSignInModal
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
