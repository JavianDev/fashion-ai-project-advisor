/**
 * SoNoBrokers API Services
 * Centralized exports for all API services using Server Components and Server Actions
 */

// Authentication API (Updated for Core controllers)
export * from './auth-api'

// User API (Unified - replaces both user-api and users-api)
export * from './user-api'

// Properties API
export * from './properties-api'

// Advertisers API
export * from './advertisers-api'

// AI Property Services API
export * from './ai-property-api'

// Admin API
export * from './admin-api'

// Import and re-export the main API client
import { apiClient, ApiError, NetworkError } from "@/lib/lib/api-client"
import type { ApiResponse, PaginatedResponse } from "@/lib/lib/api-client"

export { apiClient, ApiError, NetworkError }
export type { ApiResponse, PaginatedResponse }

/**
 * API Service Collections
 * Organized by domain for easier imports
 */

// Authentication Services
export const AuthAPI = {
  getCurrentUserProfile: () => import('./auth-api').then(m => m.getCurrentUserProfileAction),
  updateUserProfile: () => import('./auth-api').then(m => m.updateUserProfileAction),
  updateUserType: () => import('./auth-api').then(m => m.updateUserTypeAction),
  isAuthenticated: () => import('./auth-api').then(m => m.isAuthenticated),
  getUserRole: () => import('./auth-api').then(m => m.getUserRole),
  isAdmin: () => import('./auth-api').then(m => m.isAdmin),
  isProductUser: () => import('./auth-api').then(m => m.isProductUser),
  syncUserWithClerk: () => import('./auth-api').then(m => m.syncUserWithClerk),
  getAuthToken: () => import('./auth-api').then(m => m.getAuthToken),
}

// Properties Services
export const PropertiesAPI = {
  getProperties: () => import('./properties-api').then(m => m.getProperties),
  getPropertyById: () => import('./properties-api').then(m => m.getPropertyById),
  createProperty: () => import('./properties-api').then(m => m.createProperty),
  updateProperty: () => import('./properties-api').then(m => m.updateProperty),
  deleteProperty: () => import('./properties-api').then(m => m.deleteProperty),
  getPropertiesBySeller: () => import('./properties-api').then(m => m.getPropertiesBySeller),
  searchProperties: () => import('./properties-api').then(m => m.searchProperties),
  getPropertyImages: () => import('./properties-api').then(m => m.getPropertyImages),
  uploadPropertyImages: () => import('./properties-api').then(m => m.uploadPropertyImages),
  deletePropertyImage: () => import('./properties-api').then(m => m.deletePropertyImage),
  getFeaturedProperties: () => import('./properties-api').then(m => m.getFeaturedProperties),
}

// Property Media Services (New unified media API)
export const PropertyMediaAPI = {
  getPropertyMedia: () => import('./property-media-api').then(m => m.getPropertyMedia),
  getPropertyImages: () => import('./property-media-api').then(m => m.getPropertyImages),
  getPropertyVideos: () => import('./property-media-api').then(m => m.getPropertyVideos),
  getPropertyMediaById: () => import('./property-media-api').then(m => m.getPropertyMediaById),
  uploadPropertyMedia: () => import('./property-media-api').then(m => m.uploadPropertyMedia),
  updatePropertyMedia: () => import('./property-media-api').then(m => m.updatePropertyMedia),
  deletePropertyMedia: () => import('./property-media-api').then(m => m.deletePropertyMedia),
  setPrimaryMedia: () => import('./property-media-api').then(m => m.setPrimaryMedia),
  reorderPropertyMedia: () => import('./property-media-api').then(m => m.reorderPropertyMedia),
  getPrimaryMedia: () => import('./property-media-api').then(m => m.getPrimaryMedia),
  // Backward compatibility
  getPropertyImagesAsPropertyImage: () => import('./property-media-api').then(m => m.getPropertyImagesAsPropertyImage),
  uploadPropertyImagesCompat: () => import('./property-media-api').then(m => m.uploadPropertyImagesCompat),
}

// Advertisers Services
export const AdvertisersAPI = {
  getAdvertisers: () => import('./advertisers-api').then(m => m.getAdvertisers),
  getAdvertiserById: () => import('./advertisers-api').then(m => m.getAdvertiserById),
  createAdvertiser: () => import('./advertisers-api').then(m => m.createAdvertiser),
  updateAdvertiser: () => import('./advertisers-api').then(m => m.updateAdvertiser),
  deleteAdvertiser: () => import('./advertisers-api').then(m => m.deleteAdvertiser),
  getAdvertisersByServiceType: () => import('./advertisers-api').then(m => m.getAdvertisersByServiceType),
  getPremiumAdvertisers: () => import('./advertisers-api').then(m => m.getPremiumAdvertisers),
  getVerifiedAdvertisers: () => import('./advertisers-api').then(m => m.getVerifiedAdvertisers),
  searchAdvertisers: () => import('./advertisers-api').then(m => m.searchAdvertisers),
  getUserAdvertiserProfile: () => import('./advertisers-api').then(m => m.getUserAdvertiserProfile),
  upgradeAdvertiserToPremium: () => import('./advertisers-api').then(m => m.upgradeAdvertiserToPremium),
}

// AI Property Services
export const AIPropertyAPI = {
  importPropertyData: () => import('./ai-property-api').then(m => m.importPropertyData),
  getPropertyValuation: () => import('./ai-property-api').then(m => m.getPropertyValuation),
  generatePropertyDescription: () => import('./ai-property-api').then(m => m.generatePropertyDescription),
  quickPropertyLookup: () => import('./ai-property-api').then(m => m.quickPropertyLookup),
  getMarketAnalysis: () => import('./ai-property-api').then(m => m.getMarketAnalysis),
  validatePropertyAddress: () => import('./ai-property-api').then(m => m.validatePropertyAddress),
  getPropertyFeaturesSuggestions: () => import('./ai-property-api').then(m => m.getPropertyFeaturesSuggestions),
  generatePropertyTitles: () => import('./ai-property-api').then(m => m.generatePropertyTitles),
}

// Admin Services
export const AdminAPI = {
  getAdminDashboardStats: () => import('./admin-api').then(m => m.getAdminDashboardStats),
  getAdminUsers: () => import('./admin-api').then(m => m.getAdminUsers),
  updateUserRole: () => import('./admin-api').then(m => m.updateUserRoleAdmin),
  toggleUserStatus: () => import('./admin-api').then(m => m.toggleUserStatus),
  getSystemHealth: () => import('./admin-api').then(m => m.getSystemHealth),
  getAdminActivityLogs: () => import('./admin-api').then(m => m.getAdminActivityLogs),
  exportData: () => import('./admin-api').then(m => m.exportData),
  getAdminProperties: () => import('./admin-api').then(m => m.getAdminProperties),
  getAdminAdvertisers: () => import('./admin-api').then(m => m.getAdminAdvertisers),
  verifyAdvertiser: () => import('./admin-api').then(m => m.verifyAdvertiser),
}

/**
 * Utility functions for API integration
 */

// Error handling utilities
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// Loading state utilities
export const createLoadingState = <T>() => ({
  data: null as T | null,
  loading: true,
  error: null as string | null,
})

// Success state utilities
export const createSuccessState = <T>(data: T) => ({
  data,
  loading: false,
  error: null as Error | null,
})

// Error state utilities
export const createErrorState = <T>(error: string) => ({
  data: null as T | null,
  loading: false,
  error,
})

/**
 * Common API patterns for Server Components
 */

// Fetch with error handling
export const fetchWithErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  fallback?: T
): Promise<T | null> => {
  try {
    return await apiCall()
  } catch (error) {
    console.error('API call failed:', error)
    return fallback || null
  }
}

// Fetch with retry
export const fetchWithRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
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

/**
 * Type guards for API responses
 */
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof Error && error.name === 'ApiError'
}

export const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof Error && error.name === 'NetworkError'
}

/**
 * Constants for API endpoints (Updated for new controller structure)
 */
export const API_ENDPOINTS = {
  // Core User Management (New Structure)
  CORE_USER: {
    BASE: '/api/core/user',
    PROFILE: '/api/core/user/profile',
    USER_TYPE: '/api/core/user/user-type',
    SYNC: '/api/core/user/sync',
    BY_ID: (id: string) => `/api/core/user/${id}`,
    BY_EMAIL: (email: string) => `/api/core/user/by-email/${encodeURIComponent(email)}`,
    LOGIN_STATUS: (id: string) => `/api/core/user/${id}/login-status`,
    ROLE: (id: string) => `/api/core/user/${id}/role`,
    STATUS: (id: string) => `/api/core/user/${id}/status`,
  },

  // Core User Analytics (New Structure)
  CORE_USER_ANALYTICS: {
    DASHBOARD_OVERVIEW: '/api/core/user/analytics/dashboard/overview',
    ONLINE_USERS: '/api/core/user/analytics/users/online',
    USER_ACTIVITY: (userId: string) => `/api/core/user/analytics/users/${userId}/activity`,
    LOGIN_STATISTICS: '/api/core/user/analytics/statistics/logins',
    ENGAGEMENT_METRICS: '/api/core/user/analytics/statistics/engagement',
  },

  // Core Clerk Webhooks (New Structure)
  CORE_CLERK: {
    WEBHOOKS: '/api/core/clerk/webhooks',
  },

  // Authentication (Legacy - for backward compatibility)
  AUTH: {
    PROFILE: '/api/core/user/profile', // Updated to new endpoint
    USER_TYPE: '/api/core/user/user-type', // Updated to new endpoint
    SYNC: '/api/core/user/sync', // Updated to new endpoint
  },
  
  // Properties
  PROPERTIES: {
    BASE: '/api/sonobrokers/properties',
    IMAGES: (id: string) => `/api/sonobrokers/properties/${id}/images`,
    BY_ID: (id: string) => `/api/sonobrokers/properties/${id}`,
  },

  // Property Media (New unified media endpoints)
  PROPERTY_MEDIA: {
    BASE: '/api/sonobrokers/property-media',
    BY_PROPERTY: (propertyId: string) => `/api/sonobrokers/property-media/property/${propertyId}`,
    IMAGES_BY_PROPERTY: (propertyId: string) => `/api/sonobrokers/property-media/property/${propertyId}/images`,
    VIDEOS_BY_PROPERTY: (propertyId: string) => `/api/sonobrokers/property-media/property/${propertyId}/videos`,
    UPLOAD: (propertyId: string) => `/api/sonobrokers/property-media/property/${propertyId}/upload`,
    BY_ID: (id: string) => `/api/sonobrokers/property-media/${id}`,
    SET_PRIMARY: (propertyId: string, mediaId: string) => `/api/sonobrokers/property-media/${propertyId}/primary/${mediaId}`,
    REORDER: (propertyId: string) => `/api/sonobrokers/property-media/property/${propertyId}/reorder`,
  },
  
  // Advertisers
  ADVERTISERS: {
    BASE: '/api/sonobrokers/advertisers',
    MY_PROFILE: '/api/sonobrokers/advertisers/my-profile',
    BY_ID: (id: string) => `/api/sonobrokers/advertisers/${id}`,
    UPGRADE_PREMIUM: (id: string) => `/api/sonobrokers/advertisers/${id}/upgrade-premium`,
  },
  
  // AI Services
  AI: {
    PROPERTY_IMPORT: '/api/sonobrokers/ai/property-import',
    PROPERTY_VALUATION: '/api/sonobrokers/ai/property-valuation',
    GENERATE_DESCRIPTION: '/api/sonobrokers/ai/generate-description',
    MARKET_ANALYSIS: '/api/sonobrokers/ai/market-analysis',
    VALIDATE_ADDRESS: '/api/sonobrokers/ai/validate-address',
    FEATURES_SUGGESTIONS: '/api/sonobrokers/ai/features-suggestions',
    GENERATE_TITLES: '/api/sonobrokers/ai/generate-titles',
  },
  
  // Admin
  ADMIN: {
    DASHBOARD_STATS: '/api/admin/dashboard/stats',
    USERS: '/api/admin/users',
    USER_ROLE: (id: string) => `/api/admin/users/${id}/role`,
    USER_STATUS: (id: string) => `/api/admin/users/${id}/status`,
    SYSTEM_HEALTH: '/api/admin/system/health',
    ACTIVITY_LOGS: '/api/admin/activity-logs',
    EXPORT: '/api/admin/export',
    PROPERTIES: '/api/admin/properties',
    ADVERTISERS: '/api/admin/advertisers',
    VERIFY_ADVERTISER: (id: string) => `/api/admin/advertisers/${id}/verify`,
  },
} as const
