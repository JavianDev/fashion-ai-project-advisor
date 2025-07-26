/**
 * Authentication and User Management
 * Integrates Clerk authentication with .NET Web API user management
 * Handles login/logout tracking and session management
 * Uses existing UserController and ClerkController from .NET Web API
 */

import { UserRole, SnbUserType, UserProfile, ApiResponse } from '@/types'
import { apiClient } from "@/lib/lib/api-client"
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

export interface AuthUser {
  id: string
  email: string
  fullName?: string | null
  firstName?: string | null
  lastName?: string | null
  role: UserRole
  userType: SnbUserType
  isActive: boolean
  permissions: Array<{
    permission: string
    resource?: string | null
  }>
}

/**
 * Get the current authenticated user with role and permissions
 * Integrates with .NET Web API UserController for user management
 * Stores login information in auth.users and public.user tables
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    // Use currentUser() for server components - provides full user data
    const clerkUser = await currentUser()
    if (!clerkUser) return null

    const email = clerkUser.primaryEmailAddress?.emailAddress
    if (!email) return null

    // Try to get user from .NET Web API UserController
    let userProfile = await getUserFromWebAPI(clerkUser.id)

    if (!userProfile) {
      // User not found in database, create them using ClerkController
      userProfile = await createUserViaClerkController(clerkUser)
      if (!userProfile) return null
    }

    // Update login status in both auth.users and public.user tables
    await updateUserLoginSession(userProfile.id, clerkUser.id, true)

    return convertToAuthUser(userProfile)
  } catch (error) {
    console.error('Error getting auth user:', error)
    return null
  }
}

/**
 * Get user from .NET Web API UserController
 */
async function getUserFromWebAPI(clerkUserId: string): Promise<UserProfile | null> {
  try {
    const response = await apiClient.get<ApiResponse<UserProfile>>(`/api/sonobrokers/users/clerk/${clerkUserId}`)

    if (response.success && response.data) {
      return response.data
    }

    return null
  } catch (error) {
    console.warn('User not found in database:', error)
    return null
  }
}

/**
 * Create user via .NET Web API ClerkController
 * This handles user creation in both auth.users and public.user tables
 */
async function createUserViaClerkController(clerkUser: any): Promise<UserProfile | null> {
  try {
    const userData = {
      clerkUserId: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
                clerkUser.primaryEmailAddress?.emailAddress || 'User',
      firstName: clerkUser.firstName || undefined,
      lastName: clerkUser.lastName || undefined,
      phoneNumber: clerkUser.primaryPhoneNumber?.phoneNumber || undefined,
      profileImageUrl: clerkUser.imageUrl || undefined,
      userType: 'Buyer' as SnbUserType, // Default to Buyer
      role: 'USER' as UserRole // Default to USER role
    }

    console.log('Creating user via ClerkController:', userData)

    // Use ClerkController to create user (handles both auth.users and public.user)
    const response = await apiClient.post<ApiResponse<UserProfile>>('/api/sonobrokers/clerk/users', userData)

    if (response.success && response.data) {
      console.log('User created successfully:', response.data.id)
      return response.data
    }

    throw new Error(response.message || 'Failed to create user')
  } catch (error) {
    console.error('Error creating user via ClerkController:', error)
    return null
  }
}

/**
 * Update user login session in both auth.users and public.user tables
 * Uses existing UserController endpoints for session management
 */
async function updateUserLoginSession(userId: string, clerkUserId: string, loggedIn: boolean): Promise<void> {
  try {
    console.log(`Updating login session for user ${userId}, loggedIn: ${loggedIn}`)

    // Update login status in public.user table via UserController
    const loginResponse = await apiClient.patch<ApiResponse<void>>(`/api/sonobrokers/users/${userId}/login-status`, {
      loggedIn,
      lastLoginAt: new Date().toISOString()
    })

    if (!loginResponse.success) {
      console.warn('Failed to update user login status:', loginResponse.message)
    }

    // Update session in auth.users table via ClerkController
    const sessionResponse = await apiClient.patch<ApiResponse<void>>(`/api/sonobrokers/clerk/users/${clerkUserId}/session`, {
      isActive: loggedIn,
      lastActivity: new Date().toISOString()
    })

    if (!sessionResponse.success) {
      console.warn('Failed to update auth session:', sessionResponse.message)
    }

    console.log('Login session updated successfully')
  } catch (error) {
    console.error('Error updating login session:', error)
  }
}

/**
 * Handle user logout - update both auth.users and public.user tables
 */
export async function handleUserLogout(userId?: string, clerkUserId?: string): Promise<void> {
  try {
    console.log('Handling user logout...')

    if (!userId || !clerkUserId) {
      // Try to get user info from current auth
      const { userId: authUserId } = await auth()
      if (!authUserId) {
        console.warn('No user ID available for logout')
        return
      }

      const userProfile = await getUserFromWebAPI(authUserId)
      if (userProfile) {
        userId = userProfile.id
        clerkUserId = authUserId
      } else {
        console.warn('User not found for logout')
        return
      }
    }

    // Update logout status in both tables
    await updateUserLoginSession(userId, clerkUserId, false)

    console.log('User logout handled successfully')
  } catch (error) {
    console.error('Error handling user logout:', error)
  }
}

/**
 * Convert UserProfile to AuthUser format
 */
function convertToAuthUser(userProfile: UserProfile): AuthUser {
  return {
    id: userProfile.id,
    email: userProfile.email,
    fullName: userProfile.fullName,
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    role: userProfile.role,
    userType: userProfile.userType,
    isActive: userProfile.isActive,
    permissions: [] // Will be loaded separately if needed
  }
}

/**
 * Check if user has specific permission
 */
export function hasPermission(
  user: AuthUser | null,
  permission: string,
  resource?: string
): boolean {
  if (!user || !user.isActive) return false

  return user.permissions.some(
    p => p.permission === permission && (resource ? p.resource === resource : true)
  )
}

/**
 * Check if user has any of the specified roles
 */
export function hasRole(user: AuthUser | null, roles: UserRole[]): boolean {
  if (!user || !user.isActive) return false
  return roles.includes(user.role)
}

/**
 * Check if user is admin
 */
export function isAdmin(user: AuthUser | null): boolean {
  return hasRole(user, [UserRole.ADMIN])
}

/**
 * Require authentication - redirect to sign-in if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  try {
    const user = await getAuthUser()
    if (!user) {
      redirect('/sign-in')
    }
    return user
  } catch (error) {
    console.error('Error in requireAuth:', error)
    redirect('/sign-in')
  }
}

/**
 * Get authenticated user for API routes using auth() function
 * This approach works better with Next.js 15 and Clerk
 */
export async function getAuthUserAPI(): Promise<AuthUser | null> {
  try {
    // Use auth() for API routes - this is the recommended approach
    const { userId } = await auth()

    if (!userId) {
      console.log('No authenticated user found')
      return null
    }

    // Get SNB user by Clerk ID from .NET Web API
    const userProfile = await getUserFromWebAPI(userId)
    if (!userProfile) {
      console.warn('User authenticated with Clerk but not found in SNB database:', userId)
      return null
    }

    // Update login status for API access
    await updateUserLoginSession(userProfile.id, userId, true)

    return convertToAuthUser(userProfile)
  } catch (error) {
    console.error('Error getting auth user for API:', error)
    return null
  }
}



/**
 * Sync user data between Clerk and database
 * Should be called after Clerk user updates
 */
export async function syncUserWithDatabase(clerkUser: any): Promise<UserProfile | null> {
  try {
    const userProfile = await getUserFromWebAPI(clerkUser.id)

    if (!userProfile) {
      // Create new user
      return await createUserViaClerkController(clerkUser)
    }

    // Update existing user with latest Clerk data
    const updateData = {
      fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || userProfile.fullName,
      firstName: clerkUser.firstName || userProfile.firstName,
      lastName: clerkUser.lastName || userProfile.lastName,
      phoneNumber: clerkUser.primaryPhoneNumber?.phoneNumber || userProfile.phoneNumber
    }

    const response = await apiClient.put<ApiResponse<UserProfile>>(`/api/sonobrokers/users/${userProfile.id}`, updateData)
    return response.success ? response.data || null : null
  } catch (error) {
    console.error('Error syncing user with database:', error)
    return null
  }
}

/**
 * Require authentication for API routes - returns null if not authenticated
 */
export async function requireAuthAPI(): Promise<AuthUser | null> {
  try {
    const user = await getAuthUserAPI()
    return user
  } catch (error) {
    console.error('Error in requireAuthAPI:', error)
    return null
  }
}

/**
 * Require specific role - redirect to unauthorized if user doesn't have role
 */
export async function requireRole(roles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth()
  if (!hasRole(user, roles)) {
    redirect('/unauthorized')
  }
  return user
}

/**
 * Require admin role
 */
export async function requireAdmin(): Promise<AuthUser> {
  return requireRole([UserRole.ADMIN])
}

/**
 * Require admin role for API routes - returns null if not admin
 */
export async function requireAdminAPI(): Promise<AuthUser | null> {
  try {
    const user = await getAuthUserAPI()
    if (!user || !hasRole(user, [UserRole.ADMIN])) {
      return null
    }
    return user
  } catch (error) {
    console.error('Error in requireAdminAPI:', error)
    return null
  }
}

/**
 * Require specific permission
 */
export async function requirePermission(
  permission: string,
  resource?: string
): Promise<AuthUser> {
  const user = await requireAuth()
  if (!hasPermission(user, permission, resource)) {
    redirect('/unauthorized')
  }
  return user
}

/**
 * Role-based route protection HOC
 */
export function withAuth<T extends Record<string, any>>(
  Component: React.ComponentType<T & { user: AuthUser }>,
  options?: {
    roles?: UserRole[]
    permissions?: Array<{ permission: string; resource?: string }>
    redirectTo?: string
  }
) {
  return async function AuthenticatedComponent(props: T) {
    const user = await getAuthUser()

    if (!user) {
      redirect(options?.redirectTo || '/sign-in')
    }

    // Check roles
    if (options?.roles && !hasRole(user, options.roles)) {
      redirect('/unauthorized')
    }

    // Check permissions
    if (options?.permissions) {
      const hasRequiredPermissions = options.permissions.every(
        ({ permission, resource }) => hasPermission(user, permission, resource)
      )
      if (!hasRequiredPermissions) {
        redirect('/unauthorized')
      }
    }

    return React.createElement(Component, { ...props, user } as T & { user: AuthUser })
  }
}

/**
 * Client-side hook for role checking
 */
export function useAuth() {
  // This would be implemented as a React hook for client-side components
  // For now, we'll create the server-side utilities
  return {
    hasPermission,
    hasRole,
    isAdmin
  }
}

// Permission constants
export const PERMISSIONS = {
  // User management
  READ_USERS: 'read',
  WRITE_USERS: 'write',
  DELETE_USERS: 'delete',
  
  // Reports and Analytics
  READ_REPORTS: 'read',
  WRITE_REPORTS: 'write',
  READ_ANALYTICS: 'read',
  
  // Communications
  SEND_BULK_EMAILS: 'send',
  SEND_NOTIFICATIONS: 'send',
  
  // Role management
  MANAGE_ROLES: 'manage',
  
  // Properties
  READ_PROPERTIES: 'read',
  WRITE_PROPERTIES: 'write',
  
  // Profile
  READ_PROFILE: 'read',
  WRITE_PROFILE: 'write'
} as const

export const RESOURCES = {
  USERS: 'users',
  REPORTS: 'reports',
  ANALYTICS: 'analytics',
  BULK_EMAILS: 'bulk_emails',
  NOTIFICATIONS: 'notifications',
  ROLES: 'roles',
  PROPERTIES: 'properties',
  PROFILE: 'profile'
} as const
