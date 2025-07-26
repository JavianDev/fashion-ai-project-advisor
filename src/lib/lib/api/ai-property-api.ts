import { auth } from '@clerk/nextjs/server'
import { apiClient } from "@/lib/lib/api-client"

/**
 * AI Property Services API
 * Handles AI-powered property import, valuation, and description generation
 */

// Types
export interface AIPropertyImportRequest {
  address: string
  country?: string
  includeImages?: boolean
  includeComparables?: boolean
}

export interface AIPropertyImportResponse {
  propertyDetails: {
    address: string
    city: string
    province: string
    country: string
    postalCode: string
    propertyType: string
    bedrooms: number
    bathrooms: number
    sqft: number
    lotSize?: number
    yearBuilt?: number
    features: string[]
    description: string
    estimatedValue: number
    images?: string[]
    comparables?: PropertyComparable[]
  }
  status: string
  message: string
  confidence: number
}

export interface PropertyComparable {
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  soldDate: string
  distance: number
}

export interface AIPropertyValuationRequest {
  address: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  sqft: number
  yearBuilt?: number
  features?: string[]
  country?: string
}

export interface AIPropertyValuationResponse {
  estimatedValue: number
  valueRange: {
    low: number
    high: number
  }
  confidence: number
  comparables: PropertyComparable[]
  marketTrends: {
    averagePrice: number
    priceChange: number
    daysOnMarket: number
    marketActivity: 'hot' | 'warm' | 'cool'
  }
  factors: {
    location: number
    size: number
    condition: number
    features: number
    market: number
  }
  status: string
  message: string
}

export interface GenerateDescriptionRequest {
  propertyType: string
  bedrooms: number
  bathrooms: number
  sqft: number
  features: string[]
  address?: string
  highlights?: string[]
  tone?: 'professional' | 'casual' | 'luxury' | 'family-friendly'
}

export interface GenerateDescriptionResponse {
  description: string
  shortDescription: string
  highlights: string[]
  keywords: string[]
  status: string
  message: string
}

/**
 * Server Action: Import property data using AI
 */
export async function importPropertyData(request: AIPropertyImportRequest): Promise<AIPropertyImportResponse> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.post<AIPropertyImportResponse>('/api/sonobrokers/ai/property-import', request)
    return response
  } catch (error) {
    console.error('Failed to import property data:', error)
    throw error
  }
}

/**
 * Server Action: Get property valuation using AI
 */
export async function getPropertyValuation(request: AIPropertyValuationRequest): Promise<AIPropertyValuationResponse> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.post<AIPropertyValuationResponse>('/api/sonobrokers/ai/property-valuation', request)
    return response
  } catch (error) {
    console.error('Failed to get property valuation:', error)
    throw error
  }
}

/**
 * Server Action: Generate property description using AI
 */
export async function generatePropertyDescription(request: GenerateDescriptionRequest): Promise<GenerateDescriptionResponse> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.post<GenerateDescriptionResponse>('/api/sonobrokers/ai/generate-description', request)
    return response
  } catch (error) {
    console.error('Failed to generate property description:', error)
    throw error
  }
}

/**
 * Server Action: Quick property lookup by address
 */
export async function quickPropertyLookup(address: string): Promise<AIPropertyImportResponse> {
  try {
    const request: AIPropertyImportRequest = {
      address,
      includeImages: false,
      includeComparables: true
    }

    return await importPropertyData(request)
  } catch (error) {
    console.error('Failed to perform quick property lookup:', error)
    throw error
  }
}

/**
 * Server Action: Get market analysis for area
 */
export async function getMarketAnalysis(address: string, radius: number = 1): Promise<{
  averagePrice: number
  medianPrice: number
  pricePerSqft: number
  daysOnMarket: number
  totalListings: number
  recentSales: PropertyComparable[]
  marketTrend: 'up' | 'down' | 'stable'
}> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.get(`/api/sonobrokers/ai/market-analysis?address=${encodeURIComponent(address)}&radius=${radius}`) as any
    return response.data || {
      averagePrice: 0,
      medianPrice: 0,
      pricePerSqft: 0,
      daysOnMarket: 0,
      totalListings: 0,
      recentSales: [],
      marketTrend: 'stable' as const
    }
  } catch (error) {
    console.error('Failed to get market analysis:', error)
    throw error
  }
}

/**
 * Server Action: Validate property address
 */
export async function validatePropertyAddress(address: string): Promise<{
  isValid: boolean
  standardizedAddress?: string
  suggestions?: string[]
  coordinates?: {
    latitude: number
    longitude: number
  }
}> {
  try {
    const response = await apiClient.post('/api/sonobrokers/ai/validate-address', { address }) as any
    return response.data || {
      isValid: false,
      standardizedAddress: undefined,
      suggestions: [],
      coordinates: undefined
    }
  } catch (error) {
    console.error('Failed to validate property address:', error)
    throw error
  }
}

/**
 * Server Action: Get property features suggestions
 */
export async function getPropertyFeaturesSuggestions(propertyType: string, bedrooms: number, bathrooms: number): Promise<{
  suggested: string[]
  popular: string[]
  premium: string[]
}> {
  try {
    const response = await apiClient.get(`/api/sonobrokers/ai/features-suggestions?propertyType=${propertyType}&bedrooms=${bedrooms}&bathrooms=${bathrooms}`) as any
    return response.data || {
      suggested: [],
      popular: [],
      premium: []
    }
  } catch (error) {
    console.error('Failed to get property features suggestions:', error)
    return {
      suggested: [],
      popular: [],
      premium: []
    }
  }
}

/**
 * Server Action: Generate property title suggestions
 */
export async function generatePropertyTitles(request: {
  propertyType: string
  bedrooms: number
  bathrooms: number
  city: string
  features?: string[]
  count?: number
}): Promise<string[]> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.post<{ titles: string[] }>('/api/sonobrokers/ai/generate-titles', request)
    return response.titles
  } catch (error) {
    console.error('Failed to generate property titles:', error)
    return []
  }
}
