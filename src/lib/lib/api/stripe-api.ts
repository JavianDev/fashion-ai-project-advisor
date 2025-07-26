/**
 * Stripe Payment API Service
 * Handles all Stripe payment operations via .NET Web API
 */

import { apiClient } from "@/lib/lib/api-client"
import type { ApiResponse } from '@/types'

// Client-safe stripe API - no server-only imports

// Helper function to get auth token (client-safe)
async function getAuthToken(): Promise<string | null> {
  try {
    // For client-side, we'll rely on cookies/session
    // Server-side auth should use server API client
    return null
  } catch (error) {
    console.warn('Failed to get auth token:', error)
    return null
  }
}

// Request Types
export interface PropertyListingPaymentRequest {
  propertyId: string
  propertyType: 'Residential' | 'Commercial' | 'Land' | 'Rental'
  country: 'USA' | 'Canada' | 'UAE'
  email: string
}

export interface AdvertiserSubscriptionRequest {
  subscriptionPlan: 'Basic' | 'Premium'
  country: 'USA' | 'Canada' | 'UAE'
  email: string
}

export interface ConciergeServicePaymentRequest {
  serviceType: 'Consultation' | 'PropertyManagement' | 'LegalAssistance' | 'DocumentPreparation' | 'MarketAnalysis'
  country: 'USA' | 'Canada' | 'UAE'
  email: string
  projectId?: string
}

// Response Types
export interface StripeCheckoutSessionResponse {
  sessionId: string
  url: string
  publishableKey: string
}

/**
 * Server Action: Create property listing payment session
 */
export async function createPropertyListingPayment(request: PropertyListingPaymentRequest): Promise<StripeCheckoutSessionResponse | null> {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.post<ApiResponse<StripeCheckoutSessionResponse>>(
      '/api/stripe/sonobrokers/property-listing-payment',
      request
    )
    
    return response.data || null
  } catch (error) {
    console.error('Failed to create property listing payment:', error)
    return null
  }
}

/**
 * Server Action: Create advertiser subscription payment session
 */
export async function createAdvertiserSubscription(request: AdvertiserSubscriptionRequest): Promise<StripeCheckoutSessionResponse | null> {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.post<ApiResponse<StripeCheckoutSessionResponse>>(
      '/api/stripe/sonobrokers/advertiser-subscription',
      request
    )
    
    return response.data || null
  } catch (error) {
    console.error('Failed to create advertiser subscription:', error)
    return null
  }
}

/**
 * Server Action: Create concierge service payment session
 */
export async function createConciergeServicePayment(request: ConciergeServicePaymentRequest): Promise<StripeCheckoutSessionResponse | null> {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.post<ApiResponse<StripeCheckoutSessionResponse>>(
      '/api/stripe/sonobrokers/concierge-service-payment',
      request
    )
    
    return response.data || null
  } catch (error) {
    console.error('Failed to create concierge service payment:', error)
    return null
  }
}

/**
 * Server Action: Get subscription status
 */
export async function getSubscriptionStatus(): Promise<any | null> {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.get<ApiResponse<any>>('/api/stripe/sonobrokers/subscription-status')
    return response.data || null
  } catch (error) {
    console.error('Failed to get subscription status:', error)
    return null
  }
}

/**
 * Server Action: Cancel subscription
 */
export async function cancelSubscription(): Promise<boolean> {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    await apiClient.delete('/api/stripe/sonobrokers/subscription')
    return true
  } catch (error) {
    console.error('Failed to cancel subscription:', error)
    return false
  }
}

/**
 * Client-side helper: Redirect to Stripe Checkout
 */
export function redirectToStripeCheckout(checkoutUrl: string) {
  if (typeof window !== 'undefined') {
    window.location.href = checkoutUrl
  }
}

/**
 * Helper: Get payment type display name
 */
export function getPaymentTypeDisplayName(paymentType: string): string {
  const displayNames: Record<string, string> = {
    'property_listing': 'Property Listing Fee',
    'advertiser_subscription': 'Advertiser Subscription',
    'concierge_service': 'Concierge Service'
  }
  
  return displayNames[paymentType] || paymentType
}

/**
 * Helper: Get service type display name
 */
export function getServiceTypeDisplayName(serviceType: string): string {
  const displayNames: Record<string, string> = {
    'Consultation': 'Real Estate Consultation',
    'PropertyManagement': 'Property Management',
    'LegalAssistance': 'Legal Assistance',
    'DocumentPreparation': 'Document Preparation',
    'MarketAnalysis': 'Market Analysis'
  }
  
  return displayNames[serviceType] || serviceType
}

/**
 * Helper: Get property type display name
 */
export function getPropertyTypeDisplayName(propertyType: string): string {
  const displayNames: Record<string, string> = {
    'Residential': 'Residential Property',
    'Commercial': 'Commercial Property',
    'Land': 'Land/Lot',
    'Rental': 'Rental Property'
  }
  
  return displayNames[propertyType] || propertyType
}

/**
 * Helper: Get subscription plan display name
 */
export function getSubscriptionPlanDisplayName(plan: string): string {
  const displayNames: Record<string, string> = {
    'Basic': 'Basic Advertising Plan',
    'Premium': 'Premium Advertising Plan'
  }
  
  return displayNames[plan] || plan
}

/**
 * Helper: Format currency for country
 */
export function formatCurrencyForCountry(amount: number, country: string): string {
  const currencyMap: Record<string, { currency: string; locale: string }> = {
    'USA': { currency: 'USD', locale: 'en-US' },
    'Canada': { currency: 'CAD', locale: 'en-CA' },
    'UAE': { currency: 'AED', locale: 'ar-AE' }
  }
  
  const config = currencyMap[country] || currencyMap['USA']
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency
  }).format(amount)
}
