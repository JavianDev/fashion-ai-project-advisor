/**
 * Geographic Location and Country Management
 * Handles IP-based country detection, validation, and routing
 * IP verification is done from UI, all other calls go through .NET Web API
 */

// Note: This file is used in both client and server components
// Avoid importing server-only modules here

// Cache for supported countries
let supportedCountriesCache: string[] | null = null;

// Supported countries enum matching .NET Web API
export enum Country {
  CA = 'CA',
  US = 'US',
  UAE = 'UAE'
}

// Country mapping for routing - NO localhost redirects
const COUNTRY_ROUTES = {
  [Country.CA]: '/ca',
  [Country.US]: '/usa',
  [Country.UAE]: '/uae'
} as const

// Default country fallback
const DEFAULT_COUNTRY = Country.CA

// Hardcoded country data - no need for API calls since this rarely changes
const COUNTRY_DATA = {
  [Country.CA]: {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    languages: ['en-CA', 'fr-CA'],
    currency: 'CAD',
    timezone: 'America/Toronto'
  },
  [Country.US]: {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    languages: ['en-US', 'es-US'],
    currency: 'USD',
    timezone: 'America/New_York'
  },
  [Country.UAE]: {
    code: 'UAE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    languages: ['ar-AE', 'en-AE'],
    currency: 'AED',
    timezone: 'Asia/Dubai'
  }
}

// Country display names for backward compatibility
const COUNTRY_NAMES = {
  [Country.CA]: COUNTRY_DATA[Country.CA].name,
  [Country.US]: COUNTRY_DATA[Country.US].name,
  [Country.UAE]: COUNTRY_DATA[Country.UAE].name
} as const

/**
 * Get user's country from IP address (CLIENT-SIDE ONLY)
 * This function should ONLY be called from the browser
 * IP verification is done from UI itself, not from Web API
 */
export async function detectCountryFromIP(): Promise<Country> {
  // CRITICAL: Only run on client side
  if (typeof window === 'undefined') {
    console.warn('detectCountryFromIP called on server side, returning default country')
    return DEFAULT_COUNTRY
  }

  try {
    // Check if we have a cached result (valid for 1 hour)
    const cached = localStorage.getItem('snb-ip-country-cache')
    const cacheTimestamp = localStorage.getItem('snb-ip-country-timestamp')

    if (cached && cacheTimestamp) {
      const cacheAge = Date.now() - parseInt(cacheTimestamp)
      if (cacheAge < 60 * 60 * 1000) { // 1 hour cache
        const cachedCountry = cached as Country
        if (Object.values(Country).includes(cachedCountry)) {
          console.log(`Using cached country: ${cachedCountry}`)
          return cachedCountry
        }
      }
    }

    console.log('Detecting country from IP address...')

    // Use multiple IP geolocation services for reliability
    let detectedCountry: string | null = null

    // Try primary service: ipapi.co
    try {
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SoNoBrokers/1.0'
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })

      if (response.ok) {
        const data = await response.json()
        detectedCountry = data.country_code?.toUpperCase()
        console.log(`Primary IP service detected: ${detectedCountry}`)
      }
    } catch (error) {
      console.warn('Primary IP service failed:', error)
    }

    // Fallback service: ipinfo.io
    if (!detectedCountry) {
      try {
        const response = await fetch('https://ipinfo.io/json', {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          },
          signal: AbortSignal.timeout(5000)
        })

        if (response.ok) {
          const data = await response.json()
          detectedCountry = data.country?.toUpperCase()
          console.log(`Fallback IP service detected: ${detectedCountry}`)
        }
      } catch (error) {
        console.warn('Fallback IP service failed:', error)
      }
    }

    // Map detected country to our supported countries
    let mappedCountry: Country = DEFAULT_COUNTRY

    if (detectedCountry) {
      switch (detectedCountry) {
        case 'US':
        case 'USA':
          mappedCountry = Country.US
          break
        case 'CA':
        case 'CAN':
          mappedCountry = Country.CA
          break
        case 'AE':
        case 'ARE':
        case 'UAE':
          mappedCountry = Country.UAE
          break
        default:
          console.log(`Unsupported country detected: ${detectedCountry}, using default: ${DEFAULT_COUNTRY}`)
          mappedCountry = DEFAULT_COUNTRY
      }
    }

    // Cache the result
    localStorage.setItem('snb-ip-country-cache', mappedCountry)
    localStorage.setItem('snb-ip-country-timestamp', Date.now().toString())

    console.log(`Final detected country: ${mappedCountry}`)
    return mappedCountry

  } catch (error) {
    console.error('Failed to detect country from IP:', error)
    return DEFAULT_COUNTRY
  }
}

/**
 * Get supported countries - hardcoded since this rarely changes
 */
export async function getSupportedCountries(): Promise<string[]> {
  if (supportedCountriesCache) {
    return supportedCountriesCache;
  }

  // Use hardcoded data - no API call needed
  supportedCountriesCache = Object.keys(COUNTRY_DATA)
  return supportedCountriesCache
}

/**
 * Check if a country is supported
 */
export async function isLocationSupported(countryCode: string): Promise<boolean> {
  const supportedCountries = await getSupportedCountries()
  return supportedCountries.includes(countryCode.toUpperCase())
}

/**
 * Get country name from hardcoded data
 */
export async function getCountryName(countryCode: string): Promise<string> {
  const upperCode = countryCode.toUpperCase() as Country
  return COUNTRY_DATA[upperCode]?.name || 'Your Region'
}

/**
 * Get country data including flag, languages, etc.
 */
export function getCountryData(countryCode: string) {
  const upperCode = countryCode.toUpperCase() as Country
  return COUNTRY_DATA[upperCode] || null
}

/**
 * Get all country data
 */
export function getAllCountryData() {
  return COUNTRY_DATA
}

/**
 * Validate and redirect to appropriate country route
 * NEVER redirects to localhost:3000, always to /ca, /usa, or /uae
 * This should be called on page load to ensure proper routing
 */
export async function validateAndRedirectToCountry(currentPath: string = '/'): Promise<{
  shouldRedirect: boolean
  redirectPath: string
  detectedCountry: Country
}> {
  try {
    console.log(`Validating country route for path: ${currentPath}`)

    // Get country from current URL path
    const pathSegments = currentPath.split('/').filter(Boolean)
    const urlCountry = pathSegments[0]?.toUpperCase()

    // Check if URL already has a valid country
    if (urlCountry && Object.values(Country).includes(urlCountry as Country)) {
      console.log(`Already on valid country route: ${urlCountry}`)
      return {
        shouldRedirect: false,
        redirectPath: currentPath,
        detectedCountry: urlCountry as Country
      }
    }

    // Detect country from IP (CLIENT-SIDE ONLY)
    const detectedCountry = await detectCountryFromIP()
    const countryRoute = COUNTRY_ROUTES[detectedCountry]

    // Handle root path - redirect to country home
    if (currentPath === '/' || currentPath === '' || currentPath === '/index') {
      console.log(`Root path detected, redirecting to: ${countryRoute}`)
      return {
        shouldRedirect: true,
        redirectPath: countryRoute,
        detectedCountry
      }
    }

    // Handle paths without country - prepend detected country
    if (!urlCountry || !Object.values(Country).includes(urlCountry as Country)) {
      const newPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`
      const redirectPath = `${countryRoute}${newPath}`

      console.log(`Path without country detected, redirecting to: ${redirectPath}`)
      return {
        shouldRedirect: true,
        redirectPath,
        detectedCountry
      }
    }

    // Should not reach here, but fallback
    return {
      shouldRedirect: false,
      redirectPath: currentPath,
      detectedCountry
    }

  } catch (error) {
    console.error('Error in country validation:', error)

    // Fallback to default country
    const defaultRoute = COUNTRY_ROUTES[DEFAULT_COUNTRY]
    const fallbackPath = currentPath === '/' ? defaultRoute : `${defaultRoute}${currentPath}`

    return {
      shouldRedirect: true,
      redirectPath: fallbackPath,
      detectedCountry: DEFAULT_COUNTRY
    }
  }
}

/**
 * Get country from URL path
 */
export function getCountryFromPath(pathname: string): Country | null {
  const pathSegments = pathname.split('/')
  const urlCountry = pathSegments[1]?.toUpperCase()

  if (urlCountry && ['CA', 'US', 'UAE'].includes(urlCountry)) {
    return urlCountry as Country
  }

  return null
}

/**
 * Get country-specific route
 */
export function getCountryRoute(country: Country): string {
  return COUNTRY_ROUTES[country] || COUNTRY_ROUTES[DEFAULT_COUNTRY]
}

/**
 * Get dashboard URL for a specific country
 */
export function getDashboardUrl(countryCode: string): string {
  const country = countryCode.toUpperCase() as Country
  const baseRoute = COUNTRY_ROUTES[country] || COUNTRY_ROUTES[DEFAULT_COUNTRY]
  return `${baseRoute}/dashboard`
}

/**
 * Get region-specific policies and compliance information
 */
export function getRegionSpecificPolicies(countryCode: string) {
  const policies: Record<string, {
    privacyLaws: string[];
    dataRetention: string;
    dataTransfer: string;
    currency: string;
    timezone: string;
  }> = {
    US: {
      privacyLaws: ['CCPA', 'CPRA', 'VCDPA', 'CPA', 'CTDPA'],
      dataRetention: '24 months',
      dataTransfer: 'Within US and Canada only',
      currency: 'USD',
      timezone: 'America/New_York'
    },
    CA: {
      privacyLaws: ['PIPEDA'],
      dataRetention: '24 months',
      dataTransfer: 'Within US and Canada only',
      currency: 'CAD',
      timezone: 'America/Toronto'
    },
    UAE: {
      privacyLaws: ['UAE Data Protection Law'],
      dataRetention: '24 months',
      dataTransfer: 'Within UAE and approved countries only',
      currency: 'AED',
      timezone: 'Asia/Dubai'
    },
  };
  return policies[countryCode.toUpperCase()] || null;
}

/**
 * Initialize country detection and routing
 * Should be called on app initialization (CLIENT-SIDE ONLY)
 * This identifies country and redirects to /ca, /usa, or /uae
 */
export async function initializeCountryRouting(): Promise<{
  detectedCountry: Country
  shouldRedirect: boolean
  redirectPath: string
  currentPath: string
}> {
  // CRITICAL: Only run on client side
  if (typeof window === 'undefined') {
    console.warn('initializeCountryRouting called on server side')
    return {
      detectedCountry: DEFAULT_COUNTRY,
      shouldRedirect: false,
      redirectPath: '/',
      currentPath: '/'
    }
  }

  try {
    const currentPath = window.location.pathname
    console.log(`Initializing country routing for: ${currentPath}`)

    const validation = await validateAndRedirectToCountry(currentPath)

    return {
      detectedCountry: validation.detectedCountry,
      shouldRedirect: validation.shouldRedirect,
      redirectPath: validation.redirectPath,
      currentPath
    }
  } catch (error) {
    console.error('Error initializing country routing:', error)
    return {
      detectedCountry: DEFAULT_COUNTRY,
      shouldRedirect: true,
      redirectPath: COUNTRY_ROUTES[DEFAULT_COUNTRY],
      currentPath: typeof window !== 'undefined' ? window.location.pathname : '/'
    }
  }
}

/**
 * Perform country-based redirect (CLIENT-SIDE ONLY)
 * This actually performs the redirect to the correct country route
 */
export function performCountryRedirect(redirectPath: string): void {
  if (typeof window === 'undefined') {
    console.warn('performCountryRedirect called on server side')
    return
  }

  console.log(`Performing redirect to: ${redirectPath}`)

  // Use window.location.href for full page redirect
  // This ensures proper routing without localhost:3000 issues
  window.location.href = redirectPath
}

/**
 * Get current country from URL path
 * Returns null if no valid country found in path
 */
export function getCurrentCountryFromPath(): Country | null {
  if (typeof window === 'undefined') {
    return null
  }

  const pathSegments = window.location.pathname.split('/').filter(Boolean)
  const urlCountry = pathSegments[0]?.toUpperCase()

  if (urlCountry && Object.values(Country).includes(urlCountry as Country)) {
    return urlCountry as Country
  }

  return null
}

/**
 * Clear country cache (useful for testing or manual override)
 */
export function clearCountryCache(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ip-country-cache')
    localStorage.removeItem('ip-country-timestamp')
  }
  supportedCountriesCache = null
}
