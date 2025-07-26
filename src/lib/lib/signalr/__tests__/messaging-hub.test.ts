import { MessagingHubClient, getMessagingHubClient } from '../messaging-hub'

// Mock SignalR
jest.mock('@microsoft/signalr', () => ({
  HubConnectionBuilder: jest.fn().mockImplementation(() => ({
    withUrl: jest.fn().mockReturnThis(),
    withAutomaticReconnect: jest.fn().mockReturnThis(),
    configureLogging: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
      invoke: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
      onclose: jest.fn(),
      onreconnecting: jest.fn(),
      onreconnected: jest.fn(),
      state: 'Connected'
    })
  })),
  LogLevel: {
    Information: 'Information'
  }
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn().mockReturnValue({
    getToken: jest.fn().mockResolvedValue('mock-token')
  })
}))

// Mock window.Clerk
Object.defineProperty(window, 'Clerk', {
  value: {
    session: {
      getToken: jest.fn().mockResolvedValue('mock-token')
    }
  },
  writable: true
})

describe('MessagingHubClient', () => {
  let client: MessagingHubClient

  beforeEach(() => {
    client = new MessagingHubClient()
    jest.clearAllMocks()
  })

  afterEach(() => {
    client.disconnect()
  })

  describe('Connection Management', () => {
    it('should initialize with disconnected state', () => {
      expect(client.connected).toBe(false)
      expect(client.connectionState).toBe('Disconnected')
    })

    it('should connect successfully', async () => {
      const result = await client.connect()
      expect(result).toBe(true)
    })

    it('should disconnect successfully', async () => {
      await client.connect()
      await client.disconnect()
      expect(client.connected).toBe(false)
    })

    it('should handle connection errors gracefully', async () => {
      // Mock connection failure
      const mockConnection = {
        start: jest.fn().mockRejectedValue(new Error('Connection failed')),
        stop: jest.fn().mockResolvedValue(undefined),
        invoke: jest.fn(),
        on: jest.fn(),
        onclose: jest.fn(),
        onreconnecting: jest.fn(),
        onreconnected: jest.fn(),
        state: 'Disconnected'
      }

      // Override the connection
      ;(client as any).connection = mockConnection

      const result = await client.connect()
      expect(result).toBe(false)
      expect(client.connected).toBe(false)
    })
  })

  describe('Conversation Management', () => {
    beforeEach(async () => {
      await client.connect()
    })

    it('should join conversation successfully', async () => {
      const conversationId = 'test-conversation-123'
      
      await client.joinConversation(conversationId)
      
      // Verify invoke was called with correct parameters
      const mockConnection = (client as any).connection
      expect(mockConnection.invoke).toHaveBeenCalledWith('JoinConversation', conversationId)
    })

    it('should leave conversation successfully', async () => {
      const conversationId = 'test-conversation-123'
      
      await client.leaveConversation(conversationId)
      
      const mockConnection = (client as any).connection
      expect(mockConnection.invoke).toHaveBeenCalledWith('LeaveConversation', conversationId)
    })

    it('should not join conversation when disconnected', async () => {
      await client.disconnect()
      const conversationId = 'test-conversation-123'
      
      // Should not throw error
      await client.joinConversation(conversationId)
      
      // Verify invoke was not called
      const mockConnection = (client as any).connection
      expect(mockConnection.invoke).not.toHaveBeenCalled()
    })
  })

  describe('Messaging Features', () => {
    beforeEach(async () => {
      await client.connect()
    })

    it('should send typing indicator', async () => {
      const conversationId = 'test-conversation-123'
      const isTyping = true
      
      await client.sendTypingIndicator(conversationId, isTyping)
      
      const mockConnection = (client as any).connection
      expect(mockConnection.invoke).toHaveBeenCalledWith('SendTypingIndicator', conversationId, isTyping)
    })

    it('should mark messages as read', async () => {
      const conversationId = 'test-conversation-123'
      const messageIds = ['msg-1', 'msg-2']
      
      await client.markMessagesAsRead(conversationId, messageIds)
      
      const mockConnection = (client as any).connection
      expect(mockConnection.invoke).toHaveBeenCalledWith('MarkMessagesAsRead', conversationId, messageIds)
    })

    it('should get online users', async () => {
      await client.getOnlineUsers()
      
      const mockConnection = (client as any).connection
      expect(mockConnection.invoke).toHaveBeenCalledWith('GetOnlineUsers')
    })
  })

  describe('Event Handlers', () => {
    it('should set message received handler', () => {
      const handler = jest.fn()
      client.setOnMessageReceived(handler)
      
      expect((client as any).onMessageReceived).toBe(handler)
    })

    it('should set typing indicator handler', () => {
      const handler = jest.fn()
      client.setOnTypingIndicator(handler)
      
      expect((client as any).onTypingIndicator).toBe(handler)
    })

    it('should set user online handler', () => {
      const handler = jest.fn()
      client.setOnUserOnline(handler)
      
      expect((client as any).onUserOnline).toBe(handler)
    })

    it('should set user offline handler', () => {
      const handler = jest.fn()
      client.setOnUserOffline(handler)
      
      expect((client as any).onUserOffline).toBe(handler)
    })

    it('should set messages read handler', () => {
      const handler = jest.fn()
      client.setOnMessagesRead(handler)
      
      expect((client as any).onMessagesRead).toBe(handler)
    })

    it('should set conversation updated handler', () => {
      const handler = jest.fn()
      client.setOnConversationUpdated(handler)
      
      expect((client as any).onConversationUpdated).toBe(handler)
    })

    it('should set error handler', () => {
      const handler = jest.fn()
      client.setOnError(handler)
      
      expect((client as any).onError).toBe(handler)
    })
  })

  describe('Authentication', () => {
    it('should get auth token from Clerk', async () => {
      const token = await (client as any).getAuthToken()
      expect(token).toBe('mock-token')
    })

    it('should handle missing auth token', async () => {
      // Mock no token available
      window.Clerk = undefined as any
      
      const token = await (client as any).getAuthToken()
      expect(token).toBeNull()
    })
  })
})

describe('getMessagingHubClient', () => {
  it('should return singleton instance', () => {
    const client1 = getMessagingHubClient()
    const client2 = getMessagingHubClient()
    
    expect(client1).toBe(client2)
  })

  it('should create new instance on first call', () => {
    const client = getMessagingHubClient()
    expect(client).toBeInstanceOf(MessagingHubClient)
  })
})

describe('Error Handling', () => {
  let client: MessagingHubClient

  beforeEach(() => {
    client = new MessagingHubClient()
  })

  afterEach(() => {
    client.disconnect()
  })

  it('should handle connection setup errors', () => {
    // Mock HubConnectionBuilder to throw error
    const originalConsoleError = console.error
    console.error = jest.fn()

    // This should not throw
    expect(() => new MessagingHubClient()).not.toThrow()

    console.error = originalConsoleError
  })

  it('should handle invoke errors gracefully', async () => {
    const mockConnection = {
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
      invoke: jest.fn().mockRejectedValue(new Error('Invoke failed')),
      on: jest.fn(),
      onclose: jest.fn(),
      onreconnecting: jest.fn(),
      onreconnected: jest.fn(),
      state: 'Connected'
    }

    ;(client as any).connection = mockConnection
    ;(client as any).isConnected = true

    const originalConsoleError = console.error
    console.error = jest.fn()

    // Should not throw
    await client.joinConversation('test-conversation')
    await client.sendTypingIndicator('test-conversation', true)
    await client.markMessagesAsRead('test-conversation')

    console.error = originalConsoleError
  })
})
