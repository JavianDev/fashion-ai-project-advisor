/**
 * Properties API Service
 * Handles all property-related API calls to the .NET Web API
 */

import { auth } from '@clerk/nextjs/server'
import { apiClient } from "@/lib/lib/api-client"
import type {
  ApiResponse,
  PropertyResponse,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  PropertySearchParams,
  PropertyImage
} from '@/types'

// Legacy Property interface for backward compatibility
export interface Property {
  id: string
  title: string
  description: string
  price: number
  propertyType: string
  bedrooms: number
  bathrooms: number
  sqft?: number
  squareFootage?: number
  address?: string
  city?: string
  province?: string
  state?: string
  country?: string
  postalCode?: string
  zip_code?: string
  latitude?: number
  longitude?: number
  coordinates?: { lat: number; lng: number }
  sellerId: string
  sellerName?: string
  status: 'active' | 'inactive' | 'sold' | 'pending'
  images?: string[] | { url: string; storagePath: string }[]
  features?: string[]
  createdAt: string
  updatedAt: string
  expiresAt?: string
  seller?: { full_name: string }
}

// Legacy interfaces for backward compatibility
export interface LegacyPropertySearchResponse {
  properties: Property[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}

/**
 * Server Action: Get all properties with search and filters
 */
export async function getProperties(params: PropertySearchParams = {}): Promise<LegacyPropertySearchResponse> {
  try {
    const response = await apiClient.get<ApiResponse<{ properties: PropertyResponse[]; total: number }>>('/api/sonobrokers/properties/search', params)

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get properties')
    }

    // Convert to legacy format
    return {
      properties: response.data.properties.map(convertToLegacyProperty),
      total: response.data.total,
      page: params.page || 1,
      totalPages: Math.ceil(response.data.total / (params.pageSize || 20)),
      hasMore: (params.page || 1) * (params.pageSize || 20) < response.data.total
    }
  } catch (error) {
    console.error('Failed to get properties:', error)
    throw error
  }
}

// Helper function to convert PropertyResponse to legacy Property format
function convertToLegacyProperty(property: PropertyResponse): Property {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    price: property.price,
    propertyType: property.propertyType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    sqft: property.squareFootage,
    squareFootage: property.squareFootage,
    address: property.address.street,
    city: property.address.city,
    province: property.address.province,
    state: property.address.province, // Map province to state for compatibility
    country: property.address.country,
    postalCode: property.address.postalCode,
    zip_code: property.address.postalCode, // Map postalCode to zip_code for compatibility
    latitude: property.address.latitude,
    longitude: property.address.longitude,
    coordinates: property.address.latitude && property.address.longitude ? {
      lat: property.address.latitude,
      lng: property.address.longitude
    } : undefined,
    sellerId: property.sellerId,
    sellerName: property.sellerName,
    seller: { full_name: property.sellerName },
    status: property.status.toLowerCase() as 'active' | 'inactive' | 'sold' | 'pending',
    images: property.images.map(img => img.imageUrl),
    features: property.features,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt
  }
}

/**
 * Server Action: Get property by ID
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const response = await apiClient.get<ApiResponse<PropertyResponse>>(`/api/sonobrokers/properties/${id}`)
    if (!response.success || !response.data) {
      return null
    }
    return convertToLegacyProperty(response.data)
  } catch (error) {
    console.error('Failed to get property:', error)
    return null
  }
}

/**
 * Server Action: Create new property
 */
export async function createProperty(data: CreatePropertyRequest): Promise<Property> {
  try {
    const response = await apiClient.post<ApiResponse<PropertyResponse>>('/api/sonobrokers/properties', data)
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create property')
    }
    return convertToLegacyProperty(response.data)
  } catch (error) {
    console.error('Failed to create property:', error)
    throw error
  }
}

/**
 * Server Action: Save property as draft
 */
export async function savePropertyDraft(data: CreatePropertyRequest): Promise<PropertyResponse> {
  try {
    const response = await apiClient.post<ApiResponse<PropertyResponse>>('/api/sonobrokers/properties/draft', data)
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to save property draft')
    }

    return response.data
  } catch (error) {
    console.error('Error saving property draft:', error)
    throw error
  }
}

/**
 * Server Action: Update property draft
 */
export async function updatePropertyDraft(propertyId: string, data: Partial<CreatePropertyRequest>): Promise<PropertyResponse> {
  try {
    const response = await apiClient.put<ApiResponse<PropertyResponse>>(`/api/sonobrokers/properties/${propertyId}/draft`, data)
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update property draft')
    }

    return response.data
  } catch (error) {
    console.error('Error updating property draft:', error)
    throw error
  }
}

/**
 * Server Action: Get draft properties for current user
 */
export async function getDraftProperties(): Promise<PropertyResponse[]> {
  try {
    const response = await apiClient.get<ApiResponse<PropertyResponse[]>>('/api/sonobrokers/properties/drafts')
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get draft properties')
    }

    return response.data
  } catch (error) {
    console.error('Error getting draft properties:', error)
    throw error
  }
}

/**
 * Server Action: Get published properties for current user
 */
export async function getPublishedProperties(): Promise<PropertyResponse[]> {
  try {
    const response = await apiClient.get<ApiResponse<PropertyResponse[]>>('/api/sonobrokers/properties/published')
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get published properties')
    }

    return response.data
  } catch (error) {
    console.error('Error getting published properties:', error)
    throw error
  }
}

/**
 * Server Action: Update property
 */
export async function updateProperty(id: string, data: UpdatePropertyRequest): Promise<Property> {
  try {
    const response = await apiClient.put<ApiResponse<PropertyResponse>>(`/api/sonobrokers/properties/${id}`, data)
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update property')
    }
    return convertToLegacyProperty(response.data)
  } catch (error) {
    console.error('Failed to update property:', error)
    throw error
  }
}

/**
 * Server Action: Delete property
 */
export async function deleteProperty(id: string): Promise<void> {
  try {
    const response = await apiClient.delete<ApiResponse<void>>(`/api/sonobrokers/properties/${id}`)
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete property')
    }
  } catch (error) {
    console.error('Failed to delete property:', error)
    throw error
  }
}

/**
 * Server Action: Get properties by seller
 */
export async function getPropertiesBySeller(sellerId?: string): Promise<Property[]> {
  try {
    if (sellerId) {
      const response = await apiClient.get<ApiResponse<PropertyResponse[]>>(`/api/sonobrokers/properties/user/${sellerId}`)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to get seller properties')
      }
      return response.data.map(convertToLegacyProperty)
    } else {
      const response = await apiClient.get<ApiResponse<PropertyResponse[]>>('/api/sonobrokers/properties/my-properties')
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to get my properties')
      }
      return response.data.map(convertToLegacyProperty)
    }
  } catch (error) {
    console.error('Failed to get seller properties:', error)
    throw error
  }
}

/**
 * Server Action: Search properties
 */
export async function searchProperties(query: string, filters: PropertySearchParams = {}): Promise<LegacyPropertySearchResponse> {
  try {
    const searchParams = {
      ...filters,
      searchTerm: query
    }

    return await getProperties(searchParams)
  } catch (error) {
    console.error('Failed to search properties:', error)
    throw error
  }
}

/**
 * Server Action: Get property images (backward compatibility)
 * Now uses PropertyMedia API and converts to PropertyImage format
 */
export async function getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
  try {
    // Use the new PropertyMedia API
    const { getPropertyImagesAsPropertyImage } = await import('./property-media-api')
    return await getPropertyImagesAsPropertyImage(propertyId)
  } catch (error) {
    console.error('Failed to get property images:', error)
    return []
  }
}

/**
 * Server Action: Upload property images (backward compatibility)
 * Now uses PropertyMedia API and converts to PropertyImage format
 */
export async function uploadPropertyImages(propertyId: string, files: File[]): Promise<PropertyImage[]> {
  try {
    // Use the new PropertyMedia API
    const { uploadPropertyImagesCompat } = await import('./property-media-api')
    return await uploadPropertyImagesCompat(propertyId, files)
  } catch (error) {
    console.error('Failed to upload property images:', error)
    throw error
  }
}

/**
 * Server Action: Delete property image (backward compatibility)
 * Now uses PropertyMedia API
 */
export async function deletePropertyImage(propertyId: string, imageId: string): Promise<void> {
  try {
    // Use the new PropertyMedia API
    const { deletePropertyMedia } = await import('./property-media-api')
    return await deletePropertyMedia(imageId)
  } catch (error) {
    console.error('Failed to delete property image:', error)
    throw error
  }
}

/**
 * Server Action: Publish property after payment
 */
export async function publishProperty(propertyId: string, paymentSessionId: string): Promise<void> {
  try {
    const response = await apiClient.put<ApiResponse<string>>(`/api/sonobrokers/properties/${propertyId}/publish`, {
      paymentSessionId
    })
    if (!response.success) {
      throw new Error(response.message || 'Failed to publish property')
    }
  } catch (error) {
    console.error('Failed to publish property:', error)
    throw error
  }
}

/**
 * Server Action: Get featured properties
 */
export async function getFeaturedProperties(limit: number = 6): Promise<Property[]> {
  try {
    const response = await apiClient.get<ApiResponse<PropertyResponse[]>>('/api/sonobrokers/properties/featured', { limit })
    if (!response.success || !response.data) {
      return []
    }
    return response.data.map(convertToLegacyProperty)
  } catch (error) {
    console.error('Failed to get featured properties:', error)
    return []
  }
}
