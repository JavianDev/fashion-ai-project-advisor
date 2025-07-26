import { auth } from '@clerk/nextjs/server'
import { apiClient } from "@/lib/lib/api-client"

/**
 * Advertisers API Service
 * Handles service provider listings and management
 */

// Types
export interface Advertiser {
  id: string
  userId: string
  businessName: string
  contactName: string
  email: string
  phone: string
  website?: string
  description: string
  serviceType: ServiceType
  serviceAreas: string[]
  licenseNumber?: string
  plan: AdvertiserPlan
  status: AdvertiserStatus
  isPremium: boolean
  isVerified: boolean
  images: string[]
  rating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export type ServiceType = 
  | 'photographer'
  | 'lawyer'
  | 'inspector'
  | 'stager'
  | 'cleaner'
  | 'contractor'
  | 'realtor'
  | 'mortgage_broker'
  | 'insurance_agent'

export type AdvertiserPlan = 'basic' | 'premium'

export type AdvertiserStatus = 'active' | 'inactive' | 'pending' | 'suspended'

export interface CreateAdvertiserRequest {
  businessName: string
  contactName: string
  email: string
  phone: string
  website?: string
  description: string
  serviceType: ServiceType
  serviceAreas: string[]
  licenseNumber?: string
  plan: AdvertiserPlan
}

export interface UpdateAdvertiserRequest extends Partial<CreateAdvertiserRequest> {
  status?: AdvertiserStatus
  isPremium?: boolean
  isVerified?: boolean
}

export interface AdvertiserSearchParams {
  page?: number
  limit?: number
  serviceType?: ServiceType
  location?: string
  plan?: AdvertiserPlan
  status?: AdvertiserStatus
  isVerified?: boolean
  isPremium?: boolean
  search?: string
}

export interface AdvertiserSearchResponse {
  advertisers: Advertiser[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}

/**
 * Server Action: Get all advertisers with search and filters
 */
export async function getAdvertisers(params: AdvertiserSearchParams = {}): Promise<AdvertiserSearchResponse> {
  try {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })

    const response = await apiClient.get<AdvertiserSearchResponse>(`/api/sonobrokers/advertisers?${searchParams}`)
    return response
  } catch (error) {
    console.error('Failed to get advertisers:', error)
    throw error
  }
}

/**
 * Server Action: Get advertiser by ID
 */
export async function getAdvertiserById(id: string): Promise<Advertiser | null> {
  try {
    const advertiser = await apiClient.get<Advertiser>(`/api/sonobrokers/advertisers/${id}`)
    return advertiser
  } catch (error) {
    console.error('Failed to get advertiser:', error)
    return null
  }
}

/**
 * Server Action: Create new advertiser
 */
export async function createAdvertiser(data: CreateAdvertiserRequest): Promise<Advertiser> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const advertiser = await apiClient.post<Advertiser>('/api/sonobrokers/advertisers', data)
    return advertiser
  } catch (error) {
    console.error('Failed to create advertiser:', error)
    throw error
  }
}

/**
 * Server Action: Update advertiser
 */
export async function updateAdvertiser(id: string, data: UpdateAdvertiserRequest): Promise<Advertiser> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const advertiser = await apiClient.put<Advertiser>(`/api/sonobrokers/advertisers/${id}`, data)
    return advertiser
  } catch (error) {
    console.error('Failed to update advertiser:', error)
    throw error
  }
}

/**
 * Server Action: Delete advertiser
 */
export async function deleteAdvertiser(id: string): Promise<void> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    await apiClient.delete(`/api/sonobrokers/advertisers/${id}`)
  } catch (error) {
    console.error('Failed to delete advertiser:', error)
    throw error
  }
}

/**
 * Server Action: Get advertisers by service type
 */
export async function getAdvertisersByServiceType(serviceType: ServiceType, location?: string): Promise<Advertiser[]> {
  try {
    const params: AdvertiserSearchParams = {
      serviceType,
      status: 'active',
      limit: 50
    }

    if (location) {
      params.location = location
    }

    const response = await getAdvertisers(params)
    return response.advertisers
  } catch (error) {
    console.error('Failed to get advertisers by service type:', error)
    return []
  }
}

/**
 * Server Action: Get premium advertisers
 */
export async function getPremiumAdvertisers(serviceType?: ServiceType): Promise<Advertiser[]> {
  try {
    const params: AdvertiserSearchParams = {
      isPremium: true,
      status: 'active',
      limit: 20
    }

    if (serviceType) {
      params.serviceType = serviceType
    }

    const response = await getAdvertisers(params)
    return response.advertisers
  } catch (error) {
    console.error('Failed to get premium advertisers:', error)
    return []
  }
}

/**
 * Server Action: Get verified advertisers
 */
export async function getVerifiedAdvertisers(serviceType?: ServiceType): Promise<Advertiser[]> {
  try {
    const params: AdvertiserSearchParams = {
      isVerified: true,
      status: 'active',
      limit: 20
    }

    if (serviceType) {
      params.serviceType = serviceType
    }

    const response = await getAdvertisers(params)
    return response.advertisers
  } catch (error) {
    console.error('Failed to get verified advertisers:', error)
    return []
  }
}

/**
 * Server Action: Search advertisers
 */
export async function searchAdvertisers(query: string, filters: AdvertiserSearchParams = {}): Promise<AdvertiserSearchResponse> {
  try {
    const searchParams = {
      ...filters,
      search: query,
      status: 'active' as AdvertiserStatus
    }

    return await getAdvertisers(searchParams)
  } catch (error) {
    console.error('Failed to search advertisers:', error)
    throw error
  }
}

/**
 * Server Action: Get user's advertiser profile
 */
export async function getUserAdvertiserProfile(): Promise<Advertiser | null> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      return null
    }

    const advertiser = await apiClient.get<Advertiser>('/api/sonobrokers/advertisers/my-profile')
    return advertiser
  } catch (error) {
    console.error('Failed to get user advertiser profile:', error)
    return null
  }
}

/**
 * Server Action: Upgrade advertiser to premium
 */
export async function upgradeAdvertiserToPremium(id: string): Promise<Advertiser> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const advertiser = await apiClient.post<Advertiser>(`/api/sonobrokers/advertisers/${id}/upgrade-premium`)
    return advertiser
  } catch (error) {
    console.error('Failed to upgrade advertiser to premium:', error)
    throw error
  }
}
