import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import enUS from '../../locales/en-US/common.json'
import esUS from '../../locales/es-US/common.json'
import enCA from '../../locales/en-CA/common.json'
import frCA from '../../locales/fr-CA/common.json'
import arAE from '../../locales/ar-AE/common.json'
import enAE from '../../locales/en-AE/common.json'

// Define supported languages based on countries
export const supportedLanguages = {
  'en-US': { name: 'English', flag: '🇺🇸', country: 'US' },
  'es-US': { name: 'Español', flag: '🇪🇸', country: 'US' },
  'en-CA': { name: 'English', flag: '🇨🇦', country: 'CA' },
  'fr-CA': { name: 'Français', flag: '🇫🇷', country: 'CA' },
  'ar-AE': { name: 'العربية', flag: '🇦🇪', country: 'UAE' },
  'en-AE': { name: 'English', flag: '🇬🇧', country: 'UAE' },
}

// Get languages for a specific country
export const getLanguagesForCountry = (country: string) => {
  return Object.entries(supportedLanguages)
    .filter(([_, lang]) => lang.country === country)
    .map(([code, lang]) => ({ code, ...lang }))
}

// Get default language for country
export const getDefaultLanguageForCountry = (country: string): string => {
  switch (country) {
    case 'US':
      return 'en-US'
    case 'CA':
      return 'en-CA'
    case 'UAE':
      return 'en-AE'
    default:
      return 'en-US'
  }
}

// Resources object for i18next
const resources = {
  'en-US': { common: enUS },
  'es-US': { common: esUS },
  'en-CA': { common: enCA },
  'fr-CA': { common: frCA },
  'ar-AE': { common: arAE },
  'en-AE': { common: enAE },
}

// Custom language detector that respects country context
const customLanguageDetector = {
  name: 'customDetector',
  lookup: () => {
    // First check localStorage for saved language preference
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('sonobrokers-language')
      if (savedLanguage && Object.keys(supportedLanguages).includes(savedLanguage)) {
        return savedLanguage
      }

      // Then check country context and return appropriate default
      const savedCountry = localStorage.getItem('sonobrokers-country')
      if (savedCountry) {
        return getDefaultLanguageForCountry(savedCountry)
      }
    }

    // Fallback to en-US
    return 'en-US'
  },
  cacheUserLanguage: (lng: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sonobrokers-language', lng)
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en-US',
    debug: process.env.NODE_ENV === 'development',
    
    // Language detection configuration
    detection: {
      order: ['customDetector', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'sonobrokers-language',
    },

    // Namespace configuration
    defaultNS: 'common',
    ns: ['common'],

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // React specific options
    react: {
      useSuspense: false, // Disable suspense for SSR compatibility
    },

    // SSR compatibility
    initImmediate: false,

    // Ensure proper RTL support for Arabic
    lng: 'en-US', // Set default to avoid hydration issues
  })

// Add custom detector
i18n.services.languageDetector.addDetector(customLanguageDetector)

export default i18n
