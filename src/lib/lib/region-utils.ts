/**
 * Utility functions for region detection testing and debugging
 */

/**
 * Clear all region-related localStorage data
 * Use this to reset region detection for testing
 */
export function clearRegionData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userCountry')
    localStorage.removeItem('countryValid')
    localStorage.removeItem('testCountry')
    console.log('🧹 Cleared all region data from localStorage')
  }
}

/**
 * Set test country override
 * This will force the region detection to use a specific country
 */
export function setTestCountry(countryCode: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('testCountry', countryCode.toUpperCase())
    console.log(`🧪 Set test country to: ${countryCode.toUpperCase()}`)
  }
}

/**
 * Remove test country override
 * This will allow normal region detection to work
 */
export function clearTestCountry(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('testCountry')
    console.log('🧪 Cleared test country override')
  }
}

/**
 * Get current region data from localStorage
 */
export function getRegionData(): {
  userCountry: string | null
  countryValid: string | null
  testCountry: string | null
} {
  if (typeof window === 'undefined') {
    return { userCountry: null, countryValid: null, testCountry: null }
  }

  return {
    userCountry: localStorage.getItem('userCountry'),
    countryValid: localStorage.getItem('countryValid'),
    testCountry: localStorage.getItem('testCountry')
  }
}

/**
 * Debug function to log all region data
 */
export function debugRegionData(): void {
  const data = getRegionData()
  console.log('🔍 Current Region Data:', data)
}

/**
 * Force region detection to run again
 * Clears cached data and reloads the page
 */
export function forceRegionRecheck(): void {
  clearRegionData()
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
}
