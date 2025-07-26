'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { 
  createConversation, 
  sendMessage, 
  markMessagesAsRead,
  updateConversation,
  deleteConversation,
  type CreateConversationRequest,
  type CreateMessageRequest 
} from "@/lib/lib/api/messaging-api"

/**
 * Server Actions for Messaging
 * Handles form submissions and messaging operations with revalidation
 */

// Validation schemas
const createConversationSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  sellerId: z.string().min(1, 'Seller ID is required'),
  subject: z.string().optional(),
  initialMessage: z.string().min(1, 'Initial message is required').max(1000, 'Message too long'),
})

const sendMessageSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
  content: z.string().min(1, 'Message content is required').max(2000, 'Message too long'),
  messageType: z.string().optional().default('text'),
})

// Action result types
type ActionResult<T = any> = {
  success: boolean
  data?: T
  error?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * Server Action: Create new conversation
 */
export async function createConversationAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract and validate form data
    const rawData = {
      propertyId: formData.get('propertyId') as string,
      sellerId: formData.get('sellerId') as string,
      subject: formData.get('subject') as string || undefined,
      initialMessage: formData.get('initialMessage') as string,
    }

    // Validate data
    const validationResult = createConversationSchema.safeParse(rawData)
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Create conversation
    const conversation = await createConversation(validationResult.data as CreateConversationRequest)

    // Revalidate relevant pages
    revalidatePath('/dashboard/messages')
    revalidatePath('/messages')
    revalidatePath(`/properties/${rawData.propertyId}`)

    return {
      success: true,
      data: conversation,
    }
  } catch (error) {
    console.error('Failed to create conversation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create conversation',
    }
  }
}

/**
 * Server Action: Send message
 */
export async function sendMessageAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract and validate form data
    const rawData = {
      conversationId: formData.get('conversationId') as string,
      content: formData.get('content') as string,
      messageType: formData.get('messageType') as string || 'text',
    }

    // Validate data
    const validationResult = sendMessageSchema.safeParse(rawData)
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Send message
    const message = await sendMessage(validationResult.data as CreateMessageRequest)

    // Revalidate relevant pages
    revalidatePath('/dashboard/messages')
    revalidatePath('/messages')
    revalidatePath(`/messages/${rawData.conversationId}`)

    return {
      success: true,
      data: message,
    }
  } catch (error) {
    console.error('Failed to send message:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    }
  }
}

/**
 * Server Action: Mark messages as read
 */
export async function markMessagesAsReadAction(
  conversationId: string,
  messageIds?: string[]
): Promise<ActionResult> {
  try {
    const success = await markMessagesAsRead(conversationId, messageIds)

    if (!success) {
      return {
        success: false,
        error: 'Failed to mark messages as read',
      }
    }

    // Revalidate relevant pages
    revalidatePath('/dashboard/messages')
    revalidatePath('/messages')
    revalidatePath(`/messages/${conversationId}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to mark messages as read:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark messages as read',
    }
  }
}

/**
 * Server Action: Update conversation
 */
export async function updateConversationAction(
  conversationId: string,
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract form data
    const subject = formData.get('subject') as string || undefined
    const isActive = formData.get('isActive') === 'true'

    const updates: { subject?: string; isActive?: boolean } = {}
    
    if (subject !== undefined && subject !== '') {
      updates.subject = subject
    }
    
    if (formData.has('isActive')) {
      updates.isActive = isActive
    }

    if (Object.keys(updates).length === 0) {
      return {
        success: false,
        error: 'No updates provided',
      }
    }

    // Update conversation
    const success = await updateConversation(conversationId, updates)

    if (!success) {
      return {
        success: false,
        error: 'Failed to update conversation',
      }
    }

    // Revalidate relevant pages
    revalidatePath('/dashboard/messages')
    revalidatePath('/messages')
    revalidatePath(`/messages/${conversationId}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to update conversation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update conversation',
    }
  }
}

/**
 * Server Action: Delete conversation
 */
export async function deleteConversationAction(conversationId: string): Promise<ActionResult> {
  try {
    const success = await deleteConversation(conversationId)

    if (!success) {
      return {
        success: false,
        error: 'Failed to delete conversation',
      }
    }

    // Revalidate relevant pages
    revalidatePath('/dashboard/messages')
    revalidatePath('/messages')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to delete conversation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete conversation',
    }
  }
}

/**
 * Server Action: Start conversation from property page
 */
export async function startConversationFromPropertyAction(
  propertyId: string,
  sellerId: string,
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const message = formData.get('message') as string
    const subject = formData.get('subject') as string || 'Property Inquiry'

    if (!message || message.trim().length === 0) {
      return {
        success: false,
        error: 'Message is required',
        fieldErrors: { message: ['Message is required'] },
      }
    }

    if (message.length > 1000) {
      return {
        success: false,
        error: 'Message is too long',
        fieldErrors: { message: ['Message must be less than 1000 characters'] },
      }
    }

    // Create conversation
    const conversation = await createConversation({
      propertyId,
      sellerId,
      subject,
      initialMessage: message,
    })

    // Revalidate and redirect
    revalidatePath('/dashboard/messages')
    revalidatePath('/messages')
    redirect(`/messages/${conversation.id}`)

  } catch (error) {
    console.error('Failed to start conversation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start conversation',
    }
  }
}

/**
 * Server Action: Quick reply to message
 */
export async function quickReplyAction(
  conversationId: string,
  content: string
): Promise<ActionResult> {
  try {
    if (!content || content.trim().length === 0) {
      return {
        success: false,
        error: 'Message content is required',
      }
    }

    if (content.length > 2000) {
      return {
        success: false,
        error: 'Message is too long (max 2000 characters)',
      }
    }

    // Send message
    const message = await sendMessage({
      conversationId,
      content: content.trim(),
      messageType: 'text',
    })

    // Revalidate relevant pages
    revalidatePath('/dashboard/messages')
    revalidatePath('/messages')
    revalidatePath(`/messages/${conversationId}`)

    return {
      success: true,
      data: message,
    }
  } catch (error) {
    console.error('Failed to send quick reply:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    }
  }
}
