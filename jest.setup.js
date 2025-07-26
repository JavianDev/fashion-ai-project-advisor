// Jest setup file for SoNoBrokers React application
import '@testing-library/jest-dom'
import 'whatwg-fetch'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isLocaleDomain: true,
      isReady: true,
      defaultLocale: 'en',
      domainLocales: [],
      isPreview: false,
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
  useParams() {
    return {}
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  },
}))

// Mock Clerk authentication
jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    isSignedIn: true,
    userId: 'test-user-id',
    getToken: jest.fn().mockResolvedValue('test-token'),
    signOut: jest.fn(),
  }),
  useUser: () => ({
    user: {
      id: 'test-user-id',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      firstName: 'Test',
      lastName: 'User',
      fullName: 'Test User',
    },
    isLoaded: true,
  }),
  SignInButton: ({ children }) => <button>{children}</button>,
  SignUpButton: ({ children }) => <button>{children}</button>,
  UserButton: () => <div>User Button</div>,
  ClerkProvider: ({ children }) => <div>{children}</div>,
  auth: () => ({
    userId: 'test-user-id',
    getToken: jest.fn().mockResolvedValue('test-token'),
  }),
  currentUser: jest.fn().mockResolvedValue({
    id: 'test-user-id',
    emailAddresses: [{ emailAddress: 'test@example.com' }],
    firstName: 'Test',
    lastName: 'User',
  }),
}))

// Mock Clerk server functions
jest.mock('@clerk/nextjs/server', () => ({
  auth: () => ({
    userId: 'test-user-id',
    getToken: jest.fn().mockResolvedValue('test-token'),
  }),
  currentUser: jest.fn().mockResolvedValue({
    id: 'test-user-id',
    emailAddresses: [{ emailAddress: 'test@example.com' }],
    firstName: 'Test',
    lastName: 'User',
  }),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8080'
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_test_key'
process.env.CLERK_SECRET_KEY = 'sk_test_test_key'
process.env.NODE_ENV = 'test'

// Mock fetch globally
global.fetch = jest.fn()

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore specific console methods
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Mock API client
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    upload: jest.fn(),
  },
  ApiError: class ApiError extends Error {
    constructor(message, status) {
      super(message)
      this.name = 'ApiError'
      this.status = status
    }
  },
  NetworkError: class NetworkError extends Error {
    constructor(message) {
      super(message)
      this.name = 'NetworkError'
    }
  },
}))

// Mock API services
jest.mock('@/lib/api/auth-api', () => ({
  getCurrentUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
  updateUserType: jest.fn(),
  isAuthenticated: jest.fn().mockResolvedValue(true),
  getUserRole: jest.fn().mockResolvedValue('USER'),
  isAdmin: jest.fn().mockResolvedValue(false),
  syncUserWithClerk: jest.fn(),
}))

jest.mock('@/lib/api/properties-api', () => ({
  getProperties: jest.fn(),
  getPropertyById: jest.fn(),
  createProperty: jest.fn(),
  updateProperty: jest.fn(),
  deleteProperty: jest.fn(),
  getFeaturedProperties: jest.fn().mockResolvedValue([]),
  searchProperties: jest.fn(),
  uploadPropertyImages: jest.fn(),
  deletePropertyImage: jest.fn(),
}))

jest.mock('@/lib/api/advertisers-api', () => ({
  getAdvertisers: jest.fn(),
  getAdvertiserById: jest.fn(),
  createAdvertiser: jest.fn(),
  updateAdvertiser: jest.fn(),
  deleteAdvertiser: jest.fn(),
  getAdvertisersByServiceType: jest.fn(),
  getPremiumAdvertisers: jest.fn(),
  upgradeAdvertiserToPremium: jest.fn(),
}))

// Mock Server Actions
jest.mock('@/lib/actions/property-actions', () => ({
  createPropertyAction: jest.fn(),
  updatePropertyAction: jest.fn(),
  deletePropertyAction: jest.fn(),
  uploadPropertyImagesAction: jest.fn(),
  deletePropertyImageAction: jest.fn(),
}))

jest.mock('@/lib/actions/user-actions', () => ({
  updateUserProfileAction: jest.fn(),
  updateUserTypeAction: jest.fn(),
  completeOnboardingAction: jest.fn(),
  switchUserModeAction: jest.fn(),
}))

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
  Trans: ({ children }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}))

// Setup test utilities
global.testUtils = {
  // Helper to create mock API responses
  createMockApiResponse: (data, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(data),
    text: jest.fn().mockResolvedValue(JSON.stringify(data)),
  }),
  
  // Helper to create mock user
  createMockUser: (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    fullName: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    role: 'USER',
    userType: 'Buyer',
    isActive: true,
    ...overrides,
  }),
  
  // Helper to create mock property
  createMockProperty: (overrides = {}) => ({
    id: 'test-property-id',
    title: 'Test Property',
    description: 'Test property description',
    price: 500000,
    propertyType: 'House',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1500,
    city: 'Toronto',
    province: 'ON',
    country: 'CA',
    status: 'active',
    sellerId: 'test-seller-id',
    ...overrides,
  }),
  
  // Helper to wait for async operations
  waitFor: (callback, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now()
      const check = () => {
        try {
          const result = callback()
          if (result) {
            resolve(result)
          } else if (Date.now() - startTime > timeout) {
            reject(new Error('Timeout waiting for condition'))
          } else {
            setTimeout(check, 100)
          }
        } catch (error) {
          if (Date.now() - startTime > timeout) {
            reject(error)
          } else {
            setTimeout(check, 100)
          }
        }
      }
      check()
    })
  },
}

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
  
  // Reset fetch mock
  if (global.fetch) {
    global.fetch.mockClear()
  }
  
  // Clear localStorage and sessionStorage
  localStorage.clear()
  sessionStorage.clear()
})

afterEach(() => {
  // Cleanup after each test
  jest.restoreAllMocks()
})

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})
