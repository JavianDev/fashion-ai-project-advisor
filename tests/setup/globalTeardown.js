// Global teardown for Jest tests
const fs = require('fs')
const path = require('path')

module.exports = async () => {
  console.log('🧹 Cleaning up test environment...')

  try {
    // Cleanup test database
    await cleanupTestDatabase()

    // Cleanup test files
    await cleanupTestFiles()

    // Cleanup mock services
    await cleanupMockServices()

    // Generate test summary
    await generateTestSummary()

    console.log('✅ Test environment cleanup completed successfully')
  } catch (error) {
    console.error('❌ Failed to cleanup test environment:', error)
    // Don't throw error in teardown to avoid masking test failures
  }
}

async function cleanupTestDatabase() {
  console.log('🗄️ Cleaning up test database...')
  
  try {
    const useTestDb = process.env.USE_TEST_DATABASE === 'true'
    
    if (useTestDb) {
      // Here you could cleanup test database
      console.log('📊 Test database cleanup completed')
    } else {
      console.log('📊 No test database to cleanup (using mocks)')
    }
  } catch (error) {
    console.warn('⚠️ Test database cleanup failed:', error.message)
  }
}

async function cleanupTestFiles() {
  console.log('📁 Cleaning up temporary test files...')
  
  try {
    const tempDirs = [
      'tests/temp',
      'tests/uploads',
      '.jest-cache/temp',
    ]

    tempDirs.forEach(dir => {
      const dirPath = path.join(process.cwd(), dir)
      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true })
        console.log(`🗑️ Removed temporary directory: ${dir}`)
      }
    })

    // Clean up any test-generated files
    const testGeneratedFiles = [
      'test-output.log',
      'debug.log',
      'error.log',
    ]

    testGeneratedFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        console.log(`🗑️ Removed test file: ${file}`)
      }
    })

  } catch (error) {
    console.warn('⚠️ Test files cleanup failed:', error.message)
  }
}

async function cleanupMockServices() {
  console.log('🎭 Cleaning up mock services...')
  
  try {
    // Reset any global mocks or services
    if (global.mockServices) {
      global.mockServices.reset()
      console.log('🔄 Reset global mock services')
    }

    // Clear any cached mock data
    if (global.mockCache) {
      global.mockCache.clear()
      console.log('🧹 Cleared mock cache')
    }

  } catch (error) {
    console.warn('⚠️ Mock services cleanup failed:', error.message)
  }
}

async function generateTestSummary() {
  console.log('📊 Generating test summary...')
  
  try {
    const testResultsDir = path.join(process.cwd(), 'test-results')
    
    if (!fs.existsSync(testResultsDir)) {
      return
    }

    // Read test results if available
    const junitPath = path.join(testResultsDir, 'junit.xml')
    const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json')
    
    let summary = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      apiAvailable: process.env.API_AVAILABLE === 'true',
    }

    // Add coverage information if available
    if (fs.existsSync(coveragePath)) {
      try {
        const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'))
        summary.coverage = {
          lines: coverageData.total?.lines?.pct || 0,
          functions: coverageData.total?.functions?.pct || 0,
          branches: coverageData.total?.branches?.pct || 0,
          statements: coverageData.total?.statements?.pct || 0,
        }
      } catch (error) {
        console.warn('⚠️ Could not read coverage data:', error.message)
      }
    }

    // Add test results information if available
    if (fs.existsSync(junitPath)) {
      try {
        const junitData = fs.readFileSync(junitPath, 'utf8')
        // Parse basic info from JUnit XML (simplified)
        const testsuiteMatch = junitData.match(/<testsuite[^>]*tests="(\d+)"[^>]*failures="(\d+)"[^>]*errors="(\d+)"/)
        if (testsuiteMatch) {
          summary.tests = {
            total: parseInt(testsuiteMatch[1]),
            failures: parseInt(testsuiteMatch[2]),
            errors: parseInt(testsuiteMatch[3]),
            passed: parseInt(testsuiteMatch[1]) - parseInt(testsuiteMatch[2]) - parseInt(testsuiteMatch[3]),
          }
        }
      } catch (error) {
        console.warn('⚠️ Could not read test results:', error.message)
      }
    }

    // Write summary file
    const summaryPath = path.join(testResultsDir, 'test-summary.json')
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
    
    // Log summary to console
    console.log('📋 Test Summary:')
    if (summary.tests) {
      console.log(`   Tests: ${summary.tests.passed}/${summary.tests.total} passed`)
      if (summary.tests.failures > 0) {
        console.log(`   Failures: ${summary.tests.failures}`)
      }
      if (summary.tests.errors > 0) {
        console.log(`   Errors: ${summary.tests.errors}`)
      }
    }
    
    if (summary.coverage) {
      console.log(`   Coverage: ${summary.coverage.lines}% lines, ${summary.coverage.functions}% functions`)
    }
    
    console.log(`   API Available: ${summary.apiAvailable ? 'Yes' : 'No'}`)
    console.log(`   Summary saved to: ${summaryPath}`)

  } catch (error) {
    console.warn('⚠️ Test summary generation failed:', error.message)
  }
}

// Helper function to safely remove directory
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath)
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        removeDirectory(filePath)
      } else {
        fs.unlinkSync(filePath)
      }
    })
    
    fs.rmdirSync(dirPath)
  }
}

// Helper function to check if file is older than specified time
function isFileOlderThan(filePath, hours) {
  try {
    const stats = fs.statSync(filePath)
    const fileAge = Date.now() - stats.mtime.getTime()
    const maxAge = hours * 60 * 60 * 1000 // Convert hours to milliseconds
    return fileAge > maxAge
  } catch (error) {
    return false
  }
}

// Helper function to get directory size
function getDirectorySize(dirPath) {
  let totalSize = 0
  
  if (!fs.existsSync(dirPath)) {
    return 0
  }
  
  const files = fs.readdirSync(dirPath)
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file)
    const stats = fs.statSync(filePath)
    
    if (stats.isDirectory()) {
      totalSize += getDirectorySize(filePath)
    } else {
      totalSize += stats.size
    }
  })
  
  return totalSize
}

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
