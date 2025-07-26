// Client-safe API client - no server-only imports

/**
 * API Client for SoNoBrokers .NET Core Web API
 * Handles all HTTP requests to the backend API with authentication
 * Supports Server Components and Server Actions (App Router)
 */

// API Configuration
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7163',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
}

// Import types from central types file
import type { ApiResponse, PaginatedResponse } from '@/types'

// Legacy API Response Types for backward compatibility
export interface LegacyApiResponse<T = any> {
  data?: T
  success: boolean
  message?: string
  errors?: string[]
  statusCode?: number
}

// Error Classes
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: string[]
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

/**
 * Main API Client Class
 */
export class ApiClient {
  private baseUrl: string
  private timeout: number

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_CONFIG.baseUrl
    this.timeout = API_CONFIG.timeout
  }

  /**
   * Get authentication token (client-safe)
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      // For client-side, we'll rely on cookies/session
      // Server-side auth should use the server API client
      return null
    } catch (error) {
      console.warn('Failed to get auth token:', error)
      return null
    }
  }

  /**
   * Build request headers
   */
  private async buildHeaders(customHeaders?: Record<string, string>): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    }

    const token = await this.getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    let data: any
    try {
      data = isJson ? await response.json() : await response.text()
    } catch (error) {
      throw new NetworkError('Failed to parse response')
    }

    if (!response.ok) {
      const message = data?.message || data?.title || `HTTP ${response.status}`
      const errors = data?.errors || data?.details || []
      throw new ApiError(message, response.status, errors)
    }

    return data
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = await this.buildHeaders(options.headers as Record<string, string>)

    const requestOptions: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    }

    try {
      const response = await fetch(url, requestOptions)
      return await this.handleResponse<T>(response)
    } catch (error) {
      // Retry on network errors
      if (
        retryCount < API_CONFIG.retries &&
        (error instanceof NetworkError || 
         (error instanceof TypeError && error.message.includes('fetch')))
      ) {
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay * (retryCount + 1)))
        return this.makeRequest<T>(endpoint, options, retryCount + 1)
      }

      // Re-throw the error if retries exhausted or non-retryable error
      throw error
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, this.baseUrl)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return this.makeRequest<T>(url.pathname + url.search, {
      method: 'GET',
    })
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
    })
  }

  /**
   * Upload file
   */
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    const headers = await this.buildHeaders()
    delete (headers as any)['Content-Type'] // Let browser set content-type for FormData

    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    })
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Utility functions for common patterns
export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> => {
  try {
    return await apiCall()
  } catch (error) {
    console.error('API call failed:', error)
    if (fallback !== undefined) {
      return fallback
    }
    return undefined
  }
}

export const withRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiCall()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError!
}

// Export types for use in other files
export type { ApiResponse, PaginatedResponse } from '@/types'
