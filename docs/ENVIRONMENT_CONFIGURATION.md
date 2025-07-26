# 🔧 **SoNoBrokers Environment Configuration**

## **Environment Files Overview**

| File | Purpose | Usage |
|------|---------|-------|
| `.env` | Base configuration | Default values for all environments |
| `.env.example` | Template file | Example configuration for new developers |
| `.env.development.local` | Development | Local development with debug features |
| `.env.staging` | Staging | Pre-production testing environment |
| `.env.production.local` | Production | Live production environment |

---

## **🚀 Feature Flags Configuration**

### **Core Feature Flags**

| Flag | Development | Staging | Production | Description |
|------|-------------|---------|------------|-------------|
| `NEXT_PUBLIC_ENABLE_GOOGLE_PROVIDERS` | `true` | `true` | `true` | Enable Google Places API for service providers |
| `NEXT_PUBLIC_LAUNCH_MODE` | `false` | `false` | `false` | Show "launching soon" page |
| `NEXT_PUBLIC_ENABLE_LANGUAGE_SELECTOR` | `false` | `false` | `false` | Show language dropdown in header |
| `NEXT_PUBLIC_ENABLE_REGION_TESTER` | `true` | `true` | `false` | Show region testing component |
| `NEXT_PUBLIC_ENABLE_ARCHIVE_MIGRATION` | `true` | `false` | `false` | Enable archive migration features |

### **Development Features**

| Flag | Development | Staging | Production | Description |
|------|-------------|---------|------------|-------------|
| `NEXT_PUBLIC_DEV_MODE` | `true` | `false` | `false` | Enable development mode features |
| `NEXT_PUBLIC_SHOW_DEBUG_INFO` | `true` | `true` | `false` | Show debug information |
| `NEXT_PUBLIC_ENABLE_HOT_RELOAD` | `true` | `false` | `false` | Enable hot reload features |
| `NEXT_PUBLIC_ENABLE_TEST_DATA` | `true` | `true` | `false` | Use test data instead of real data |
| `NEXT_PUBLIC_MOCK_SERVICES` | `false` | `false` | `false` | Mock external service calls |

### **Component Features**

| Flag | Development | Staging | Production | Description |
|------|-------------|---------|------------|-------------|
| `NEXT_PUBLIC_ENABLE_PROPERTY_FAVORITES` | `true` | `true` | `true` | Enable property favorites functionality |
| `NEXT_PUBLIC_ENABLE_OPEN_HOUSE_FAVORITES` | `true` | `true` | `true` | Enable open house favorites |
| `NEXT_PUBLIC_ENABLE_SERVICE_BOOKING` | `true` | `true` | `true` | Enable service provider booking |

### **Service Features**

| Flag | Development | Staging | Production | Description |
|------|-------------|---------|------------|-------------|
| `NEXT_PUBLIC_ENABLE_AI_PROPERTY_CREATOR` | `true` | `true` | `true` | Enable AI property creation tool |
| `NEXT_PUBLIC_ENABLE_MORTGAGE_CALCULATOR` | `true` | `true` | `true` | Enable mortgage calculator |
| `NEXT_PUBLIC_ENABLE_COMMISSION_CALCULATOR` | `true` | `true` | `true` | Enable commission calculator |

### **Authentication Features**

| Flag | Development | Staging | Production | Description |
|------|-------------|---------|------------|-------------|
| `NEXT_PUBLIC_ENABLE_ROLE_BASED_AUTH` | `true` | `true` | `true` | Enable role-based authentication |
| `NEXT_PUBLIC_ADMIN_EMAIL` | `javian.picardo.sonobrokers@gmail.com` | Same | Same | Admin user email |

---

## **🌍 Country Configuration**

### **Supported Countries**

```bash
NEXT_PUBLIC_SUPPORTED_COUNTRIES=CA,US,UAE
NEXT_PUBLIC_DEFAULT_COUNTRY=CA
```

### **Country-Specific Features**

| Country | Language Support | Currency | Legal Framework |
|---------|------------------|----------|-----------------|
| **CA** | English, French | CAD | Canadian Real Estate Law |
| **US** | English, Spanish | USD | US State Real Estate Laws |
| **UAE** | English, Arabic | AED | UAE Property Law |

---

## **🔐 Authentication Configuration**

### **Clerk Configuration**

```bash
# Development/Staging
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Production (when ready)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
# CLERK_SECRET_KEY=sk_live_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

---

## **💳 Payment Configuration**

### **Stripe Configuration**

```bash
# Development/Staging (Test Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Production (Live Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## **🗄️ Database Configuration**

### **Supabase Configuration**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://yfznlsisxsnymkvydzha.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres.yfznlsisxsnymkvydzha:password@aws-0-ca-central-1.pooler.supabase.com:5432/postgres
```

---

## **🌐 External Services**

### **Mapbox Configuration**

```bash
NEXT_PUBLIC_MAPBOX_API_KEY=pk.eyJ1IjoiamF2aWFucGljYXJkbzMzIiwiYSI6ImNtYjY4ZGRyazBiaWYybHEyMWpnNGN4cDQifQ...
```

### **Google Places API**

```bash
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

### **Resend Email**

```bash
RESEND_API_KEY=re_H7U9GBDe_2D8FiBaiP6A59v5YHuHTXKei
```

### **SoNoBrokers Web API Configuration (Updated December 2024)**

```bash
# API Base URLs
NEXT_PUBLIC_API_BASE_URL=http://localhost:5005
NEXT_PUBLIC_API_BASE_URL_HTTPS=https://localhost:7163

# API Configuration
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3
NEXT_PUBLIC_API_RETRY_DELAY=1000

# API Features
NEXT_PUBLIC_ENABLE_API_CACHING=true
NEXT_PUBLIC_ENABLE_API_LOGGING=true
NEXT_PUBLIC_ENABLE_API_METRICS=true

# Controller Architecture (New)
NEXT_PUBLIC_ENABLE_CORE_CONTROLLERS=true
NEXT_PUBLIC_ENABLE_USER_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CLERK_WEBHOOKS=true
```

#### **API Endpoints Structure**

| Controller Type | Base Path | Description |
|----------------|-----------|-------------|
| **Core Controllers** | `/api/core/` | System-level operations |
| **SoNoBrokers Controllers** | `/api/sonobrokers/` | Business logic operations |
| **Health Check** | `/health` | Application health monitoring |
| **API Documentation** | `/scalar/v1` | Interactive API documentation |

#### **Environment-Specific API URLs**

| Environment | HTTP URL | HTTPS URL |
|-------------|----------|-----------|
| **Development** | `http://localhost:5005` | `https://localhost:7163` |
| **Staging** | `https://staging-api.sonobrokers.com` | `https://staging-api.sonobrokers.com` |
| **Production** | `https://api.sonobrokers.com` | `https://api.sonobrokers.com` |

---

## **🔧 Application URLs**

| Environment | URL | Purpose |
|-------------|-----|---------|
| **Development** | `http://localhost:3000` | Local development |
| **Staging** | `https://staging.sonobrokers.com` | Pre-production testing |
| **Production** | `https://www.sonobrokers.com` | Live application |

---

## **📋 Environment Setup Instructions**

### **1. Development Setup**

```bash
# Copy example file
cp .env.example .env

# Update with your local values
# Use .env.development.local for local overrides
```

### **2. Staging Deployment**

```bash
# Use .env.staging file
# Ensure test API keys are used
# Enable debug features for testing
```

### **3. Production Deployment**

```bash
# Use .env.production.local file
# Ensure live API keys are used
# Disable all debug features
# Enable analytics and error reporting
```

---

## **🚨 Security Notes**

1. **Never commit actual API keys** to version control
2. **Use test keys** for development and staging
3. **Rotate keys regularly** in production
4. **Use environment-specific keys** for each service
5. **Monitor API usage** and set up alerts

---

## **🔍 Feature Flag Usage Examples**

### **In Components**

```typescript
// Check if language selector should be shown
const isLanguageSelectorEnabled = process.env.NEXT_PUBLIC_ENABLE_LANGUAGE_SELECTOR === 'true';

// Check if region tester should be available
const showRegionTester = process.env.NEXT_PUBLIC_ENABLE_REGION_TESTER === 'true';

// Check if in development mode
const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
```

### **In Pages**

```typescript
// Check if feature is enabled before rendering
if (process.env.NEXT_PUBLIC_ENABLE_AI_PROPERTY_CREATOR === 'true') {
  return <AIPropertyCreator />
}
```

---

## **📊 Monitoring & Analytics**

### **Production Only Features**

```bash
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true
NEXT_PUBLIC_STAGING_MODE=false
```

### **Development/Staging Features**

```bash
NEXT_PUBLIC_ENABLE_TEST_DATA=true
NEXT_PUBLIC_SHOW_DEBUG_INFO=true
NEXT_PUBLIC_STAGING_MODE=true
```
