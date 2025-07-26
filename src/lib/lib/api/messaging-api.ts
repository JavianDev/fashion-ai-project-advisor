import { auth } from '@clerk/nextjs/server'
import { apiClient } from "@/lib/lib/api-client"

/**
 * Messaging API Service
 * Handles conversations and messages between buyers and sellers
 */

// Types
export interface Conversation {
  id: string
  propertyId?: string
  propertyTitle?: string
  propertyAddress?: string
  propertyPrice?: number
  buyerId?: string
  buyerName?: string
  buyerEmail?: string
  sellerId?: string
  sellerName?: string
  sellerEmail?: string
  agentId?: string
  agentName?: string
  subject?: string
  lastMessageAt?: string
  isActive: boolean
  createdAt: string
  unreadCount: number
  lastMessage?: Message
  messages: Message[]
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderEmail: string
  content: string
  messageType: string
  isRead: boolean
  readAt?: string
  createdAt: string
  isOwnMessage: boolean
}

export interface ConversationListItem {
  id: string
  propertyId?: string
  propertyTitle?: string
  propertyAddress?: string
  propertyPrice?: number
  otherParticipantId?: string
  otherParticipantName?: string
  otherParticipantEmail?: string
  subject?: string
  lastMessageAt?: string
  lastMessageContent?: string
  lastMessageSenderId?: string
  isActive: boolean
  unreadCount: number
  createdAt: string
}

export interface CreateConversationRequest {
  propertyId: string
  sellerId: string
  subject?: string
  initialMessage: string
}

export interface CreateMessageRequest {
  conversationId: string
  content: string
  messageType?: string
}

export interface ConversationSearchParams {
  propertyId?: string
  userId?: string
  isActive?: boolean
  fromDate?: string
  toDate?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export interface MessageSearchParams {
  conversationId?: string
  senderId?: string
  search?: string
  fromDate?: string
  toDate?: string
  isRead?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export interface ConversationSearchResponse {
  conversations: ConversationListItem[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}

export interface MessageSearchResponse {
  messages: Message[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}

export interface MessageStats {
  totalMessages: number
  unreadMessages: number
  totalConversations: number
  activeConversations: number
  lastMessageAt?: string
  conversationStats: ConversationStats[]
}

export interface ConversationStats {
  conversationId: string
  propertyTitle?: string
  messageCount: number
  unreadCount: number
  lastMessageAt?: string
  lastMessageSender?: string
}

/**
 * Server Action: Create a new conversation
 */
export async function createConversation(request: CreateConversationRequest): Promise<Conversation> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const conversation = await apiClient.post<Conversation>('/api/sonobrokers/messaging/conversations', request)
    return conversation
  } catch (error) {
    console.error('Failed to create conversation:', error)
    throw error
  }
}

/**
 * Server Action: Get conversations for current user
 */
export async function getConversations(searchParams: ConversationSearchParams = {}): Promise<ConversationSearchResponse> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const queryParams = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value))
      }
    })

    const response = await apiClient.get<ConversationSearchResponse>(`/api/sonobrokers/messaging/conversations?${queryParams}`)
    return response
  } catch (error) {
    console.error('Failed to get conversations:', error)
    throw error
  }
}

/**
 * Server Action: Get a specific conversation
 */
export async function getConversation(conversationId: string): Promise<Conversation | null> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const conversation = await apiClient.get<Conversation>(`/api/sonobrokers/messaging/conversations/${conversationId}`)
    return conversation
  } catch (error) {
    console.error('Failed to get conversation:', error)
    return null
  }
}

/**
 * Server Action: Send a message
 */
export async function sendMessage(request: CreateMessageRequest): Promise<Message> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const message = await apiClient.post<Message>('/api/sonobrokers/messaging/messages', request)
    return message
  } catch (error) {
    console.error('Failed to send message:', error)
    throw error
  }
}

/**
 * Server Action: Get messages in a conversation
 */
export async function getMessages(conversationId: string, searchParams: MessageSearchParams = {}): Promise<MessageSearchResponse> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const queryParams = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value))
      }
    })

    const response = await apiClient.get<MessageSearchResponse>(`/api/sonobrokers/messaging/conversations/${conversationId}/messages?${queryParams}`)
    return response
  } catch (error) {
    console.error('Failed to get messages:', error)
    throw error
  }
}

/**
 * Server Action: Mark messages as read
 */
export async function markMessagesAsRead(conversationId: string, messageIds?: string[]): Promise<boolean> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    await apiClient.put(`/api/sonobrokers/messaging/conversations/${conversationId}/messages/read`, {
      messageIds: messageIds || []
    })
    return true
  } catch (error) {
    console.error('Failed to mark messages as read:', error)
    return false
  }
}

/**
 * Server Action: Get message statistics
 */
export async function getMessageStats(): Promise<MessageStats> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const stats = await apiClient.get<MessageStats>('/api/sonobrokers/messaging/stats')
    return stats
  } catch (error) {
    console.error('Failed to get message stats:', error)
    throw error
  }
}

/**
 * Server Action: Update conversation
 */
export async function updateConversation(conversationId: string, updates: { subject?: string; isActive?: boolean }): Promise<boolean> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    await apiClient.put(`/api/sonobrokers/messaging/conversations/${conversationId}`, updates)
    return true
  } catch (error) {
    console.error('Failed to update conversation:', error)
    return false
  }
}

/**
 * Server Action: Delete conversation
 */
export async function deleteConversation(conversationId: string): Promise<boolean> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    await apiClient.delete(`/api/sonobrokers/messaging/conversations/${conversationId}`)
    return true
  } catch (error) {
    console.error('Failed to delete conversation:', error)
    return false
  }
}
