/**
 * SoNoBrokers API Connectivity Test Script
 * 
 * This script tests the connectivity between the React app and the Web API
 * Run this script with: node test-api-connectivity.js
 */

const https = require('https');
const http = require('http');

// API Configuration from .env.local
const API_BASE_URL = 'http://localhost:5005';
const API_BASE_URL_HTTPS = 'https://localhost:7163';

// Test endpoints based on our new controller structure
const TEST_ENDPOINTS = [
    // Health and basic endpoints
    { method: 'GET', path: '/health', description: 'Health Check' },
    { method: 'GET', path: '/api/sonobrokers/test/ping', description: 'Test Ping' },
    
    // Core User endpoints (new structure)
    { method: 'GET', path: '/api/core/user', description: 'Get All Users' },
    { method: 'GET', path: '/api/core/user/profile', description: 'Get Current User Profile' },
    
    // Core User Analytics endpoints (new structure)
    { method: 'GET', path: '/api/core/user/analytics/dashboard/overview', description: 'Dashboard Overview' },
    { method: 'GET', path: '/api/core/user/analytics/users/online', description: 'Online Users' },
    
    // Core Clerk Webhooks (new structure)
    { method: 'POST', path: '/api/core/clerk/webhooks', description: 'Clerk Webhooks' },
    
    // SoNoBrokers Properties
    { method: 'GET', path: '/api/sonobrokers/properties', description: 'Get Properties' },
    { method: 'GET', path: '/api/sonobrokers/properties/search', description: 'Search Properties' },
    
    // SoNoBrokers Subscriptions
    { method: 'GET', path: '/api/sonobrokers/subscriptions', description: 'Get Subscriptions' },
];

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, method = 'GET', timeout = 5000) {
    return new Promise((resolve, reject) => {
        const isHttps = url.startsWith('https:');
        const requestModule = isHttps ? https : http;
        
        const options = {
            method: method,
            timeout: timeout,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'SoNoBrokers-API-Test/1.0'
            }
        };

        // For HTTPS, ignore certificate errors in development
        if (isHttps) {
            options.rejectUnauthorized = false;
        }

        const req = requestModule.request(url, options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                    headers: res.headers,
                    data: data,
                    success: res.statusCode >= 200 && res.statusCode < 400
                });
            });
        });

        req.on('error', (error) => {
            reject({
                error: error.message,
                code: error.code,
                success: false
            });
        });

        req.on('timeout', () => {
            req.destroy();
            reject({
                error: 'Request timeout',
                code: 'TIMEOUT',
                success: false
            });
        });

        req.setTimeout(timeout);
        req.end();
    });
}

async function testEndpoint(baseUrl, endpoint) {
    const url = `${baseUrl}${endpoint.path}`;
    
    try {
        log(`Testing: ${endpoint.method} ${endpoint.path}`, 'cyan');
        log(`Description: ${endpoint.description}`, 'blue');
        log(`URL: ${url}`, 'yellow');
        
        const result = await makeRequest(url, endpoint.method);
        
        if (result.success) {
            log(`✅ SUCCESS - Status: ${result.statusCode} ${result.statusMessage}`, 'green');
            
            // Try to parse JSON response
            try {
                const jsonData = JSON.parse(result.data);
                log(`Response: ${JSON.stringify(jsonData, null, 2).substring(0, 200)}...`, 'blue');
            } catch (e) {
                log(`Response: ${result.data.substring(0, 100)}...`, 'blue');
            }
        } else {
            log(`❌ FAILED - Status: ${result.statusCode} ${result.statusMessage}`, 'red');
            log(`Response: ${result.data.substring(0, 200)}`, 'red');
        }
        
        return result;
        
    } catch (error) {
        log(`❌ ERROR - ${error.error} (${error.code})`, 'red');
        return error;
    }
}

async function testApiConnectivity() {
    log('🚀 Starting SoNoBrokers API Connectivity Tests', 'bright');
    log('=' * 60, 'cyan');
    
    const results = {
        http: { total: 0, success: 0, failed: 0 },
        https: { total: 0, success: 0, failed: 0 }
    };
    
    // Test HTTP endpoints
    log('\n📡 Testing HTTP API (localhost:5005)', 'magenta');
    log('-' * 40, 'cyan');
    
    for (const endpoint of TEST_ENDPOINTS) {
        results.http.total++;
        const result = await testEndpoint(API_BASE_URL, endpoint);
        
        if (result.success) {
            results.http.success++;
        } else {
            results.http.failed++;
        }
        
        log(''); // Empty line for readability
    }
    
    // Test HTTPS endpoints
    log('\n🔒 Testing HTTPS API (localhost:7163)', 'magenta');
    log('-' * 40, 'cyan');
    
    for (const endpoint of TEST_ENDPOINTS) {
        results.https.total++;
        const result = await testEndpoint(API_BASE_URL_HTTPS, endpoint);
        
        if (result.success) {
            results.https.success++;
        } else {
            results.https.failed++;
        }
        
        log(''); // Empty line for readability
    }
    
    // Summary
    log('\n📊 TEST SUMMARY', 'bright');
    log('=' * 60, 'cyan');
    log(`HTTP API (${API_BASE_URL}):`, 'yellow');
    log(`  ✅ Success: ${results.http.success}/${results.http.total}`, results.http.success > 0 ? 'green' : 'red');
    log(`  ❌ Failed:  ${results.http.failed}/${results.http.total}`, results.http.failed > 0 ? 'red' : 'green');
    
    log(`\nHTTPS API (${API_BASE_URL_HTTPS}):`, 'yellow');
    log(`  ✅ Success: ${results.https.success}/${results.https.total}`, results.https.success > 0 ? 'green' : 'red');
    log(`  ❌ Failed:  ${results.https.failed}/${results.https.total}`, results.https.failed > 0 ? 'red' : 'green');
    
    const totalSuccess = results.http.success + results.https.success;
    const totalTests = results.http.total + results.https.total;
    
    log(`\nOverall: ${totalSuccess}/${totalTests} endpoints accessible`, totalSuccess > 0 ? 'green' : 'red');
    
    if (totalSuccess === 0) {
        log('\n⚠️  No API endpoints are accessible. Please check:', 'red');
        log('   1. Web API is running on localhost:5005 (HTTP) or localhost:7163 (HTTPS)', 'yellow');
        log('   2. No firewall blocking the connections', 'yellow');
        log('   3. API configuration in React app (.env.local)', 'yellow');
    } else if (totalSuccess < totalTests) {
        log('\n⚠️  Some endpoints failed. This might be expected for:', 'yellow');
        log('   - Endpoints requiring authentication', 'yellow');
        log('   - POST endpoints without proper data', 'yellow');
        log('   - Admin-only endpoints', 'yellow');
    } else {
        log('\n🎉 All endpoints are accessible!', 'green');
    }
}

// Run the tests
if (require.main === module) {
    testApiConnectivity().catch(console.error);
}

module.exports = { testApiConnectivity, makeRequest };
