/**
 * Server-only API Client for SoNoBrokers .NET Core Web API
 * This file is only used on the server-side and can safely import server-only modules
 */

import { auth } from '@clerk/nextjs/server'
import type { ApiResponse, PaginatedResponse } from '@/types'

// API Configuration
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7163',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
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
 * Server-only API Client Class
 */
export class ServerApiClient {
  private baseUrl: string
  private timeout: number

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_CONFIG.baseUrl
    this.timeout = API_CONFIG.timeout
  }

  /**
   * Get authentication token from Clerk (server-side only)
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      const { getToken } = await auth()
      return await getToken()
    } catch (error) {
      console.warn('Failed to get auth token:', error)
      return null
    }
  }

  /**
   * Get request headers with authentication
   */
  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const token = await this.getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const fullUrl = `${this.baseUrl}${url}`
    const headers = await this.getHeaders()

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    }

    let lastError: Error | null = null

    for (let attempt = 1; attempt <= API_CONFIG.retries; attempt++) {
      try {
        const response = await fetch(fullUrl, requestOptions)

        if (!response.ok) {
          const errorText = await response.text()
          let errorData: any = {}
          
          try {
            errorData = JSON.parse(errorText)
          } catch {
            errorData = { message: errorText }
          }

          throw new ApiError(
            errorData.message || `HTTP ${response.status}`,
            response.status,
            errorData.errors
          )
        }

        const data = await response.json()
        return data
      } catch (error) {
        lastError = error as Error
        
        if (error instanceof ApiError) {
          throw error
        }

        if (attempt < API_CONFIG.retries) {
          await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay * attempt))
          continue
        }
      }
    }

    throw new NetworkError(lastError?.message || 'Network request failed')
  }

  /**
   * GET request
   */
  async get<T>(url: string): Promise<T> {
    return this.makeRequest<T>(url, { method: 'GET' })
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any): Promise<T> {
    return this.makeRequest<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any): Promise<T> {
    return this.makeRequest<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string): Promise<T> {
    return this.makeRequest<T>(url, { method: 'DELETE' })
  }

  /**
   * POST request with FormData (for file uploads)
   */
  async postFormData<T>(url: string, formData: FormData): Promise<T> {
    const fullUrl = `${this.baseUrl}${url}`
    const token = await this.getAuthToken()
    
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: formData,
      signal: AbortSignal.timeout(this.timeout),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData: any = {}
      
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }

      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData.errors
      )
    }

    return response.json()
  }
}

// Export singleton instance
export const serverApiClient = new ServerApiClient()
