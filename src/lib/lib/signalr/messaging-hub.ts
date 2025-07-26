'use client'

import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useAuth } from '@clerk/nextjs'

/**
 * SignalR Messaging Hub Client
 * Handles real-time messaging functionality
 */

export interface MessageNotification {
  messageId: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  propertyId?: string
  propertyTitle?: string
  createdAt: string
  recipientIds: string[]
}

export interface TypingIndicator {
  conversationId: string
  userId: string
  userName: string
  isTyping: boolean
  timestamp: string
}

export class MessagingHubClient {
  private connection: HubConnection | null = null
  private isConnected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  // Event handlers
  private onMessageReceived?: (notification: MessageNotification) => void
  private onTypingIndicator?: (indicator: TypingIndicator) => void
  private onUserOnline?: (userId: string) => void
  private onUserOffline?: (userId: string) => void
  private onMessagesRead?: (data: { conversationId: string; userId: string; messageIds?: string[] }) => void
  private onConversationUpdated?: (update: any) => void
  private onError?: (error: string) => void

  constructor() {
    this.setupConnection()
  }

  private async setupConnection() {
    try {
      // Get auth token
      const token = await this.getAuthToken()
      if (!token) {
        console.warn('No auth token available for SignalR connection')
        return
      }

      this.connection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/messaginghub`, {
          accessTokenFactory: () => token
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount < this.maxReconnectAttempts) {
              return this.reconnectDelay * Math.pow(2, retryContext.previousRetryCount)
            }
            return null // Stop reconnecting
          }
        })
        .configureLogging(LogLevel.Information)
        .build()

      this.setupEventHandlers()
    } catch (error) {
      console.error('Error setting up SignalR connection:', error)
    }
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      // Client-side only - use window.Clerk
      if (typeof window !== 'undefined' && (window as any).Clerk) {
        const session = (window as any).Clerk.session
        if (session) {
          return await session.getToken()
        }
      }
      return null
    } catch (error) {
      console.error('Error getting auth token:', error)
      return null
    }
  }

  private setupEventHandlers() {
    if (!this.connection) return

    // Connection events
    this.connection.onclose((error) => {
      this.isConnected = false
      console.log('SignalR connection closed:', error)
    })

    this.connection.onreconnecting((error) => {
      console.log('SignalR reconnecting:', error)
    })

    this.connection.onreconnected((connectionId) => {
      this.isConnected = true
      this.reconnectAttempts = 0
      console.log('SignalR reconnected:', connectionId)
    })

    // Message events
    this.connection.on('NewMessage', (notification: MessageNotification) => {
      this.onMessageReceived?.(notification)
    })

    this.connection.on('MessageNotification', (notification: MessageNotification) => {
      this.onMessageReceived?.(notification)
    })

    this.connection.on('TypingIndicator', (indicator: TypingIndicator) => {
      this.onTypingIndicator?.(indicator)
    })

    this.connection.on('MessagesRead', (data: { conversationId: string; userId: string; messageIds?: string[] }) => {
      this.onMessagesRead?.(data)
    })

    this.connection.on('ConversationUpdated', (update: any) => {
      this.onConversationUpdated?.(update)
    })

    // User presence events
    this.connection.on('UserOnline', (userId: string) => {
      this.onUserOnline?.(userId)
    })

    this.connection.on('UserOffline', (userId: string) => {
      this.onUserOffline?.(userId)
    })

    // Error events
    this.connection.on('Error', (error: string) => {
      this.onError?.(error)
    })

    // Connection status events
    this.connection.on('JoinedConversation', (conversationId: string) => {
      console.log('Joined conversation:', conversationId)
    })

    this.connection.on('LeftConversation', (conversationId: string) => {
      console.log('Left conversation:', conversationId)
    })

    this.connection.on('MessagesMarkedAsRead', (conversationId: string) => {
      console.log('Messages marked as read:', conversationId)
    })

    this.connection.on('OnlineUsers', (users: string[]) => {
      console.log('Online users:', users)
    })
  }

  async connect(): Promise<boolean> {
    if (!this.connection || this.isConnected) {
      return this.isConnected
    }

    try {
      await this.connection.start()
      this.isConnected = true
      console.log('SignalR connected successfully')
      return true
    } catch (error) {
      console.error('Error connecting to SignalR:', error)
      this.isConnected = false
      return false
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.stop()
        this.isConnected = false
        console.log('SignalR disconnected')
      } catch (error) {
        console.error('Error disconnecting from SignalR:', error)
      }
    }
  }

  async joinConversation(conversationId: string): Promise<void> {
    if (!this.isConnected || !this.connection) {
      console.warn('SignalR not connected')
      return
    }

    try {
      await this.connection.invoke('JoinConversation', conversationId)
    } catch (error) {
      console.error('Error joining conversation:', error)
    }
  }

  async leaveConversation(conversationId: string): Promise<void> {
    if (!this.isConnected || !this.connection) {
      return
    }

    try {
      await this.connection.invoke('LeaveConversation', conversationId)
    } catch (error) {
      console.error('Error leaving conversation:', error)
    }
  }

  async sendTypingIndicator(conversationId: string, isTyping: boolean): Promise<void> {
    if (!this.isConnected || !this.connection) {
      return
    }

    try {
      await this.connection.invoke('SendTypingIndicator', conversationId, isTyping)
    } catch (error) {
      console.error('Error sending typing indicator:', error)
    }
  }

  async markMessagesAsRead(conversationId: string, messageIds?: string[]): Promise<void> {
    if (!this.isConnected || !this.connection) {
      return
    }

    try {
      await this.connection.invoke('MarkMessagesAsRead', conversationId, messageIds)
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  async getOnlineUsers(): Promise<void> {
    if (!this.isConnected || !this.connection) {
      return
    }

    try {
      await this.connection.invoke('GetOnlineUsers')
    } catch (error) {
      console.error('Error getting online users:', error)
    }
  }

  // Event handler setters
  setOnMessageReceived(handler: (notification: MessageNotification) => void) {
    this.onMessageReceived = handler
  }

  setOnTypingIndicator(handler: (indicator: TypingIndicator) => void) {
    this.onTypingIndicator = handler
  }

  setOnUserOnline(handler: (userId: string) => void) {
    this.onUserOnline = handler
  }

  setOnUserOffline(handler: (userId: string) => void) {
    this.onUserOffline = handler
  }

  setOnMessagesRead(handler: (data: { conversationId: string; userId: string; messageIds?: string[] }) => void) {
    this.onMessagesRead = handler
  }

  setOnConversationUpdated(handler: (update: any) => void) {
    this.onConversationUpdated = handler
  }

  setOnError(handler: (error: string) => void) {
    this.onError = handler
  }

  // Getters
  get connected(): boolean {
    return this.isConnected
  }

  get connectionState(): string {
    return this.connection?.state || 'Disconnected'
  }
}

// Singleton instance
let messagingHubClient: MessagingHubClient | null = null

export function getMessagingHubClient(): MessagingHubClient {
  if (!messagingHubClient) {
    messagingHubClient = new MessagingHubClient()
  }
  return messagingHubClient
}

// React hook for using the messaging hub
export function useMessagingHub() {
  const client = getMessagingHubClient()

  return {
    client,
    connect: () => client.connect(),
    disconnect: () => client.disconnect(),
    joinConversation: (conversationId: string) => client.joinConversation(conversationId),
    leaveConversation: (conversationId: string) => client.leaveConversation(conversationId),
    sendTypingIndicator: (conversationId: string, isTyping: boolean) => 
      client.sendTypingIndicator(conversationId, isTyping),
    markMessagesAsRead: (conversationId: string, messageIds?: string[]) => 
      client.markMessagesAsRead(conversationId, messageIds),
    getOnlineUsers: () => client.getOnlineUsers(),
    connected: client.connected,
    connectionState: client.connectionState
  }
}
