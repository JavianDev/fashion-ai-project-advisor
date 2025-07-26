import { auth } from '@clerk/nextjs/server'
import { apiClient, type ApiResponse } from "@/lib/lib/api-client"
import type { SnbUserType } from '@/types'

/**
 * Authentication API Service
 * Handles user authentication and profile management
 * Updated to use new Core controller endpoints
 *
 * This file handles:
 * - Current user profile operations
 * - User type updates (Buyer/Seller)
 * - Clerk synchronization
 * - Authentication state checks
 * - Authentication utilities
 *
 * For user management operations (admin functions), use user-api.ts
 */

// Types
export interface UserProfile {
  id: string
  email: string
  fullName: string
  firstName: string
  lastName: string
  phone?: string
  clerkUserId: string
  role: 'USER' | 'ADMIN' | 'PRODUCT'
  userType: 'Buyer' | 'Seller'
  isActive: boolean
  loggedIn: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface UpdateUserProfileRequest {
  fullName?: string
  firstName?: string
  lastName?: string
  phone?: string
  userType?: 'Buyer' | 'Seller'
}

export interface UserTypeUpdateRequest {
  userType: 'Buyer' | 'Seller'
}

/**
 * Server Action: Get current user profile
 */
export async function getCurrentUserProfileAction(): Promise<UserProfile | null> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      return null
    }

    const response = await apiClient.get<ApiResponse<UserProfile>>('/api/core/user/profile')
    return response.data || null
  } catch (error) {
    console.error('Failed to get user profile:', error)
    return null
  }
}

/**
 * Server Action: Update user profile
 */
export async function updateUserProfileAction(data: UpdateUserProfileRequest): Promise<UserProfile | null> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.put<ApiResponse<UserProfile>>('/api/core/user/profile', data)
    return response.data || null
  } catch (error) {
    console.error('Failed to update user profile:', error)
    throw error
  }
}

/**
 * Server Action: Update user type (Buyer/Seller)
 */
export async function updateUserTypeAction(userType: 'Buyer' | 'Seller'): Promise<UserProfile | null> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const updatedProfile = await apiClient.put<UserProfile>('/api/core/user/user-type', { userType })
    return updatedProfile
  } catch (error) {
    console.error('Failed to update user type:', error)
    throw error
  }
}

/**
 * Server Action: Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    return !!token
  } catch (error) {
    return false
  }
}

/**
 * Server Action: Get user role
 */
export async function getUserRole(): Promise<string | null> {
  try {
    const profile = await getCurrentUserProfileAction()
    return profile?.role || null
  } catch (error) {
    console.error('Failed to get user role:', error)
    return null
  }
}

/**
 * Server Action: Check if user has admin access
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const role = await getUserRole()
    return role === 'ADMIN'
  } catch (error) {
    return false
  }
}

/**
 * Server Action: Check if user has product access
 */
export async function isProductUser(): Promise<boolean> {
  try {
    const role = await getUserRole()
    return role === 'PRODUCT'
  } catch (error) {
    return false
  }
}

/**
 * Server Action: Sync user with Clerk
 */
export async function syncUserWithClerk(): Promise<UserProfile | null> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const syncedProfile = await apiClient.post<UserProfile>('/api/core/user/sync')
    return syncedProfile
  } catch (error) {
    console.error('Failed to sync user with Clerk:', error)
    throw error
  }
}

/**
 * Client-side helper: Get auth token for client components
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const { getToken } = await auth()
    return await getToken()
  } catch (error) {
    console.error('Failed to get auth token:', error)
    return null
  }
}
