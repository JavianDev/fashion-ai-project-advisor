// Global setup for Jest tests
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

module.exports = async () => {
  console.log('🚀 Setting up test environment...')

  try {
    // Set test environment variables
    process.env.NODE_ENV = 'test'
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8080'
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_test_key'
    process.env.CLERK_SECRET_KEY = 'sk_test_test_key'

    // Create test directories if they don't exist
    const testDirs = [
      'test-results',
      'coverage',
      '.jest-cache',
      'tests/fixtures',
      'tests/mocks',
    ]

    testDirs.forEach(dir => {
      const dirPath = path.join(process.cwd(), dir)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
        console.log(`📁 Created test directory: ${dir}`)
      }
    })

    // Setup test database (if needed)
    await setupTestDatabase()

    // Setup mock services
    await setupMockServices()

    // Verify API connectivity (if API is running)
    await verifyApiConnectivity()

    console.log('✅ Test environment setup completed successfully')
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error)
    throw error
  }
}

async function setupTestDatabase() {
  console.log('🗄️ Setting up test database...')
  
  try {
    // Check if we need to setup a test database
    const useTestDb = process.env.USE_TEST_DATABASE === 'true'
    
    if (useTestDb) {
      // Here you could setup a test database
      // For now, we'll just log that we're using mocked data
      console.log('📊 Using mocked database for tests')
    } else {
      console.log('📊 Using mocked API responses for tests')
    }
  } catch (error) {
    console.warn('⚠️ Test database setup failed, continuing with mocks:', error.message)
  }
}

async function setupMockServices() {
  console.log('🎭 Setting up mock services...')
  
  try {
    // Create mock data files if they don't exist
    const mockDataDir = path.join(process.cwd(), 'tests/fixtures')
    
    const mockData = {
      users: [
        {
          id: 'test-user-1',
          email: 'test@example.com',
          fullName: 'Test User',
          firstName: 'Test',
          lastName: 'User',
          role: 'USER',
          userType: 'Buyer',
          isActive: true,
        },
        {
          id: 'test-admin-1',
          email: 'admin@example.com',
          fullName: 'Test Admin',
          firstName: 'Test',
          lastName: 'Admin',
          role: 'ADMIN',
          userType: 'Buyer',
          isActive: true,
        },
      ],
      properties: [
        {
          id: 'test-property-1',
          title: 'Beautiful Family Home',
          description: 'A wonderful place to call home',
          price: 500000,
          propertyType: 'House',
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1500,
          city: 'Toronto',
          province: 'ON',
          country: 'CA',
          status: 'active',
          sellerId: 'test-user-1',
        },
        {
          id: 'test-property-2',
          title: 'Modern Downtown Condo',
          description: 'Luxury living in the heart of the city',
          price: 750000,
          propertyType: 'Condo',
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1200,
          city: 'Vancouver',
          province: 'BC',
          country: 'CA',
          status: 'active',
          sellerId: 'test-user-1',
        },
      ],
      advertisers: [
        {
          id: 'test-advertiser-1',
          userId: 'test-user-1',
          businessName: 'Test Photography Studio',
          contactName: 'John Photographer',
          email: 'photo@test.com',
          phone: '555-0001',
          description: 'Professional real estate photography',
          serviceType: 'photographer',
          serviceAreas: ['Toronto', 'Mississauga'],
          plan: 'basic',
          status: 'active',
          isPremium: false,
          isVerified: true,
        },
      ],
    }

    // Write mock data files
    for (const [key, data] of Object.entries(mockData)) {
      const filePath = path.join(mockDataDir, `${key}.json`)
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    }

    console.log('✅ Mock services setup completed')
  } catch (error) {
    console.warn('⚠️ Mock services setup failed:', error.message)
  }
}

async function verifyApiConnectivity() {
  console.log('🔗 Verifying API connectivity...')
  
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    
    if (!apiBaseUrl) {
      console.log('📡 No API URL configured, using mocked responses')
      return
    }

    // Try to ping the API health endpoint
    const fetch = require('node-fetch')
    const response = await fetch(`${apiBaseUrl}/health`, {
      timeout: 5000,
    })

    if (response.ok) {
      console.log('✅ API is accessible for integration tests')
      process.env.API_AVAILABLE = 'true'
    } else {
      console.log('⚠️ API returned non-200 status, using mocked responses')
      process.env.API_AVAILABLE = 'false'
    }
  } catch (error) {
    console.log('⚠️ API not accessible, using mocked responses:', error.message)
    process.env.API_AVAILABLE = 'false'
  }
}

// Helper function to check if a command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

// Helper function to check if a port is in use
async function isPortInUse(port) {
  const net = require('net')
  
  return new Promise((resolve) => {
    const server = net.createServer()
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(false)
      })
      server.close()
    })
    
    server.on('error', () => {
      resolve(true)
    })
  })
}

// Helper function to wait for a service to be ready
async function waitForService(url, timeout = 30000) {
  const fetch = require('node-fetch')
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url, { timeout: 5000 })
      if (response.ok) {
        return true
      }
    } catch (error) {
      // Service not ready yet
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  return false
}
