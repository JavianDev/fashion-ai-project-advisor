/**
 * User Management API Service
 * Handles user management operations using the new Core controller structure
 *
 * This file handles:
 * - User CRUD operations (admin functions)
 * - User search and filtering
 * - User role/status management
 * - User login status updates
 * - User administration functions
 *
 * For authentication-related operations (current user profile, auth state), use auth-api.ts
 */

import { auth } from '@clerk/nextjs/server'
import { apiClient } from "@/lib/lib/api-client"
import type {
  ApiResponse,
  UserProfile,
  CreateUserRequest,
  UserSearchParams,
  UserSearchResponse
} from '@/types'

// Additional types for user management
export interface UserLoginStats {
  isLoggedIn: boolean
  lastLoginAt?: string
  loginCount?: number
}

export interface UserActivity {
  id: string
  userId: string
  activityType: string
  description: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface UserNotification {
  id: string
  userId: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

// Authentication-related functions have been moved to auth-api.ts
// This file now focuses on user management operations

/**
 * Server Action: Get user by ID (admin only)
 * Updated to use Core controller endpoint
 */
export async function getUserById(id: string): Promise<UserProfile | null> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.get<ApiResponse<UserProfile>>(`/api/core/user/${id}`)
    return response.data || null
  } catch (error) {
    console.error('Failed to get user by ID:', error)
    return null
  }
}

/**
 * Server Action: Get user by email (admin only)
 * Updated to use Core controller endpoint
 */
export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.get<ApiResponse<UserProfile>>(`/api/core/user/by-email/${encodeURIComponent(email)}`)
    return response.data || null
  } catch (error) {
    console.error('Failed to get user by email:', error)
    return null
  }
}

/**
 * Server Action: Create user (admin only)
 * Updated to use Core controller endpoint
 */
export async function createUser(userData: CreateUserRequest): Promise<UserProfile | null> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.post<ApiResponse<UserProfile>>('/api/core/user', userData)
    return response.data || null
  } catch (error) {
    console.error('Failed to create user:', error)
    return null
  }
}

/**
 * Server Action: Delete user (admin only)
 * Updated to use Core controller endpoint
 */
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    await apiClient.delete(`/api/core/user/${id}`)
    return true
  } catch (error) {
    console.error('Failed to delete user:', error)
    return false
  }
}

/**
 * Server Action: Get all users (admin only)
 * Updated to use Core controller endpoint
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.get<ApiResponse<UserProfile[]>>('/api/core/user')
    return response.data || []
  } catch (error) {
    console.error('Failed to get all users:', error)
    return []
  }
}

/**
 * Server Action: Update user role (admin only)
 * Updated to use Core controller endpoint
 */
export async function updateUserRole(userId: string, role: string): Promise<UserProfile | null> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.put<ApiResponse<UserProfile>>(`/api/core/user/${userId}/role`, role)
    return response.data || null
  } catch (error) {
    console.error('Failed to update user role:', error)
    return null
  }
}

/**
 * Server Action: Update user status (admin only)
 * Updated to use Core controller endpoint
 */
export async function updateUserStatus(userId: string, isActive: boolean): Promise<UserProfile | null> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.put<ApiResponse<UserProfile>>(`/api/core/user/${userId}/status`, isActive)
    return response.data || null
  } catch (error) {
    console.error('Failed to update user status:', error)
    return null
  }
}

/**
 * Server Action: Update user login status
 * Updated to use Core controller endpoint
 */
export async function updateUserLoginStatus(id: string, loggedIn: boolean): Promise<void> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    await apiClient.patch<ApiResponse<void>>(`/api/core/user/${id}/login-status`, loggedIn)
  } catch (error) {
    console.error('Failed to update login status:', error)
    throw error
  }
}

/**
 * Server Action: Search users (admin only)
 * Note: This endpoint may need to be implemented in the Core controller
 */
export async function searchUsers(params: UserSearchParams): Promise<UserSearchResponse | null> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    // Note: This endpoint may need to be added to Core controller
    const response = await apiClient.get<ApiResponse<UserSearchResponse>>('/api/core/user/search', params)
    return response.data || null
  } catch (error) {
    console.error('Failed to search users:', error)
    return null
  }
}

/**
 * Server Action: Get users by type (Buyer/Seller)
 * Note: This endpoint may need to be implemented in the Core controller
 */
export async function getUsersByType(userType: 'Buyer' | 'Seller'): Promise<UserProfile[]> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    // Note: This endpoint may need to be added to Core controller
    const response = await apiClient.get<ApiResponse<UserProfile[]>>('/api/core/user/by-type', { userType })
    return response.data || []
  } catch (error) {
    console.error('Failed to get users by type:', error)
    return []
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.get<ApiResponse<UserProfile>>('/api/core/user/profile')
    return response.data || null
  } catch (error) {
    console.error('Failed to get current user profile:', error)
    return null
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.put<ApiResponse<UserProfile>>(`/api/core/user/${userId}`, profileData)
    return response.data || null
  } catch (error) {
    console.error('Failed to update user profile:', error)
    return null
  }
}

/**
 * Update user type
 */
export async function updateUserType(userId: string, userType: string): Promise<boolean> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.put<ApiResponse<any>>(`/api/core/user/${userId}/type`, { userType })
    return response.success || false
  } catch (error) {
    console.error('Failed to update user type:', error)
    return false
  }
}

// Authentication utilities have been moved to auth-api.ts
