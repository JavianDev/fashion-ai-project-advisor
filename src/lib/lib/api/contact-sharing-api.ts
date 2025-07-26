/**
 * Contact Sharing API Service
 * Handles buyer-seller contact sharing and property offers
 */

import { auth } from '@clerk/nextjs/server'
import { apiClient } from "@/lib/lib/api-client"
import type {
  ApiResponse,
  ContactShareResponse,
  CreateContactShareRequest,
  ContactShareSearchParams,
  ContactShareSearchResponse,
  ContactShareType,
  ContactShareStatus,
  ContactShareStats
} from '@/types'

// Legacy ContactShare interface for backward compatibility
export interface ContactShare {
  id: string
  propertyId: string
  propertyTitle: string
  propertyAddress: string
  propertyPrice: number
  buyerId: string
  buyerName: string
  buyerEmail: string
  buyerPhone?: string
  sellerId: string
  sellerName: string
  sellerEmail: string
  message?: string
  shareType: ContactShareType
  shareTypeDisplay: string
  offerAmount?: number
  schedulingPreference?: string
  preferredVisitDate?: string
  preferredVisitTime?: string
  status: ContactShareStatus
  statusDisplay: string
  createdAt: string
  updatedAt: string
  respondedAt?: string
  sellerResponse?: string
  emailSent?: boolean
  emailSentAt?: string
  expiresAt?: string
}

// Re-export enums for backward compatibility
export { ContactShareType, ContactShareStatus } from '@/types'

// Legacy interfaces - use centralized types from @/types for new code
export interface ContactShareSellerResponse {
  contactShareId: string
  status: ContactShareStatus
  response?: string
  counterOfferAmount?: number
  alternativeVisitDate?: string
  alternativeVisitTime?: string
}

// Re-export centralized types for convenience
export type {
  CreateContactShareRequest,
  ContactShareSearchParams,
  ContactShareSearchResponse,
  ContactShareStats
} from '@/types'

// Helper function to convert ContactShareResponse to legacy ContactShare format
function convertToLegacyContactShare(response: ContactShareResponse): ContactShare {
  return {
    id: response.id,
    propertyId: response.propertyId,
    propertyTitle: response.propertyTitle,
    propertyAddress: response.propertyAddress,
    propertyPrice: response.propertyPrice,
    buyerId: response.buyerId,
    buyerName: response.buyerName,
    buyerEmail: response.buyerEmail,
    buyerPhone: response.buyerPhone,
    sellerId: response.sellerId,
    sellerName: response.sellerName,
    sellerEmail: response.sellerEmail,
    message: response.message,
    shareType: response.shareType,
    shareTypeDisplay: response.shareTypeDisplay,
    offerAmount: response.offerAmount,
    schedulingPreference: response.schedulingPreference,
    preferredVisitDate: response.preferredVisitDate,
    preferredVisitTime: response.preferredVisitTime,
    status: response.status,
    statusDisplay: response.statusDisplay,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    respondedAt: undefined, // Not available in ContactShareResponse
    sellerResponse: undefined, // Not available in ContactShareResponse
    emailSent: true, // Default for legacy compatibility
    emailSentAt: response.createdAt,
    expiresAt: response.expiresAt
  }
}

// Legacy stats interface - use ContactShareStats from @/types for new code
export interface ContactSharePropertyStats {
  propertyId: string
  propertyTitle: string
  contactCount: number
  offerCount: number
  highestOffer?: number
  lastContact?: string
}

/**
 * Server Action: Create a new contact share request
 */
export async function createContactShare(request: CreateContactShareRequest): Promise<ContactShare> {
  try {
    const response = await apiClient.post<ApiResponse<ContactShareResponse>>('/api/sonobrokers/contact-sharing', request)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create contact share')
    }

    return convertToLegacyContactShare(response.data)
  } catch (error) {
    console.error('Failed to create contact share:', error)
    throw error
  }
}

/**
 * Server Action: Get contact share by ID
 */
export async function getContactShare(contactShareId: string): Promise<ContactShare | null> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.get<ApiResponse<ContactShareResponse>>(`/api/sonobrokers/contact-sharing/${contactShareId}`)

    if (!response.data) {
      return null
    }

    return convertToLegacyContactShare(response.data)
  } catch (error) {
    console.error('Failed to get contact share:', error)
    return null
  }
}

/**
 * Server Action: Get contact shares for current user
 */
export async function getContactShares(searchParams: ContactShareSearchParams = {}): Promise<ContactShareSearchResponse> {
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

    const response = await apiClient.get<ContactShareSearchResponse>(`/api/sonobrokers/contact-sharing?${queryParams}`)
    return response
  } catch (error) {
    console.error('Failed to get contact shares:', error)
    throw error
  }
}

/**
 * Server Action: Get contact shares for a property
 */
export async function getPropertyContactShares(propertyId: string, searchParams: ContactShareSearchParams = {}): Promise<ContactShareSearchResponse> {
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

    const response = await apiClient.get<ContactShareSearchResponse>(`/api/sonobrokers/contact-sharing/property/${propertyId}?${queryParams}`)
    return response
  } catch (error) {
    console.error('Failed to get property contact shares:', error)
    throw error
  }
}

/**
 * Server Action: Respond to contact share (seller)
 */
export async function respondToContactShare(contactShareId: string, response: Omit<ContactShareSellerResponse, 'contactShareId'>): Promise<boolean> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    await apiClient.put(`/api/sonobrokers/contact-sharing/${contactShareId}/respond`, response)
    return true
  } catch (error) {
    console.error('Failed to respond to contact share:', error)
    return false
  }
}

/**
 * Server Action: Get contact share statistics
 */
export async function getContactShareStats(): Promise<ContactShareStats> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const stats = await apiClient.get<ContactShareStats>('/api/sonobrokers/contact-sharing/stats')
    return stats
  } catch (error) {
    console.error('Failed to get contact share stats:', error)
    throw error
  }
}

/**
 * Server Action: Get property contact share statistics
 */
export async function getPropertyContactShareStats(propertyId: string): Promise<ContactShareStats> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const stats = await apiClient.get<ContactShareStats>(`/api/sonobrokers/contact-sharing/property/${propertyId}/stats`)
    return stats
  } catch (error) {
    console.error('Failed to get property contact share stats:', error)
    throw error
  }
}

/**
 * Server Action: Delete contact share
 */
export async function deleteContactShare(contactShareId: string): Promise<boolean> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    await apiClient.delete(`/api/sonobrokers/contact-sharing/${contactShareId}`)
    return true
  } catch (error) {
    console.error('Failed to delete contact share:', error)
    return false
  }
}
