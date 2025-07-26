/**
 * Stripe Price ID Configuration
 * Manages country-specific price IDs from environment variables
 */

export type Country = 'USA' | 'Canada' | 'UAE'
export type PropertyType = 'Residential' | 'Commercial' | 'Land' | 'Rental'
export type AdvertiserPlan = 'Basic' | 'Premium'
export type ConciergeService = 'Consultation' | 'PropertyManagement' | 'LegalAssistance' | 'DocumentPreparation' | 'MarketAnalysis'

interface PriceConfig {
  priceId: string
  amount: number
  currency: string
  displayName: string
}

/**
 * Get property listing price configuration
 */
export function getPropertyListingPrice(country: Country, propertyType: PropertyType): PriceConfig {
  const priceIdMap: Record<Country, Record<PropertyType, string>> = {
    USA: {
      Residential: process.env.NEXT_PUBLIC_STRIPE_USA_RESIDENTIAL_LISTING || '',
      Commercial: process.env.NEXT_PUBLIC_STRIPE_USA_COMMERCIAL_LISTING || '',
      Land: process.env.NEXT_PUBLIC_STRIPE_USA_LAND_LISTING || '',
      Rental: process.env.NEXT_PUBLIC_STRIPE_USA_RENTAL_LISTING || ''
    },
    Canada: {
      Residential: process.env.NEXT_PUBLIC_STRIPE_CANADA_RESIDENTIAL_LISTING || '',
      Commercial: process.env.NEXT_PUBLIC_STRIPE_CANADA_COMMERCIAL_LISTING || '',
      Land: process.env.NEXT_PUBLIC_STRIPE_CANADA_LAND_LISTING || '',
      Rental: process.env.NEXT_PUBLIC_STRIPE_CANADA_RENTAL_LISTING || ''
    },
    UAE: {
      Residential: process.env.NEXT_PUBLIC_STRIPE_UAE_RESIDENTIAL_LISTING || '',
      Commercial: process.env.NEXT_PUBLIC_STRIPE_UAE_COMMERCIAL_LISTING || '',
      Land: process.env.NEXT_PUBLIC_STRIPE_UAE_LAND_LISTING || '',
      Rental: process.env.NEXT_PUBLIC_STRIPE_UAE_RENTAL_LISTING || ''
    }
  }

  const amountMap: Record<Country, Record<PropertyType, number>> = {
    USA: { Residential: 99, Commercial: 199, Land: 79, Rental: 49 },
    Canada: { Residential: 129, Commercial: 249, Land: 99, Rental: 59 },
    UAE: { Residential: 299, Commercial: 599, Land: 199, Rental: 149 }
  }

  const currencyMap: Record<Country, string> = {
    USA: 'USD',
    Canada: 'CAD',
    UAE: 'AED'
  }

  const priceId = priceIdMap[country]?.[propertyType]
  if (!priceId) {
    throw new Error(`Price ID not configured for ${propertyType} in ${country}`)
  }

  return {
    priceId,
    amount: amountMap[country][propertyType],
    currency: currencyMap[country],
    displayName: `${propertyType} Property Listing - ${country}`
  }
}

/**
 * Get advertiser subscription price configuration
 */
export function getAdvertiserSubscriptionPrice(country: Country, plan: AdvertiserPlan): PriceConfig {
  const priceIdMap: Record<Country, Record<AdvertiserPlan, string>> = {
    USA: {
      Basic: process.env.NEXT_PUBLIC_STRIPE_USA_ADVERTISER_BASIC || '',
      Premium: process.env.NEXT_PUBLIC_STRIPE_USA_ADVERTISER_PREMIUM || ''
    },
    Canada: {
      Basic: process.env.NEXT_PUBLIC_STRIPE_CANADA_ADVERTISER_BASIC || '',
      Premium: process.env.NEXT_PUBLIC_STRIPE_CANADA_ADVERTISER_PREMIUM || ''
    },
    UAE: {
      Basic: process.env.NEXT_PUBLIC_STRIPE_UAE_ADVERTISER_BASIC || '',
      Premium: process.env.NEXT_PUBLIC_STRIPE_UAE_ADVERTISER_PREMIUM || ''
    }
  }

  const amountMap: Record<Country, Record<AdvertiserPlan, number>> = {
    USA: { Basic: 29, Premium: 79 },
    Canada: { Basic: 39, Premium: 99 },
    UAE: { Basic: 99, Premium: 299 }
  }

  const currencyMap: Record<Country, string> = {
    USA: 'USD',
    Canada: 'CAD',
    UAE: 'AED'
  }

  const priceId = priceIdMap[country]?.[plan]
  if (!priceId) {
    throw new Error(`Price ID not configured for ${plan} advertiser plan in ${country}`)
  }

  return {
    priceId,
    amount: amountMap[country][plan],
    currency: currencyMap[country],
    displayName: `${plan} Advertising Plan - ${country}`
  }
}

/**
 * Get concierge service price configuration
 */
export function getConciergeServicePrice(country: Country, service: ConciergeService): PriceConfig {
  const priceIdMap: Record<Country, Record<ConciergeService, string>> = {
    USA: {
      Consultation: process.env.NEXT_PUBLIC_STRIPE_USA_CONCIERGE_CONSULTATION || '',
      PropertyManagement: process.env.NEXT_PUBLIC_STRIPE_USA_CONCIERGE_PROPERTY_MGMT || '',
      LegalAssistance: process.env.NEXT_PUBLIC_STRIPE_USA_CONCIERGE_LEGAL || '',
      DocumentPreparation: process.env.NEXT_PUBLIC_STRIPE_USA_CONCIERGE_DOCUMENTS || '',
      MarketAnalysis: process.env.NEXT_PUBLIC_STRIPE_USA_CONCIERGE_MARKET_ANALYSIS || ''
    },
    Canada: {
      Consultation: process.env.NEXT_PUBLIC_STRIPE_CANADA_CONCIERGE_CONSULTATION || '',
      PropertyManagement: process.env.NEXT_PUBLIC_STRIPE_CANADA_CONCIERGE_PROPERTY_MGMT || '',
      LegalAssistance: process.env.NEXT_PUBLIC_STRIPE_CANADA_CONCIERGE_LEGAL || '',
      DocumentPreparation: process.env.NEXT_PUBLIC_STRIPE_CANADA_CONCIERGE_DOCUMENTS || '',
      MarketAnalysis: process.env.NEXT_PUBLIC_STRIPE_CANADA_CONCIERGE_MARKET_ANALYSIS || ''
    },
    UAE: {
      Consultation: process.env.NEXT_PUBLIC_STRIPE_UAE_CONCIERGE_CONSULTATION || '',
      PropertyManagement: process.env.NEXT_PUBLIC_STRIPE_UAE_CONCIERGE_PROPERTY_MGMT || '',
      LegalAssistance: process.env.NEXT_PUBLIC_STRIPE_UAE_CONCIERGE_LEGAL || '',
      DocumentPreparation: process.env.NEXT_PUBLIC_STRIPE_UAE_CONCIERGE_DOCUMENTS || '',
      MarketAnalysis: process.env.NEXT_PUBLIC_STRIPE_UAE_CONCIERGE_MARKET_ANALYSIS || ''
    }
  }

  const amountMap: Record<Country, Record<ConciergeService, number>> = {
    USA: {
      Consultation: 149,
      PropertyManagement: 299,
      LegalAssistance: 399,
      DocumentPreparation: 199,
      MarketAnalysis: 249
    },
    Canada: {
      Consultation: 199,
      PropertyManagement: 399,
      LegalAssistance: 499,
      DocumentPreparation: 249,
      MarketAnalysis: 299
    },
    UAE: {
      Consultation: 549,
      PropertyManagement: 1099,
      LegalAssistance: 1499,
      DocumentPreparation: 699,
      MarketAnalysis: 899
    }
  }

  const currencyMap: Record<Country, string> = {
    USA: 'USD',
    Canada: 'CAD',
    UAE: 'AED'
  }

  const priceId = priceIdMap[country]?.[service]
  if (!priceId) {
    throw new Error(`Price ID not configured for ${service} concierge service in ${country}`)
  }

  return {
    priceId,
    amount: amountMap[country][service],
    currency: currencyMap[country],
    displayName: `${service.replace(/([A-Z])/g, ' $1').trim()} - ${country}`
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string): string {
  const localeMap: Record<string, string> = {
    USD: 'en-US',
    CAD: 'en-CA',
    AED: 'ar-AE'
  }

  return new Intl.NumberFormat(localeMap[currency] || 'en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

/**
 * Get country from country code
 */
export function getCountryFromCode(countryCode: string): Country {
  const countryMap: Record<string, Country> = {
    'us': 'USA',
    'usa': 'USA',
    'ca': 'Canada',
    'canada': 'Canada',
    'uae': 'UAE',
    'ae': 'UAE'
  }

  const country = countryMap[countryCode.toLowerCase()]
  if (!country) {
    throw new Error(`Unsupported country code: ${countryCode}`)
  }

  return country
}

/**
 * Validate that all required price IDs are configured
 */
export function validatePriceConfiguration(): { isValid: boolean; missingPriceIds: string[] } {
  const missingPriceIds: string[] = []

  // Check property listing price IDs
  const countries: Country[] = ['USA', 'Canada', 'UAE']
  const propertyTypes: PropertyType[] = ['Residential', 'Commercial', 'Land', 'Rental']
  const advertiserPlans: AdvertiserPlan[] = ['Basic', 'Premium']
  const conciergeServices: ConciergeService[] = ['Consultation', 'PropertyManagement', 'LegalAssistance', 'DocumentPreparation', 'MarketAnalysis']

  countries.forEach(country => {
    propertyTypes.forEach(propertyType => {
      try {
        getPropertyListingPrice(country, propertyType)
      } catch (error) {
        missingPriceIds.push(`${country}_${propertyType}_Listing`)
      }
    })

    advertiserPlans.forEach(plan => {
      try {
        getAdvertiserSubscriptionPrice(country, plan)
      } catch (error) {
        missingPriceIds.push(`${country}_${plan}_Advertiser`)
      }
    })

    conciergeServices.forEach(service => {
      try {
        getConciergeServicePrice(country, service)
      } catch (error) {
        missingPriceIds.push(`${country}_${service}_Concierge`)
      }
    })
  })

  return {
    isValid: missingPriceIds.length === 0,
    missingPriceIds
  }
}
