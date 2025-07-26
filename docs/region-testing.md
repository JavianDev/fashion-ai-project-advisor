# Region Testing Guide

This guide explains how to test the region detection functionality in the SoNoBrokers application.

**📋 Related Documentation:**

- [Application Flow Rules with AppContext](./APPLICATION_FLOW_RULES.md) - Complete application flow and routing rules
- [Role-Based Authentication](./ROLE_BASED_AUTH.md) - Role and permission management
- [Dynamic Enums](./dynamic-enums.md) - Database-driven enum system

## Integration with Application Flow

Region testing is a crucial part of the [Application Flow Rules](./APPLICATION_FLOW_RULES.md) system, allowing developers to:

1. **Test Country-specific Routing**: Verify users are routed to correct country dashboards
2. **Validate Geolocation Logic**: Test IP detection and fallback mechanisms
3. **Test Role-based Features**: Ensure role-specific features work across countries
4. **Verify Error Handling**: Test unsupported region handling

## Overview

The RegionCheck component handles automatic region detection and routing based on user location. It supports:

- **Supported Regions**: US, CA (Canada)
- **Localhost Default**: Canada (CA)
- **Testing Overrides**: Via localStorage for development

## Testing Methods

### 1. Visual Testing Tool (Development Only)

In development mode, you can access the Region Tester at `/region-tester` or click the "🧪 Region Tester" button in the header. This provides:

- **Current Status**: Shows current country and test overrides
- **Supported Region Tests**:
  - 🇨🇦 Test Canada (CA)
  - 🇺🇸 Test United States (US)
- **Unsupported Region Tests**:
  - 🇫🇷 Test France (FR)
  - 🇬🇧 Test United Kingdom (GB)
  - 🇩🇪 Test Germany (DE)
  - 🇯🇵 Test Japan (JP)
- **Clear Options**:
  - 🧹 Clear Test Override: Removes test override only
  - 🗑️ Clear All Data: Removes all region data
- **Auto-redirect**: After clicking any button, you'll be redirected to the home page to see the effect

### 2. Browser Console Commands

You can also test via browser console:

```javascript
// Test supported regions
localStorage.setItem("testCountry", "CA"); // Test Canada
localStorage.setItem("testCountry", "US"); // Test US

// Test unsupported regions
localStorage.setItem("testCountry", "FR"); // Test France
localStorage.setItem("testCountry", "GB"); // Test UK
localStorage.setItem("testCountry", "DE"); // Test Germany

// Clear testing
localStorage.removeItem("testCountry");

// Reset everything
localStorage.removeItem("testCountry");
localStorage.removeItem("userCountry");

// Check current values
console.log("Test Country:", localStorage.getItem("testCountry"));
console.log("User Country:", localStorage.getItem("userCountry"));
```

### 3. Expected Behavior

#### Supported Regions (US, CA)

- User is redirected to `/us/` or `//ca/` + current path
- Application functions normally
- Region-specific content is displayed

#### Unsupported Regions (FR, GB, DE, etc.)

- User is redirected to `/unsupported-region?country=XX`
- Shows unsupported region message
- User can still access the application but with limited functionality

#### Localhost Development

- Automatically defaults to Canada (CA)
- Console message: "🏠 Localhost detected: Defaulting to Canada"
- Redirects to `/country/ca/` + current path

#### Testing Mode

- Takes precedence over all other detection methods
- Console message: "🧪 Testing mode: Using country override 'XX'"
- Allows testing of any country code

## Testing Scenarios

### Scenario 1: Test Supported Region

1. Open browser console
2. Run: `localStorage.setItem('testCountry', 'US')`
3. Refresh page
4. Should redirect to `http://localhost:3000/us/` assuming we are on local environment.

### Scenario 2: Test Unsupported Region

1. Open browser console
2. Run: `localStorage.setItem('testCountry', 'FR')`
3. Refresh page
4. Should redirect to `/unsupported-region?country=FR`

### Scenario 3: Clear Testing

1. Open browser console
2. Run: `localStorage.removeItem('testCountry')`
3. Refresh page
4. Should use localhost default (CA) or real geolocation

### Scenario 4: Reset Everything

1. Open browser console
2. Run: `localStorage.clear()`
3. Refresh page
4. Should start fresh with localhost default

## Development Notes

- The RegionTester is available as a separate page at `/region-tester` in development mode
- A "🧪 Region Tester" button appears in the header during development
- Testing overrides persist until manually cleared
- Localhost always defaults to Canada for consistent development experience
- Console messages help track which detection method is being used
- After clicking any test button, you'll be redirected to the home page to see the effect

## Troubleshooting

### Issue: Stuck in redirect loop

**Solution**: Clear all localStorage data

```javascript
localStorage.removeItem("testCountry");
localStorage.removeItem("userCountry");
```

### Issue: Test override not working

**Solution**: Ensure you're refreshing the page after setting the test country

### Issue: RegionTester not accessible

**Solution**:

- Ensure you're in development mode (`npm run dev`)
- Navigate to `/region-tester` or click the "🧪 Region Tester" button in the header
- The page is only available in development mode

## Production Behavior

In production:

- No RegionTester page or button
- No console testing messages
- Real geolocation API is used
- Fallback to Canada on errors
