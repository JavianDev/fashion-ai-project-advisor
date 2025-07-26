// Advertiser Types and Interfaces
// File: src/types/advertiser.ts

export type AdvertiserPlan = 'basic' | 'premium'
export type AdvertiserStatus = 'pending' | 'active' | 'suspended' | 'cancelled'
export type UserType = 'buyer' | 'seller'
export type ServiceType =
  | 'lawyer'
  | 'photographer'
  | 'inspector'
  | 'appraiser'
  | 'home_inspector'
  | 'mortgage_broker'
  | 'insurance_agent'
  | 'contractor'
  | 'cleaner'
  | 'stager'
  | 'marketing_agency'

export interface Advertiser {
  id: string
  userId: string
  serviceProviderId?: string
  businessName: string
  contactName?: string
  email: string
  phone?: string
  website?: string
  description?: string
  serviceType: ServiceType
  serviceAreas: string[]
  licenseNumber?: string
  plan: AdvertiserPlan
  status: AdvertiserStatus
  featuredUntil?: Date
  isPremium: boolean
  isVerified: boolean
  images: string[]
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface AdvertiserSubscription {
  id: string
  advertiserId: string
  stripeSubscriptionId?: string
  stripePriceId?: string
  plan: AdvertiserPlan
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'unpaid'
  currentPeriodStart?: Date
  currentPeriodEnd?: Date
  cancelAtPeriodEnd: boolean
  canceledAt?: Date
  trialStart?: Date
  trialEnd?: Date
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface AdvertiserFormData {
  businessName: string
  contactName?: string
  email: string
  phone?: string
  website?: string
  description?: string
  serviceType: ServiceType
  serviceAreas: string[]
  licenseNumber?: string
  plan: AdvertiserPlan
}

export interface AdvertiserPlanFeatures {
  id: AdvertiserPlan
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular?: boolean
  stripePriceId?: string
}

export interface ServiceProviderWithAdvertiser {
  id: string
  name: string
  businessName: string
  serviceType: ServiceType
  location: string
  distance: string
  rating: number
  reviewCount: number
  price: string
  specialties: string[]
  verified: boolean
  isAdvertiser: boolean
  isPremium: boolean
  image?: string
  phone?: string
  email?: string
  website?: string
  description?: string
  coordinates: {
    lat: number
    lng: number
  }
  advertiser?: {
    plan: AdvertiserPlan
    status: AdvertiserStatus
    featuredUntil?: Date
    isPremium: boolean
  }
}

export interface AdvertiserDashboardStats {
  totalViews: number
  totalInquiries: number
  totalBookings: number
  conversionRate: number
  planType: AdvertiserPlan
  subscriptionStatus: string
  featuredDaysRemaining?: number
}

export interface AdvertiserAnalytics {
  views: {
    total: number
    thisMonth: number
    lastMonth: number
    trend: 'up' | 'down' | 'stable'
  }
  inquiries: {
    total: number
    thisMonth: number
    lastMonth: number
    trend: 'up' | 'down' | 'stable'
  }
  bookings: {
    total: number
    thisMonth: number
    lastMonth: number
    trend: 'up' | 'down' | 'stable'
  }
  topServiceAreas: Array<{
    area: string
    count: number
  }>
  topReferralSources: Array<{
    source: string
    count: number
  }>
}

export interface CreateAdvertiserRequest {
  businessName: string
  contactName?: string
  email: string
  phone?: string
  website?: string
  description?: string
  serviceType: ServiceType
  serviceAreas: string[]
  licenseNumber?: string
  plan: AdvertiserPlan
  images?: string[]
}

export interface UpdateAdvertiserRequest extends Partial<CreateAdvertiserRequest> {
  id: string
}

export interface AdvertiserSubscriptionRequest {
  advertiserId: string
  plan: AdvertiserPlan
  stripePriceId: string
  successUrl: string
  cancelUrl: string
}

// Service filtering types
export interface ServiceFilter {
  serviceType?: ServiceType
  location?: string
  radius?: number
  minRating?: number
  maxPrice?: number
  isVerified?: boolean
  isPremium?: boolean
  availability?: {
    date?: Date
    timeSlot?: string
  }
}

export interface ServiceSearchParams {
  query?: string
  filters: ServiceFilter
  sortBy: 'distance' | 'rating' | 'price' | 'premium'
  page: number
  limit: number
}

export interface ServiceSearchResult {
  providers: ServiceProviderWithAdvertiser[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}

// Advertiser plan configurations
export const ADVERTISER_PLANS: AdvertiserPlanFeatures[] = [
  {
    id: 'basic',
    name: 'Basic Listing',
    price: '$49',
    period: '/month',
    description: 'Get listed in our service directory',
    features: [
      'Basic business listing',
      'Contact information display',
      'Service area coverage',
      'Customer reviews',
      'Mobile-friendly profile'
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID
  },
  {
    id: 'premium',
    name: 'Premium Listing',
    price: '$149',
    period: '/month',
    description: 'Stand out with premium features',
    features: [
      'Everything in Basic',
      'Featured placement',
      'Premium badge',
      'Photo gallery (up to 10 images)',
      'Detailed service descriptions',
      'Priority customer support',
      'Analytics dashboard'
    ],
    popular: true,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID
  }
]

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  lawyer: 'Real Estate Lawyer',
  photographer: 'Property Photographer',
  inspector: 'Home Inspector',
  appraiser: 'Property Appraiser',
  home_inspector: 'Home Inspector',
  mortgage_broker: 'Mortgage Broker',
  insurance_agent: 'Insurance Agent',
  contractor: 'General Contractor',
  cleaner: 'Cleaning Service',
  stager: 'Home Stager',
  marketing_agency: 'Marketing Agency'
}
