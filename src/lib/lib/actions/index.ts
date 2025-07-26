/**
 * SoNoBrokers Server Actions
 * Centralized exports for all Server Actions using App Router
 */

// Authentication Actions
export * from './auth-actions'

// Enum Actions
export * from './enum-actions'

// Property Actions
export * from './property-actions'

// Advertiser Actions
export * from './advertiser-actions'

// User Actions
export * from './user-actions'

/**
 * Action Collections
 * Organized by domain for easier imports
 */

// Property Management Actions
export const PropertyActions = {
  create: () => import('./property-actions').then(m => m.createPropertyAction),
  update: () => import('./property-actions').then(m => m.updatePropertyAction),
  delete: () => import('./property-actions').then(m => m.deletePropertyAction),
  uploadImages: () => import('./property-actions').then(m => m.uploadPropertyImagesAction),
  deleteImage: () => import('./property-actions').then(m => m.deletePropertyImageAction),
  quickCreate: () => import('./property-actions').then(m => m.quickCreatePropertyAction),
  bulkUpdateStatus: () => import('./property-actions').then(m => m.bulkUpdatePropertyStatusAction),
}

// Advertiser Management Actions
export const AdvertiserActions = {
  create: () => import('./advertiser-actions').then(m => m.createAdvertiserAction),
  update: () => import('./advertiser-actions').then(m => m.updateAdvertiserAction),
  delete: () => import('./advertiser-actions').then(m => m.deleteAdvertiserAction),
  upgrade: () => import('./advertiser-actions').then(m => m.upgradeAdvertiserAction),
  updateStatus: () => import('./advertiser-actions').then(m => m.updateAdvertiserStatusAction),
  toggleVerification: () => import('./advertiser-actions').then(m => m.toggleAdvertiserVerificationAction),
  submitApplication: () => import('./advertiser-actions').then(m => m.submitAdvertiserApplicationAction),
  bulkUpdateStatus: () => import('./advertiser-actions').then(m => m.bulkUpdateAdvertiserStatusAction),
}

// User Management Actions
export const UserActions = {
  updateProfile: () => import('./user-actions').then(m => m.updateUserProfileAction),
  updateUserType: () => import('./user-actions').then(m => m.updateUserTypeAction),
  syncWithClerk: () => import('./user-actions').then(m => m.syncUserWithClerkAction),
  completeOnboarding: () => import('./user-actions').then(m => m.completeOnboardingAction),
  switchUserMode: () => import('./user-actions').then(m => m.switchUserModeAction),
  updatePreferences: () => import('./user-actions').then(m => m.updateUserPreferencesAction),
  deleteAccount: () => import('./user-actions').then(m => m.deleteUserAccountAction),
}

/**
 * Common Action Types
 */
export type ActionResult<T = any> = {
  success: boolean
  data?: T
  error?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * Action Utilities
 */

// Create initial action state
export const createInitialActionState = (): ActionResult => ({
  success: false,
  data: null,
  error: null,
  fieldErrors: {},
})

// Create success action state
export const createSuccessActionState = <T>(data: T): ActionResult<T> => ({
  success: true,
  data,
  error: null,
  fieldErrors: {},
})

// Create error action state
export const createErrorActionState = (error: string, fieldErrors?: Record<string, string[]>): ActionResult => ({
  success: false,
  data: null,
  error,
  fieldErrors: fieldErrors || {},
})

// Handle action errors
export const handleActionError = (error: unknown): ActionResult => {
  console.error('Action error:', error)
  
  if (error instanceof Error) {
    return createErrorActionState(error.message)
  }
  
  return createErrorActionState('An unexpected error occurred')
}

/**
 * Form Data Utilities
 */

// Extract form data as object
export const extractFormData = (formData: FormData): Record<string, any> => {
  const data: Record<string, any> = {}
  
  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      // Handle multiple values (convert to array)
      if (Array.isArray(data[key])) {
        data[key].push(value)
      } else {
        data[key] = [data[key], value]
      }
    } else {
      data[key] = value
    }
  }
  
  return data
}

// Clean form data (remove empty strings and undefined values)
export const cleanFormData = (data: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => 
      value !== undefined && 
      value !== null && 
      value !== ''
    )
  )
}

// Convert form data to typed object
export const convertFormData = <T>(
  formData: FormData, 
  converter: (data: Record<string, any>) => T
): T => {
  const rawData = extractFormData(formData)
  const cleanData = cleanFormData(rawData)
  return converter(cleanData)
}

/**
 * Validation Utilities
 */

// Validate required fields
export const validateRequiredFields = (
  data: Record<string, any>, 
  requiredFields: string[]
): string[] => {
  const missingFields: string[] = []
  
  for (const field of requiredFields) {
    if (!data[field] || data[field] === '') {
      missingFields.push(field)
    }
  }
  
  return missingFields
}

// Create field errors from missing fields
export const createFieldErrors = (missingFields: string[]): Record<string, string[]> => {
  const fieldErrors: Record<string, string[]> = {}
  
  for (const field of missingFields) {
    fieldErrors[field] = [`${field} is required`]
  }
  
  return fieldErrors
}

/**
 * Revalidation Utilities
 */

// Common revalidation paths
export const REVALIDATION_PATHS = {
  dashboard: '/dashboard',
  properties: '/properties',
  services: '/services',
  admin: '/admin',
  profile: '/dashboard/profile',
  settings: '/dashboard/settings',
  advertiser: '/dashboard/advertiser',
  userProperties: '/dashboard/properties',
} as const

// Revalidate multiple paths
export const revalidateMultiplePaths = async (paths: string[]): Promise<void> => {
  const { revalidatePath } = await import('next/cache')
  
  for (const path of paths) {
    revalidatePath(path)
  }
}

// Revalidate common dashboard paths
export const revalidateDashboard = async (): Promise<void> => {
  await revalidateMultiplePaths([
    REVALIDATION_PATHS.dashboard,
    REVALIDATION_PATHS.profile,
    REVALIDATION_PATHS.settings,
  ])
}

// Revalidate property-related paths
export const revalidateProperties = async (): Promise<void> => {
  await revalidateMultiplePaths([
    REVALIDATION_PATHS.properties,
    REVALIDATION_PATHS.userProperties,
    REVALIDATION_PATHS.dashboard,
  ])
}

// Revalidate service-related paths
export const revalidateServices = async (): Promise<void> => {
  await revalidateMultiplePaths([
    REVALIDATION_PATHS.services,
    REVALIDATION_PATHS.advertiser,
    REVALIDATION_PATHS.dashboard,
  ])
}
