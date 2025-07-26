'use client'

/**
 * useAuth Hook
 * Comprehensive authentication hook that integrates Clerk with .NET Web API
 * Handles user creation, login/logout tracking, and session management
 */

import { useState, useEffect, useCallback } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs'
import { UserProfile, ApiResponse } from '@/types'
import { getCurrentUserClient, handleLogout } from '@/lib/lib/auth-client'

interface UseAuthReturn {
  // User state
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Clerk state
  clerkUser: any
  clerkIsLoaded: boolean
  clerkIsSignedIn: boolean
  
  // Functions
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile | null>
  
  // Error state
  error: string | null
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Clerk hooks
  const { user: clerkUser, isLoaded: clerkIsLoaded, isSignedIn: clerkIsSignedIn } = useUser()
  const { signOut } = useClerkAuth()

  // Derived state
  const isAuthenticated = clerkIsSignedIn && user !== null

  /**
   * Refresh user data from .NET Web API
   */
  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!clerkIsSignedIn || !clerkUser) {
        setUser(null)
        return
      }

      console.log('useAuth: Refreshing user data from .NET Web API...')

      // Get user from .NET Web API (handles creation if needed)
      const authUser = await getCurrentUserClient(clerkUser)

      if (authUser) {
        // Convert ClientAuthUser to UserProfile format
        const userProfile: UserProfile = {
          id: authUser.id,
          email: authUser.email,
          fullName: authUser.fullName,
          firstName: authUser.firstName,
          lastName: authUser.lastName,
          phoneNumber: '', // Will be updated when available
          profileImageUrl: clerkUser.imageUrl,
          clerkUserId: clerkUser.id,
          role: authUser.role,
          userType: authUser.userType,
          status: 'ACTIVE' as any, // For backward compatibility
          isActive: authUser.isActive,
          loggedIn: true,
          lastLoginAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        setUser(userProfile)
        console.log('useAuth: User data refreshed successfully')
      } else {
        console.warn('useAuth: Failed to get user from .NET Web API')
        setUser(null)
      }
    } catch (err) {
      console.error('useAuth: Error refreshing user:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh user data')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [clerkIsSignedIn, clerkUser])

  /**
   * Handle user logout
   */
  const logout = useCallback(async () => {
    try {
      console.log('useAuth: Handling logout...')

      if (user && clerkUser) {
        // Update logout status in .NET Web API
        await handleLogout(user.id, clerkUser.id)
      }

      // Sign out from Clerk
      await signOut()
      
      // Clear local state
      setUser(null)
      setError(null)
      
      console.log('useAuth: Logout completed')
    } catch (err) {
      console.error('useAuth: Error during logout:', err)
      setError(err instanceof Error ? err.message : 'Failed to logout')
    }
  }, [user, clerkUser, signOut])

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (data: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      if (!user) {
        throw new Error('No user to update')
      }

      console.log('useAuth: Updating user profile...')

      const response = await fetch(`/api/sonobrokers/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const result = await response.json()
      if (result.success && result.data) {
        setUser(result.data)
        console.log('useAuth: Profile updated successfully')
        return result.data
      } else {
        throw new Error(result.message || 'Failed to update profile')
      }
    } catch (err) {
      console.error('useAuth: Error updating profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      return null
    }
  }, [user])

  // Effect to handle authentication state changes
  useEffect(() => {
    if (clerkIsLoaded) {
      if (clerkIsSignedIn && clerkUser) {
        // User is signed in, refresh user data
        refreshUser()
      } else {
        // User is not signed in, clear state
        setUser(null)
        setIsLoading(false)
        setError(null)
      }
    }
  }, [clerkIsLoaded, clerkIsSignedIn, clerkUser, refreshUser])

  // Effect to handle user changes (e.g., profile updates in Clerk)
  useEffect(() => {
    if (clerkIsSignedIn && clerkUser && user) {
      // Check if Clerk user data has changed
      const clerkFullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim()
      const clerkEmail = clerkUser.primaryEmailAddress?.emailAddress

      if (
        clerkFullName !== user.fullName ||
        clerkEmail !== user.email ||
        clerkUser.imageUrl !== user.profileImageUrl
      ) {
        console.log('useAuth: Clerk user data changed, refreshing...')
        refreshUser()
      }
    }
  }, [clerkUser, user, clerkIsSignedIn, refreshUser])

  return {
    user,
    isAuthenticated,
    isLoading,
    clerkUser,
    clerkIsLoaded,
    clerkIsSignedIn,
    refreshUser,
    logout,
    updateProfile,
    error
  }
}

/**
 * useAuthGuard Hook
 * Hook for protecting routes that require authentication
 */
export function useAuthGuard(redirectTo: string = '/sign-in') {
  const { isAuthenticated, isLoading, clerkIsLoaded } = useAuth()
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    if (clerkIsLoaded && !isLoading) {
      if (!isAuthenticated) {
        setShouldRedirect(true)
      }
    }
  }, [isAuthenticated, isLoading, clerkIsLoaded])

  return {
    isAuthenticated,
    isLoading: isLoading || !clerkIsLoaded,
    shouldRedirect,
    redirectTo
  }
}

export default useAuth
