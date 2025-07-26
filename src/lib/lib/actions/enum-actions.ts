'use server'

import { apiClient } from "@/lib/lib/api-client"

/**
 * Server Actions for Enum Data
 * Handles dynamic enum fetching from the database via .NET Web API
 */

// Types
export interface CountryInfo {
  code: string
  name: string
  flag: string
  value: string
}

export interface UserTypeInfo {
  value: string
  label: string
}

export interface EnumData {
  countries: CountryInfo[]
  userTypes: UserTypeInfo[]
  serviceTypes: string[]
  propertyStatuses: string[]
  advertiserPlans: string[]
  advertiserStatuses: string[]
}

// Action result types
type ActionResult<T = any> = {
  success: boolean
  data?: T
  error?: string
}

// Cache for enum values to avoid repeated API calls
let enumCache: {
  data?: EnumData
  lastFetch?: number
} = {}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Server Action: Get all enum values from database
 */
export async function getEnumValuesAction(): Promise<ActionResult<EnumData>> {
  try {
    const now = Date.now()
    
    // Return cached data if still valid
    if (enumCache.data && enumCache.lastFetch && (now - enumCache.lastFetch) < CACHE_DURATION) {
      return {
        success: true,
        data: enumCache.data,
      }
    }

    // Fetch from API
    const response = await apiClient.get<{ enums: any }>('/api/sonobrokers/enums')
    
    // Transform the response to match expected format
    const enumData: EnumData = {
      countries: response.enums.countries || [],
      userTypes: response.enums.userTypes || [],
      serviceTypes: response.enums.serviceTypes || [],
      propertyStatuses: response.enums.propertyStatuses || [],
      advertiserPlans: response.enums.advertiserPlans || [],
      advertiserStatuses: response.enums.advertiserStatuses || [],
    }

    // Update cache
    enumCache.data = enumData
    enumCache.lastFetch = now

    return {
      success: true,
      data: enumData,
    }
  } catch (error) {
    console.error('Failed to fetch enum values:', error)
    
    // Return fallback values when API is unavailable
    const fallbackData: EnumData = {
      countries: [
        { code: 'CA', name: 'Canada', flag: '🇨🇦', value: 'ca' },
        { code: 'US', name: 'United States', flag: '🇺🇸', value: 'us' },
        { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', value: 'uae' },
      ],
      userTypes: [
        { value: 'Buyer', label: 'Buyer' },
        { value: 'Seller', label: 'Seller' },
      ],
      serviceTypes: ['photographer', 'lawyer', 'inspector', 'stager', 'cleaner', 'contractor'],
      propertyStatuses: ['pending', 'active', 'sold', 'expired'],
      advertiserPlans: ['basic', 'premium'],
      advertiserStatuses: ['pending', 'active', 'suspended', 'cancelled'],
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch enum values',
      data: fallbackData,
    }
  }
}

/**
 * Server Action: Get countries from database
 */
export async function getCountriesAction(): Promise<ActionResult<CountryInfo[]>> {
  try {
    const enumResult = await getEnumValuesAction()
    
    if (!enumResult.success || !enumResult.data) {
      return {
        success: false,
        error: 'Failed to fetch countries',
      }
    }

    return {
      success: true,
      data: enumResult.data.countries,
    }
  } catch (error) {
    console.error('Failed to fetch countries:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch countries',
    }
  }
}

/**
 * Server Action: Get user types from database
 */
export async function getUserTypesAction(): Promise<ActionResult<UserTypeInfo[]>> {
  try {
    const enumResult = await getEnumValuesAction()
    
    if (!enumResult.success || !enumResult.data) {
      return {
        success: false,
        error: 'Failed to fetch user types',
      }
    }

    return {
      success: true,
      data: enumResult.data.userTypes,
    }
  } catch (error) {
    console.error('Failed to fetch user types:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user types',
    }
  }
}

/**
 * Clear enum cache (useful for testing or when data changes)
 */
export async function clearEnumCacheAction(): Promise<ActionResult> {
  try {
    enumCache = {}
    
    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to clear enum cache:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear cache',
    }
  }
}
