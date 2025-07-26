'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import {
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
  deletePropertyImage
} from "@/lib/lib/api/properties-api"
import type {
  CreatePropertyRequest,
  UpdatePropertyRequest,
  PropertyAddress,
  PropertyStatus
} from '@/types'

/**
 * Server Actions for Property Management
 * Handles form submissions and data mutations with revalidation
 */

// Validation schemas
const createPropertySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(1, 'Price must be greater than 0'),
  propertyType: z.string().min(1, 'Property type is required'),
  bedrooms: z.number().min(0, 'Bedrooms cannot be negative'),
  bathrooms: z.number().min(0, 'Bathrooms cannot be negative'),
  sqft: z.number().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  features: z.array(z.string()).optional(),
})

const updatePropertySchema = createPropertySchema.partial().extend({
  status: z.enum(['active', 'inactive', 'sold', 'pending']).optional(),
})

// Action result types
type ActionResult<T = any> = {
  success: boolean
  data?: T
  error?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * Server Action: Create new property
 */
export async function createPropertyAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract and validate form data
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      propertyType: formData.get('propertyType') as string,
      bedrooms: Number(formData.get('bedrooms')),
      bathrooms: Number(formData.get('bathrooms')),
      sqft: formData.get('sqft') ? Number(formData.get('sqft')) : undefined,
      address: formData.get('address') as string || undefined,
      city: formData.get('city') as string || undefined,
      province: formData.get('province') as string || undefined,
      country: formData.get('country') as string || undefined,
      postalCode: formData.get('postalCode') as string || undefined,
      latitude: formData.get('latitude') ? Number(formData.get('latitude')) : undefined,
      longitude: formData.get('longitude') ? Number(formData.get('longitude')) : undefined,
      features: formData.getAll('features') as string[] || undefined,
    }

    // Validate data
    const validationResult = createPropertySchema.safeParse(rawData)
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Transform data to match CreatePropertyRequest interface
    const propertyData: CreatePropertyRequest = {
      title: validationResult.data.title!,
      description: validationResult.data.description!,
      price: validationResult.data.price!,
      propertyType: validationResult.data.propertyType!,
      listingType: 'FOR_SALE', // Default listing type
      bedrooms: validationResult.data.bedrooms!,
      bathrooms: validationResult.data.bathrooms!,
      squareFootage: validationResult.data.sqft || 0,
      address: {
        street: validationResult.data.address || '',
        city: validationResult.data.city || '',
        province: validationResult.data.province || '',
        postalCode: validationResult.data.postalCode || '',
        country: validationResult.data.country || 'CA',
        latitude: validationResult.data.latitude,
        longitude: validationResult.data.longitude
      },
      features: validationResult.data.features || []
    }

    // Create property
    const property = await createProperty(propertyData)

    // Revalidate relevant pages
    revalidatePath('/dashboard/properties')
    revalidatePath('/properties')
    revalidatePath('/')

    return {
      success: true,
      data: property,
    }
  } catch (error) {
    console.error('Failed to create property:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create property',
    }
  }
}

/**
 * Server Action: Update existing property
 */
export async function updatePropertyAction(
  propertyId: string,
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract and validate form data
    const rawData = {
      title: formData.get('title') as string || undefined,
      description: formData.get('description') as string || undefined,
      price: formData.get('price') ? Number(formData.get('price')) : undefined,
      propertyType: formData.get('propertyType') as string || undefined,
      bedrooms: formData.get('bedrooms') ? Number(formData.get('bedrooms')) : undefined,
      bathrooms: formData.get('bathrooms') ? Number(formData.get('bathrooms')) : undefined,
      sqft: formData.get('sqft') ? Number(formData.get('sqft')) : undefined,
      address: formData.get('address') as string || undefined,
      city: formData.get('city') as string || undefined,
      province: formData.get('province') as string || undefined,
      country: formData.get('country') as string || undefined,
      postalCode: formData.get('postalCode') as string || undefined,
      latitude: formData.get('latitude') ? Number(formData.get('latitude')) : undefined,
      longitude: formData.get('longitude') ? Number(formData.get('longitude')) : undefined,
      status: formData.get('status') as 'active' | 'inactive' | 'sold' | 'pending' || undefined,
      features: formData.getAll('features') as string[] || undefined,
    }

    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(rawData).filter(([_, value]) => value !== undefined)
    )

    // Validate data
    const validationResult = updatePropertySchema.safeParse(cleanData)
    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Transform data to match UpdatePropertyRequest interface
    const updateData: UpdatePropertyRequest = {
      title: validationResult.data.title,
      description: validationResult.data.description,
      price: validationResult.data.price,
      propertyType: validationResult.data.propertyType,
      listingType: 'FOR_SALE', // Default listing type
      bedrooms: validationResult.data.bedrooms,
      bathrooms: validationResult.data.bathrooms,
      squareFootage: validationResult.data.sqft,
      features: validationResult.data.features,
      status: validationResult.data.status ? validationResult.data.status.toUpperCase() as PropertyStatus : undefined
    }

    // Add address if provided
    if (validationResult.data.address || validationResult.data.city || validationResult.data.province) {
      updateData.address = {
        street: validationResult.data.address || '',
        city: validationResult.data.city || '',
        province: validationResult.data.province || '',
        postalCode: validationResult.data.postalCode || '',
        country: validationResult.data.country || 'CA',
        latitude: validationResult.data.latitude,
        longitude: validationResult.data.longitude
      }
    }

    // Update property
    const property = await updateProperty(propertyId, updateData)

    // Revalidate relevant pages
    revalidatePath('/dashboard/properties')
    revalidatePath(`/properties/${propertyId}`)
    revalidatePath('/properties')
    revalidatePath('/')

    return {
      success: true,
      data: property,
    }
  } catch (error) {
    console.error('Failed to update property:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update property',
    }
  }
}

/**
 * Server Action: Delete property
 */
export async function deletePropertyAction(propertyId: string): Promise<ActionResult> {
  try {
    await deleteProperty(propertyId)

    // Revalidate relevant pages
    revalidatePath('/dashboard/properties')
    revalidatePath('/properties')
    revalidatePath('/')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to delete property:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete property',
    }
  }
}

/**
 * Server Action: Upload property images
 */
export async function uploadPropertyImagesAction(
  propertyId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const files = formData.getAll('images') as File[]
    
    if (files.length === 0) {
      return {
        success: false,
        error: 'No images selected',
      }
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      return isValidType && isValidSize
    })

    if (validFiles.length === 0) {
      return {
        success: false,
        error: 'No valid images found. Please ensure files are images under 10MB.',
      }
    }

    const images = await uploadPropertyImages(propertyId, validFiles)

    // Revalidate relevant pages
    revalidatePath(`/properties/${propertyId}`)
    revalidatePath('/dashboard/properties')

    return {
      success: true,
      data: images,
    }
  } catch (error) {
    console.error('Failed to upload property images:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload images',
    }
  }
}

/**
 * Server Action: Delete property image
 */
export async function deletePropertyImageAction(
  propertyId: string,
  imageId: string
): Promise<ActionResult> {
  try {
    await deletePropertyImage(propertyId, imageId)

    // Revalidate relevant pages
    revalidatePath(`/properties/${propertyId}`)
    revalidatePath('/dashboard/properties')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to delete property image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete image',
    }
  }
}

/**
 * Server Action: Quick property creation with AI import
 */
export async function quickCreatePropertyAction(
  address: string
): Promise<ActionResult> {
  try {
    // This would integrate with AI property import
    // For now, redirect to create form with address pre-filled
    redirect(`/dashboard/properties/create?address=${encodeURIComponent(address)}`)
  } catch (error) {
    console.error('Failed to quick create property:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create property',
    }
  }
}

/**
 * Server Action: Bulk update property status
 */
export async function bulkUpdatePropertyStatusAction(
  propertyIds: string[],
  status: 'active' | 'inactive' | 'sold' | 'pending'
): Promise<ActionResult> {
  try {
    const results = await Promise.allSettled(
      propertyIds.map(id => updateProperty(id, { status: status.toUpperCase() as PropertyStatus }))
    )

    const successful = results.filter(result => result.status === 'fulfilled').length
    const failed = results.length - successful

    // Revalidate relevant pages
    revalidatePath('/dashboard/properties')
    revalidatePath('/properties')

    return {
      success: true,
      data: {
        successful,
        failed,
        total: results.length,
      },
    }
  } catch (error) {
    console.error('Failed to bulk update properties:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update properties',
    }
  }
}
