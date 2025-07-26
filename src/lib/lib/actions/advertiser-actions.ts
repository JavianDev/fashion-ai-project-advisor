'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { 
  createAdvertiser, 
  updateAdvertiser, 
  deleteAdvertiser,
  upgradeAdvertiserToPremium,
  type CreateAdvertiserRequest,
  type UpdateAdvertiserRequest,
  type ServiceType,
  type AdvertiserPlan,
  type AdvertiserStatus
} from '@/lib/lib/api/advertisers-api'

/**
 * Server Actions for Advertiser Management
 * Handles service provider form submissions and data mutations
 */

// Validation schemas
const createAdvertiserSchema = z.object({
  businessName: z.string().min(1, 'Business name is required').max(100, 'Business name too long'),
  contactName: z.string().min(1, 'Contact name is required').max(100, 'Contact name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  description: z.string().min(50, 'Description must be at least 50 characters').max(1000, 'Description too long'),
  serviceType: z.enum(['photographer', 'lawyer', 'inspector', 'stager', 'cleaner', 'contractor', 'realtor', 'mortgage_broker', 'insurance_agent']),
  serviceAreas: z.array(z.string()).min(1, 'At least one service area is required'),
  licenseNumber: z.string().optional(),
  plan: z.enum(['basic', 'premium']),
})

const updateAdvertiserSchema = createAdvertiserSchema.partial().extend({
  status: z.enum(['active', 'inactive', 'pending', 'suspended']).optional(),
  isPremium: z.boolean().optional(),
  isVerified: z.boolean().optional(),
})

// Action result types
type ActionResult<T = any> = {
  success: boolean
  data?: T
  error?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * Server Action: Create new advertiser profile
 */
export async function createAdvertiserAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract and validate form data
    const rawData = {
      businessName: formData.get('businessName') as string,
      contactName: formData.get('contactName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      website: formData.get('website') as string || undefined,
      description: formData.get('description') as string,
      serviceType: formData.get('serviceType') as ServiceType,
      serviceAreas: formData.getAll('serviceAreas') as string[],
      licenseNumber: formData.get('licenseNumber') as string || undefined,
      plan: formData.get('plan') as AdvertiserPlan,
    }

    // Clean website field
    if (rawData.website === '') {
      rawData.website = undefined
    }

    // Validate data
    const validationResult = createAdvertiserSchema.safeParse(rawData)
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Create advertiser
    const advertiser = await createAdvertiser(validationResult.data as CreateAdvertiserRequest)

    // Revalidate relevant pages
    revalidatePath('/dashboard/advertiser')
    revalidatePath('/services')
    revalidatePath('/')

    return {
      success: true,
      data: advertiser,
    }
  } catch (error) {
    console.error('Failed to create advertiser:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create advertiser profile',
    }
  }
}

/**
 * Server Action: Update advertiser profile
 */
export async function updateAdvertiserAction(
  advertiserId: string,
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract and validate form data
    const rawData = {
      businessName: formData.get('businessName') as string || undefined,
      contactName: formData.get('contactName') as string || undefined,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      website: formData.get('website') as string || undefined,
      description: formData.get('description') as string || undefined,
      serviceType: formData.get('serviceType') as ServiceType || undefined,
      serviceAreas: formData.getAll('serviceAreas') as string[] || undefined,
      licenseNumber: formData.get('licenseNumber') as string || undefined,
      plan: formData.get('plan') as AdvertiserPlan || undefined,
      status: formData.get('status') as AdvertiserStatus || undefined,
      isPremium: formData.get('isPremium') ? formData.get('isPremium') === 'true' : undefined,
      isVerified: formData.get('isVerified') ? formData.get('isVerified') === 'true' : undefined,
    }

    // Remove undefined values and clean website field
    const cleanData = Object.fromEntries(
      Object.entries(rawData).filter(([_, value]) => value !== undefined)
    )

    if (cleanData.website === '') {
      cleanData.website = undefined
    }

    // Validate data
    const validationResult = updateAdvertiserSchema.safeParse(cleanData)
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Update advertiser
    const advertiser = await updateAdvertiser(advertiserId, validationResult.data as UpdateAdvertiserRequest)

    // Revalidate relevant pages
    revalidatePath('/dashboard/advertiser')
    revalidatePath(`/services/${advertiser.serviceType}`)
    revalidatePath('/services')
    revalidatePath('/')

    return {
      success: true,
      data: advertiser,
    }
  } catch (error) {
    console.error('Failed to update advertiser:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update advertiser profile',
    }
  }
}

/**
 * Server Action: Delete advertiser profile
 */
export async function deleteAdvertiserAction(advertiserId: string): Promise<ActionResult> {
  try {
    await deleteAdvertiser(advertiserId)

    // Revalidate relevant pages
    revalidatePath('/dashboard/advertiser')
    revalidatePath('/services')
    revalidatePath('/')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to delete advertiser:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete advertiser profile',
    }
  }
}

/**
 * Server Action: Upgrade advertiser to premium
 */
export async function upgradeAdvertiserAction(advertiserId: string): Promise<ActionResult> {
  try {
    const advertiser = await upgradeAdvertiserToPremium(advertiserId)

    // Revalidate relevant pages
    revalidatePath('/dashboard/advertiser')
    revalidatePath(`/services/${advertiser.serviceType}`)
    revalidatePath('/services')

    return {
      success: true,
      data: advertiser,
    }
  } catch (error) {
    console.error('Failed to upgrade advertiser:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upgrade to premium',
    }
  }
}

/**
 * Server Action: Update advertiser status
 */
export async function updateAdvertiserStatusAction(
  advertiserId: string,
  status: AdvertiserStatus
): Promise<ActionResult> {
  try {
    const advertiser = await updateAdvertiser(advertiserId, { status })

    // Revalidate relevant pages
    revalidatePath('/dashboard/advertiser')
    revalidatePath(`/services/${advertiser.serviceType}`)
    revalidatePath('/services')

    return {
      success: true,
      data: advertiser,
    }
  } catch (error) {
    console.error('Failed to update advertiser status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update status',
    }
  }
}

/**
 * Server Action: Toggle advertiser verification
 */
export async function toggleAdvertiserVerificationAction(
  advertiserId: string,
  isVerified: boolean
): Promise<ActionResult> {
  try {
    const advertiser = await updateAdvertiser(advertiserId, { isVerified })

    // Revalidate relevant pages
    revalidatePath('/dashboard/advertiser')
    revalidatePath(`/services/${advertiser.serviceType}`)
    revalidatePath('/services')

    return {
      success: true,
      data: advertiser,
    }
  } catch (error) {
    console.error('Failed to toggle advertiser verification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update verification status',
    }
  }
}

/**
 * Server Action: Submit advertiser application
 */
export async function submitAdvertiserApplicationAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Create advertiser with pending status
    const result = await createAdvertiserAction(prevState, formData)
    
    if (result.success) {
      // Redirect to success page
      redirect('/dashboard/advertiser/application-submitted')
    }

    return result
  } catch (error) {
    console.error('Failed to submit advertiser application:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit application',
    }
  }
}

/**
 * Server Action: Bulk update advertiser statuses
 */
export async function bulkUpdateAdvertiserStatusAction(
  advertiserIds: string[],
  status: AdvertiserStatus
): Promise<ActionResult> {
  try {
    const results = await Promise.allSettled(
      advertiserIds.map(id => updateAdvertiser(id, { status }))
    )

    const successful = results.filter(result => result.status === 'fulfilled').length
    const failed = results.length - successful

    // Revalidate relevant pages
    revalidatePath('/dashboard/advertiser')
    revalidatePath('/services')

    return {
      success: true,
      data: {
        successful,
        failed,
        total: results.length,
      },
    }
  } catch (error) {
    console.error('Failed to bulk update advertisers:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update advertisers',
    }
  }
}
