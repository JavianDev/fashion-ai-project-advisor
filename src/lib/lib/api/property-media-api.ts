/**
 * Property Media API Service
 * Handles all property media-related API calls (images and videos) to the .NET Web API
 */

import { apiClient } from "@/lib/lib/api-client"
import type {
  ApiResponse,
  PropertyMedia,
  PropertyImage,
  UploadMediaRequest,
  UpdateMediaRequest,
  ReorderMediaRequest
} from '@/types'

/**
 * Get all media for a property (images and videos)
 */
export async function getPropertyMedia(propertyId: string): Promise<PropertyMedia[]> {
  try {
    const response = await apiClient.get<ApiResponse<PropertyMedia[]>>(`/api/sonobrokers/property-media/property/${propertyId}`)
    if (!response.success || !response.data) {
      return []
    }
    return response.data
  } catch (error) {
    console.error('Failed to get property media:', error)
    return []
  }
}

/**
 * Get only images for a property
 */
export async function getPropertyImages(propertyId: string): Promise<PropertyMedia[]> {
  try {
    const response = await apiClient.get<ApiResponse<PropertyMedia[]>>(`/api/sonobrokers/property-media/property/${propertyId}/images`)
    if (!response.success || !response.data) {
      return []
    }
    return response.data
  } catch (error) {
    console.error('Failed to get property images:', error)
    return []
  }
}

/**
 * Get only videos for a property
 */
export async function getPropertyVideos(propertyId: string): Promise<PropertyMedia[]> {
  try {
    const response = await apiClient.get<ApiResponse<PropertyMedia[]>>(`/api/sonobrokers/property-media/property/${propertyId}/videos`)
    if (!response.success || !response.data) {
      return []
    }
    return response.data
  } catch (error) {
    console.error('Failed to get property videos:', error)
    return []
  }
}

/**
 * Get media by ID
 */
export async function getPropertyMediaById(id: string): Promise<PropertyMedia | null> {
  try {
    const response = await apiClient.get<ApiResponse<PropertyMedia>>(`/api/sonobrokers/property-media/${id}`)
    if (!response.success || !response.data) {
      return null
    }
    return response.data
  } catch (error) {
    console.error('Failed to get property media by ID:', error)
    return null
  }
}

/**
 * Upload media files (images and videos)
 */
export async function uploadPropertyMedia(propertyId: string, files: File[]): Promise<PropertyMedia[]> {
  try {
    // For multiple files, we'll upload them one by one
    const uploadedMedia: PropertyMedia[] = []

    for (const file of files) {
      const response = await apiClient.upload<ApiResponse<PropertyMedia>>(
        `/api/sonobrokers/property-media/property/${propertyId}/upload`,
        file
      )

      if (response.success && response.data) {
        uploadedMedia.push(response.data)
      }
    }

    return uploadedMedia
  } catch (error) {
    console.error('Failed to upload property media:', error)
    throw error
  }
}

/**
 * Update media details
 */
export async function updatePropertyMedia(data: UpdateMediaRequest): Promise<PropertyMedia> {
  try {
    const response = await apiClient.put<ApiResponse<PropertyMedia>>(`/api/sonobrokers/property-media/${data.id}`, data)
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update media')
    }
    return response.data
  } catch (error) {
    console.error('Failed to update property media:', error)
    throw error
  }
}

/**
 * Delete media file
 */
export async function deletePropertyMedia(id: string): Promise<void> {
  try {
    const response = await apiClient.delete<ApiResponse<void>>(`/api/sonobrokers/property-media/${id}`)
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete media')
    }
  } catch (error) {
    console.error('Failed to delete property media:', error)
    throw error
  }
}

/**
 * Set primary media (image or video)
 */
export async function setPrimaryMedia(propertyId: string, mediaId: string): Promise<void> {
  try {
    const response = await apiClient.put<ApiResponse<void>>(`/api/sonobrokers/property-media/${propertyId}/primary/${mediaId}`)
    if (!response.success) {
      throw new Error(response.message || 'Failed to set primary media')
    }
  } catch (error) {
    console.error('Failed to set primary media:', error)
    throw error
  }
}

/**
 * Reorder media files
 */
export async function reorderPropertyMedia(data: ReorderMediaRequest): Promise<void> {
  try {
    const response = await apiClient.put<ApiResponse<void>>(`/api/sonobrokers/property-media/property/${data.propertyId}/reorder`, {
      mediaIds: data.mediaIds
    })
    if (!response.success) {
      throw new Error(response.message || 'Failed to reorder media')
    }
  } catch (error) {
    console.error('Failed to reorder property media:', error)
    throw error
  }
}

/**
 * Get primary media for a property
 */
export async function getPrimaryMedia(propertyId: string): Promise<PropertyMedia | null> {
  try {
    const allMedia = await getPropertyMedia(propertyId)
    return allMedia.find(media => media.isPrimary) || null
  } catch (error) {
    console.error('Failed to get primary media:', error)
    return null
  }
}

// Backward compatibility functions that convert PropertyMedia to PropertyImage format
export async function getPropertyImagesAsPropertyImage(propertyId: string): Promise<PropertyImage[]> {
  try {
    const mediaItems = await getPropertyImages(propertyId)
    return mediaItems.map(convertMediaToPropertyImage)
  } catch (error) {
    console.error('Failed to get property images (legacy format):', error)
    return []
  }
}

export async function uploadPropertyImagesCompat(propertyId: string, files: File[]): Promise<PropertyImage[]> {
  try {
    const mediaItems = await uploadPropertyMedia(propertyId, files)
    return mediaItems.filter(media => media.mediaType === 'image' || !media.isVideo).map(convertMediaToPropertyImage)
  } catch (error) {
    console.error('Failed to upload property images (legacy format):', error)
    throw error
  }
}

// Helper function to convert PropertyMedia to PropertyImage for backward compatibility
function convertMediaToPropertyImage(media: PropertyMedia): PropertyImage {
  return {
    id: media.id,
    propertyId: media.propertyId,
    imageUrl: media.mediaUrl,
    displayOrder: media.displayOrder,
    caption: media.altText,
    createdAt: media.createdAt
  }
}
