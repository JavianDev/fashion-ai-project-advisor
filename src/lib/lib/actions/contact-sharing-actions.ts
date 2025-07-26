'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { 
  createContactShare, 
  respondToContactShare,
  deleteContactShare,
  type CreateContactShareRequest,
  type ContactShareSellerResponse,
  ContactShareType,
  ContactShareStatus
} from "@/lib/lib/api/contact-sharing-api"

/**
 * Server Actions for Contact Sharing
 * Handles form submissions and contact sharing operations with revalidation
 */

// Validation schemas
const createContactShareSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  sellerId: z.string().min(1, 'Seller ID is required'),
  buyerName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  buyerEmail: z.string().email('Valid email is required'),
  buyerPhone: z.string().optional(),
  message: z.string().max(1000, 'Message too long').optional(),
  shareType: z.nativeEnum(ContactShareType),
  offerAmount: z.number().min(0, 'Offer amount must be positive').optional(),
  schedulingPreference: z.string().optional(),
  preferredVisitDate: z.string().optional(),
  preferredVisitTime: z.string().optional(),
})

const sellerResponseSchema = z.object({
  status: z.nativeEnum(ContactShareStatus),
  response: z.string().max(1000, 'Response too long').optional(),
  counterOfferAmount: z.number().min(0, 'Counter offer must be positive').optional(),
  alternativeVisitDate: z.string().optional(),
  alternativeVisitTime: z.string().optional(),
})

// Action result types
type ActionResult<T = any> = {
  success: boolean
  data?: T
  error?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * Server Action: Share contact information with seller
 */
export async function shareContactAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract and validate form data
    const rawData = {
      propertyId: formData.get('propertyId') as string,
      sellerId: formData.get('sellerId') as string,
      buyerName: formData.get('buyerName') as string,
      buyerEmail: formData.get('buyerEmail') as string,
      buyerPhone: formData.get('buyerPhone') as string || undefined,
      message: formData.get('message') as string || undefined,
      shareType: formData.get('shareType') as ContactShareType,
      offerAmount: formData.get('offerAmount') ? parseFloat(formData.get('offerAmount') as string) : undefined,
      schedulingPreference: formData.get('schedulingPreference') as string || undefined,
      preferredVisitDate: formData.get('preferredVisitDate') as string || undefined,
      preferredVisitTime: formData.get('preferredVisitTime') as string || undefined,
    }

    // Validate data
    const validationResult = createContactShareSchema.safeParse(rawData)
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Create contact share
    const contactShare = await createContactShare(validationResult.data as CreateContactShareRequest)

    // Revalidate relevant pages
    revalidatePath('/properties')
    revalidatePath(`/properties/${rawData.propertyId}`)
    revalidatePath('/dashboard/contact-shares')

    return {
      success: true,
      data: contactShare,
    }
  } catch (error) {
    console.error('Failed to share contact:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to share contact information',
    }
  }
}

/**
 * Server Action: Submit property offer
 */
export async function submitOfferAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract and validate form data
    const rawData = {
      propertyId: formData.get('propertyId') as string,
      sellerId: formData.get('sellerId') as string,
      buyerName: formData.get('buyerName') as string,
      buyerEmail: formData.get('buyerEmail') as string,
      buyerPhone: formData.get('buyerPhone') as string || undefined,
      message: formData.get('message') as string || undefined,
      shareType: ContactShareType.PropertyOffer,
      offerAmount: parseFloat(formData.get('offerAmount') as string),
      schedulingPreference: formData.get('schedulingPreference') as string || undefined,
      preferredVisitDate: formData.get('preferredVisitDate') as string || undefined,
      preferredVisitTime: formData.get('preferredVisitTime') as string || undefined,
    }

    // Validate data
    const validationResult = createContactShareSchema.safeParse(rawData)
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Create offer
    const contactShare = await createContactShare(validationResult.data as CreateContactShareRequest)

    // Revalidate relevant pages
    revalidatePath('/properties')
    revalidatePath(`/properties/${rawData.propertyId}`)
    revalidatePath('/dashboard/contact-shares')
    revalidatePath('/dashboard/offers')

    return {
      success: true,
      data: contactShare,
    }
  } catch (error) {
    console.error('Failed to submit offer:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit offer',
    }
  }
}

/**
 * Server Action: Schedule property visit
 */
export async function scheduleVisitAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract and validate form data
    const rawData = {
      propertyId: formData.get('propertyId') as string,
      sellerId: formData.get('sellerId') as string,
      buyerName: formData.get('buyerName') as string,
      buyerEmail: formData.get('buyerEmail') as string,
      buyerPhone: formData.get('buyerPhone') as string || undefined,
      message: formData.get('message') as string || undefined,
      shareType: ContactShareType.ScheduleVisit,
      schedulingPreference: formData.get('schedulingPreference') as string || undefined,
      preferredVisitDate: formData.get('preferredVisitDate') as string || undefined,
      preferredVisitTime: formData.get('preferredVisitTime') as string || undefined,
    }

    // Validate data
    const validationResult = createContactShareSchema.safeParse(rawData)
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Create visit request
    const contactShare = await createContactShare(validationResult.data as CreateContactShareRequest)

    // Revalidate relevant pages
    revalidatePath('/properties')
    revalidatePath(`/properties/${rawData.propertyId}`)
    revalidatePath('/dashboard/contact-shares')
    revalidatePath('/dashboard/visits')

    return {
      success: true,
      data: contactShare,
    }
  } catch (error) {
    console.error('Failed to schedule visit:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to schedule visit',
    }
  }
}

/**
 * Server Action: Submit offer with visit request
 */
export async function submitOfferWithVisitAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract and validate form data
    const rawData = {
      propertyId: formData.get('propertyId') as string,
      sellerId: formData.get('sellerId') as string,
      buyerName: formData.get('buyerName') as string,
      buyerEmail: formData.get('buyerEmail') as string,
      buyerPhone: formData.get('buyerPhone') as string || undefined,
      message: formData.get('message') as string || undefined,
      shareType: ContactShareType.OfferWithVisit,
      offerAmount: parseFloat(formData.get('offerAmount') as string),
      schedulingPreference: formData.get('schedulingPreference') as string || undefined,
      preferredVisitDate: formData.get('preferredVisitDate') as string || undefined,
      preferredVisitTime: formData.get('preferredVisitTime') as string || undefined,
    }

    // Validate data
    const validationResult = createContactShareSchema.safeParse(rawData)
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Create offer with visit
    const contactShare = await createContactShare(validationResult.data as CreateContactShareRequest)

    // Revalidate relevant pages
    revalidatePath('/properties')
    revalidatePath(`/properties/${rawData.propertyId}`)
    revalidatePath('/dashboard/contact-shares')
    revalidatePath('/dashboard/offers')
    revalidatePath('/dashboard/visits')

    return {
      success: true,
      data: contactShare,
    }
  } catch (error) {
    console.error('Failed to submit offer with visit:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit offer with visit request',
    }
  }
}

/**
 * Server Action: Seller response to contact share
 */
export async function sellerRespondAction(
  contactShareId: string,
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract and validate form data
    const rawData = {
      status: formData.get('status') as ContactShareStatus,
      response: formData.get('response') as string || undefined,
      counterOfferAmount: formData.get('counterOfferAmount') ? parseFloat(formData.get('counterOfferAmount') as string) : undefined,
      alternativeVisitDate: formData.get('alternativeVisitDate') as string || undefined,
      alternativeVisitTime: formData.get('alternativeVisitTime') as string || undefined,
    }

    // Validate data
    const validationResult = sellerResponseSchema.safeParse(rawData)
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Submit response
    const success = await respondToContactShare(contactShareId, validationResult.data as Omit<ContactShareSellerResponse, 'contactShareId'>)

    if (!success) {
      return {
        success: false,
        error: 'Failed to submit response',
      }
    }

    // Revalidate relevant pages
    revalidatePath('/dashboard/contact-shares')
    revalidatePath(`/contact-share/${contactShareId}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to submit seller response:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit response',
    }
  }
}

/**
 * Server Action: Delete contact share
 */
export async function deleteContactShareAction(contactShareId: string): Promise<ActionResult> {
  try {
    const success = await deleteContactShare(contactShareId)

    if (!success) {
      return {
        success: false,
        error: 'Failed to delete contact share',
      }
    }

    // Revalidate relevant pages
    revalidatePath('/dashboard/contact-shares')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to delete contact share:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete contact share',
    }
  }
}
