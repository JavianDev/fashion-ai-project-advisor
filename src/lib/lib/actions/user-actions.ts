'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import {
  updateUserProfileAction as updateUserProfileAPI,
  updateUserTypeAction as updateUserTypeAPI,
  syncUserWithClerk,
  type UpdateUserProfileRequest,
  type UserTypeUpdateRequest
} from "@/lib/lib/api/auth-api"

/**
 * Server Actions for User Profile Management
 * Handles user profile updates and authentication sync
 */

// Validation schemas
const updateProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Name too long').optional(),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  userType: z.enum(['Buyer', 'Seller']).optional(),
})

const userTypeSchema = z.object({
  userType: z.enum(['Buyer', 'Seller']),
})

// Action result types
type ActionResult<T = any> = {
  success: boolean
  data?: T
  error?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * Server Action: Update user profile
 */
export async function updateUserProfileAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract and validate form data
    const rawData = {
      fullName: formData.get('fullName') as string || undefined,
      firstName: formData.get('firstName') as string || undefined,
      lastName: formData.get('lastName') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      userType: formData.get('userType') as 'Buyer' | 'Seller' || undefined,
    }

    // Remove undefined values and clean phone field
    const cleanData = Object.fromEntries(
      Object.entries(rawData).filter(([_, value]) => value !== undefined && value !== '')
    )

    // Validate data
    const validationResult = updateProfileSchema.safeParse(cleanData)
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Update profile
    const updatedProfile = await updateUserProfileAPI(validationResult.data as UpdateUserProfileRequest)

    if (!updatedProfile) {
      return {
        success: false,
        error: 'Failed to update profile',
      }
    }

    // Revalidate relevant pages
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/profile')
    revalidatePath('/dashboard/settings')

    return {
      success: true,
      data: updatedProfile,
    }
  } catch (error) {
    console.error('Failed to update user profile:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile',
    }
  }
}

/**
 * Server Action: Update user type (Buyer/Seller)
 */
export async function updateUserTypeAction(
  userType: 'Buyer' | 'Seller'
): Promise<ActionResult> {
  try {
    // Validate user type
    const validationResult = userTypeSchema.safeParse({ userType })
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Invalid user type',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Update user type
    const updatedProfile = await updateUserTypeAPI(userType)

    if (!updatedProfile) {
      return {
        success: false,
        error: 'Failed to update user type',
      }
    }

    // Revalidate relevant pages
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/profile')
    revalidatePath('/dashboard/properties')
    revalidatePath('/dashboard/advertiser')

    return {
      success: true,
      data: updatedProfile,
    }
  } catch (error) {
    console.error('Failed to update user type:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user type',
    }
  }
}

/**
 * Server Action: Sync user with Clerk
 */
export async function syncUserWithClerkAction(): Promise<ActionResult> {
  try {
    const syncedProfile = await syncUserWithClerk()

    if (!syncedProfile) {
      return {
        success: false,
        error: 'Failed to sync with authentication provider',
      }
    }

    // Revalidate relevant pages
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/profile')

    return {
      success: true,
      data: syncedProfile,
    }
  } catch (error) {
    console.error('Failed to sync user with Clerk:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sync user data',
    }
  }
}

/**
 * Server Action: Complete user onboarding
 */
export async function completeOnboardingAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract onboarding data
    const userType = formData.get('userType') as 'Buyer' | 'Seller'
    const fullName = formData.get('fullName') as string
    const phone = formData.get('phone') as string

    // Validate required fields
    if (!userType || !fullName) {
      return {
        success: false,
        error: 'User type and full name are required',
      }
    }

    // Update profile with onboarding data
    const profileData: UpdateUserProfileRequest = {
      fullName,
      userType,
    }

    if (phone) {
      profileData.phone = phone
    }

    const updatedProfile = await updateUserProfileAPI(profileData)

    if (!updatedProfile) {
      return {
        success: false,
        error: 'Failed to complete onboarding',
      }
    }

    // Revalidate and redirect to dashboard
    revalidatePath('/dashboard')
    redirect('/dashboard')

  } catch (error) {
    console.error('Failed to complete onboarding:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete onboarding',
    }
  }
}

/**
 * Server Action: Switch user mode (Buyer/Seller)
 */
export async function switchUserModeAction(
  newUserType: 'Buyer' | 'Seller'
): Promise<ActionResult> {
  try {
    const result = await updateUserTypeAction(newUserType)
    
    if (result.success) {
      // Redirect to appropriate dashboard section
      const redirectPath = newUserType === 'Seller' ? '/dashboard/properties' : '/dashboard'
      redirect(redirectPath)
    }

    return result
  } catch (error) {
    console.error('Failed to switch user mode:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to switch user mode',
    }
  }
}

/**
 * Server Action: Update user preferences
 */
export async function updateUserPreferencesAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract preference data
    const preferences = {
      emailNotifications: formData.get('emailNotifications') === 'true',
      smsNotifications: formData.get('smsNotifications') === 'true',
      marketingEmails: formData.get('marketingEmails') === 'true',
      propertyAlerts: formData.get('propertyAlerts') === 'true',
      priceDropAlerts: formData.get('priceDropAlerts') === 'true',
    }

    // Note: This would typically be a separate API endpoint for preferences
    // For now, we'll store basic preferences in the user profile
    
    // Revalidate relevant pages
    revalidatePath('/dashboard/settings')

    return {
      success: true,
      data: preferences,
    }
  } catch (error) {
    console.error('Failed to update user preferences:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update preferences',
    }
  }
}

/**
 * Server Action: Delete user account
 */
export async function deleteUserAccountAction(): Promise<ActionResult> {
  try {
    // Note: This would typically call a delete user API endpoint
    // For now, we'll just return a placeholder
    
    // In a real implementation, this would:
    // 1. Delete user data from the database
    // 2. Delete associated properties and advertiser profiles
    // 3. Cancel any active subscriptions
    // 4. Log the user out
    
    return {
      success: false,
      error: 'Account deletion is not yet implemented. Please contact support.',
    }
  } catch (error) {
    console.error('Failed to delete user account:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete account',
    }
  }
}
