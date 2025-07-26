'use client'

/**
 * Client-side Authentication Helpers
 * For use in client components and hooks
 * Does not import server-only modules
 */

import { UserRole, SnbUserType, UserProfile } from '@/types'

// Client-side auth user interface
export interface ClientAuthUser {
  id: string
  email: string
  fullName: string
  firstName?: string
  lastName?: string
  role: UserRole
  userType: SnbUserType
  isActive: boolean
  permissions: string[]
}

/**
 * Get user from .NET Web API (client-side)
 */
export async function getUserFromAPI(clerkUserId: string): Promise<UserProfile | null> {
  try {
    const response = await fetch(`/api/sonobrokers/users/clerk/${clerkUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    if (data.success && data.data) {
      return data.data
    }
    
    return null
  } catch (error) {
    console.warn('User not found in database:', error)
    return null
  }
}

/**
 * Create user via .NET Web API ClerkController (client-side)
 */
export async function createUserViaAPI(clerkUser: any): Promise<UserProfile | null> {
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
      userType: 'Buyer' as SnbUserType,
      role: 'USER' as UserRole
    }

    console.log('Creating user via ClerkController:', userData)

    const response = await fetch('/api/sonobrokers/clerk/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    
    if (!response.ok) {
      throw new Error('Failed to create user')
    }

    const data = await response.json()
    if (data.success && data.data) {
      console.log('User created successfully:', data.data.id)
      return data.data
    }

    throw new Error(data.message || 'Failed to create user')
  } catch (error) {
    console.error('Error creating user via ClerkController:', error)
    return null
  }
}

/**
 * Update user login session (client-side)
 */
export async function updateLoginSession(userId: string, clerkUserId: string, loggedIn: boolean): Promise<void> {
  try {
    console.log(`Updating login session for user ${userId}, loggedIn: ${loggedIn}`)

    // Update login status in public.user table
    const loginResponse = await fetch(`/api/sonobrokers/users/${userId}/login-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        loggedIn,
        lastLoginAt: new Date().toISOString()
      })
    })

    if (!loginResponse.ok) {
      console.warn('Failed to update user login status')
    }

    // Update session in auth.users table
    const sessionResponse = await fetch(`/api/sonobrokers/clerk/users/${clerkUserId}/session`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isActive: loggedIn,
        lastActivity: new Date().toISOString()
      })
    })

    if (!sessionResponse.ok) {
      console.warn('Failed to update auth session')
    }

    console.log('Login session updated successfully')
  } catch (error) {
    console.error('Error updating login session:', error)
  }
}

/**
 * Handle user logout (client-side)
 */
export async function handleLogout(userId: string, clerkUserId: string): Promise<void> {
  try {
    console.log('Handling user logout...')
    await updateLoginSession(userId, clerkUserId, false)
    console.log('User logout handled successfully')
  } catch (error) {
    console.error('Error handling user logout:', error)
  }
}

/**
 * Convert UserProfile to ClientAuthUser format
 */
export function convertToClientAuthUser(userProfile: UserProfile): ClientAuthUser {
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
 * Get current user for client components - called immediately after login
 * This populates the auth context with user details from database
 */
export async function getCurrentUserClient(clerkUser: any): Promise<ClientAuthUser | null> {
  try {
    if (!clerkUser) return null

    console.log('Getting current user from database after login...')

    // Try to get user from API using Clerk ID
    let userProfile = await getUserFromAPI(clerkUser.id)

    if (!userProfile) {
      console.log('User not found in database, creating new user...')
      // Create user if not found - this happens on first login
      userProfile = await createUserViaAPI(clerkUser)
      if (!userProfile) {
        console.error('Failed to create user in database')
        return null
      }
    }

    console.log('User found/created in database:', userProfile.id)

    // Update login session in both auth.users and public.user tables
    await updateLoginSession(userProfile.id, clerkUser.id, true)

    // Convert to client auth user format for context
    const clientAuthUser = convertToClientAuthUser(userProfile)

    console.log('Auth context populated with user role:', clientAuthUser.role)
    return clientAuthUser
  } catch (error) {
    console.error('Error getting current user for auth context:', error)
    return null
  }
}

/**
 * Get user role from database - for immediate role checking after login
 */
export async function getCurrentUserRole(clerkUser: any): Promise<UserRole> {
  try {
    if (!clerkUser) return UserRole.USER

    const userProfile = await getUserFromAPI(clerkUser.id)
    return userProfile?.role || UserRole.USER
  } catch (error) {
    console.error('Error getting user role:', error)
    return UserRole.USER
  }
}

export default {
  getUserFromAPI,
  createUserViaAPI,
  updateLoginSession,
  handleLogout,
  convertToClientAuthUser,
  getCurrentUserClient
}
