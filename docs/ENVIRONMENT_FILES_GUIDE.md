# Environment Files Guide

## 📁 **Next.js Environment File Architecture**

SoNoBrokers follows the standard Next.js environment file hierarchy for proper configuration management across different environments.

### **📋 File Structure**

```
.env                    # ✅ Default values for all environments (committed)
.env.local              # ✅ Local overrides for all environments (gitignored)
.env.development        # ✅ Development-specific values (committed)
.env.development.local  # ✅ Local development overrides (gitignored)
.env.production         # ✅ Production-specific values (committed)
.env.production.local   # ✅ Local production overrides (gitignored)
.env.example            # ✅ Example file for documentation (committed)
```

### **🔄 Loading Priority (Highest to Lowest)**

1. **`.env.development.local`** ← **HIGHEST** (local dev overrides)
2. **`.env.local`** ← (local overrides for all environments)
3. **`.env.development`** ← (development defaults)
4. **`.env`** ← **LOWEST** (global defaults)

_Note: In production, `.env.production.local` and `.env.production` replace the development equivalents._

## 📄 **File Purposes**

### **`.env` (Global Defaults)**

- Contains default values that work across all environments
- Safe for production use
- **Committed to Git**
- Example: `NEXT_PUBLIC_LAUNCH_MODE=true` (production default)

### **`.env.development` (Development Defaults)**

- Contains development-specific settings
- Shared across all developers
- **Committed to Git**
- Example: `NEXT_PUBLIC_DEV_MODE=true`, `NEXT_PUBLIC_ENABLE_REGION_TESTER=true`

### **`.env.production` (Production Defaults)**

- Contains production-specific settings
- Used in staging and production environments
- **Committed to Git**
- Example: `NEXT_PUBLIC_LAUNCH_MODE=true`, `NEXT_PUBLIC_DEV_MODE=false`

### **`.env.development.local` (Local Dev Overrides)**

- Personal development overrides
- **Gitignored** - never committed
- Example: Override launch mode for local testing

### **`.env.production.local` (Local Production Overrides)**

- Production deployment secrets
- **Gitignored** - never committed
- Contains actual API keys, database URLs, etc.

### **`.env.local` (Local Overrides for All Environments)**

- Local overrides that apply to all environments
- **Gitignored** - never committed
- Useful for local database connections, debugging flags

## 🔧 **Configuration Examples**

### **Development Workflow**

```bash
# Developer wants to test launch mode locally
# Add to .env.development.local:
NEXT_PUBLIC_LAUNCH_MODE=true

# Developer wants to use local database
# Add to .env.local:
DATABASE_URL=postgresql://localhost:5432/sonobrokers_local
```

### **Production Deployment**

```bash
# Production secrets in .env.production.local:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
DATABASE_URL=postgresql://production-db-url
RESEND_API_KEY=re_production_key
```

## 🚨 **Security Best Practices**

### **✅ Safe to Commit**

- `.env` - Global defaults (no secrets)
- `.env.development` - Development defaults (test keys only)
- `.env.production` - Production defaults (no actual secrets)
- `.env.example` - Documentation template

### **❌ Never Commit**

- `.env.local` - Local overrides
- `.env.development.local` - Local dev overrides
- `.env.production.local` - Production secrets

### **🔐 Secret Management**

- Use test/development keys in committed files
- Store production secrets in `.env.production.local`
- Use environment variables in CI/CD for deployment
- Never hardcode secrets in source code

## 🚩 **Feature Flags Reference**

| Variable                               | Default | Description                                                  |
| -------------------------------------- | ------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_LAUNCH_MODE`              | `true`  | Enable/disable launch mode for the application               |
| `NEXT_PUBLIC_ENABLE_LANGUAGE_SELECTOR` | `false` | Show/hide language selector in header                        |
| `NEXT_PUBLIC_ENABLE_REGION_TESTER`     | `false` | Enable region testing tools (dev only)                       |
| `NEXT_PUBLIC_ENABLE_ARCHIVE_MIGRATION` | `false` | Enable archive migration tools (dev only)                    |
| `NEXT_PUBLIC_SHOW_CONCIERGE_SERVICES`  | `false` | Show/hide concierge services in navigation and services page |
| `NEXT_PUBLIC_ENABLE_GOOGLE_PROVIDERS`  | `true`  | Enable Google OAuth providers                                |

### **🔧 Feature Flag Usage**

```bash
# Enable concierge services for testing
NEXT_PUBLIC_SHOW_CONCIERGE_SERVICES=true

# Disable launch mode for development
NEXT_PUBLIC_LAUNCH_MODE=false

# Enable region testing tools
NEXT_PUBLIC_ENABLE_REGION_TESTER=true
```

## 🎯 **Common Use Cases**

### **1. Local Development**

```bash
# Override launch mode for testing
echo "NEXT_PUBLIC_LAUNCH_MODE=false" >> .env.development.local

# Use local database
echo "DATABASE_URL=postgresql://localhost:5432/local_db" >> .env.local
```

### **2. Feature Testing**

```bash
# Enable experimental features locally
echo "NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES=true" >> .env.local
```

### **3. Production Deployment**

```bash
# Set production secrets (never commit this file)
cat > .env.production.local << EOF
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_actual_key
CLERK_SECRET_KEY=sk_live_actual_secret
DATABASE_URL=postgresql://prod-db-url
RESEND_API_KEY=re_actual_production_key
EOF
```

## 🔍 **Troubleshooting**

### **Issue: Environment variable not loading**

1. Check file naming (must start with `.env`)
2. Verify loading priority (local files override defaults)
3. Restart development server after changes
4. Check for typos in variable names

### **Issue: Wrong environment being used**

1. Check `NODE_ENV` value
2. Verify correct `.env.{environment}` file exists
3. Check loading priority order

### **Issue: Secrets exposed in Git**

1. Verify `.gitignore` includes `.env*.local`
2. Remove committed secrets immediately
3. Rotate exposed keys/secrets
4. Use `git filter-branch` to remove from history if needed

## 📚 **Related Documentation**

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Application Flow Architecture](./APPLICATION_FLOW_ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

---

**Last Updated**: June 19, 2025
