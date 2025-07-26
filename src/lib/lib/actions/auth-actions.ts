'use server'

import { revalidatePath } from 'next/cache'
import { apiClient } from '@/lib/lib/api-client'

/**
 * Server Actions for Authentication Tracking
 * Handles login/logout tracking and authentication statistics
 */

// Action result types
type ActionResult<T = any> = {
  success: boolean
  data?: T
  error?: string
}

/**
 * Server Action: Track user login
 */
export async function trackLoginAction(): Promise<ActionResult> {
  try {
    await apiClient.post('/api/sonobrokers/auth/track-login')

    // Revalidate relevant pages
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/profile')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to track login:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to track login',
    }
  }
}

/**
 * Server Action: Track user logout
 */
export async function trackLogoutAction(): Promise<ActionResult> {
  try {
    await apiClient.post('/api/sonobrokers/auth/track-logout')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to track logout:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to track logout',
    }
  }
}

/**
 * Server Action: Get login statistics
 */
export async function getLoginStatsAction(): Promise<ActionResult> {
  try {
    const stats = await apiClient.get('/api/sonobrokers/auth/login-stats')

    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error('Failed to get login stats:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get login stats',
    }
  }
}

/**
 * Server Action: Validate authentication
 */
export async function validateAuthAction(): Promise<ActionResult> {
  try {
    const validation = await apiClient.get('/api/sonobrokers/auth/validate')

    return {
      success: true,
      data: validation,
    }
  } catch (error) {
    console.error('Failed to validate auth:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to validate authentication',
    }
  }
}
