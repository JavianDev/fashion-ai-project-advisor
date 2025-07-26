# SoNoBrokers Scripts

This directory contains database scripts and translation management tools for the SoNoBrokers application.

## 📁 Files Overview

### 🌍 Translation Management Scripts

- **`translation-scanner.js`** - Comprehensive codebase scanning for hardcoded strings
- **`quick-i18n-check.js`** - Fast file-specific validation for development
- **`ai-translator.js`** - AI-powered translation generation and validation
- **`build-time-i18n-check.js`** - Build-time validation and protection

### 🗄️ Database Scripts

- **`create_db.sql`** - Complete database schema creation script
- **`seed.sql`** - Sample data for development and testing
- **`migrate_to_latest.sql`** - Migration script for existing databases
- **`migrate_to_public.sql`** - Legacy migration from SNB schema to public

## 🚀 Quick Start

### 🌍 Translation Management

#### **Immediate Actions**

```bash
# Auto-generate missing translations
npm run i18n:translate

# Check specific file for hardcoded strings
npm run i18n:quick src/components/YourComponent.tsx

# Full codebase scan
npm run i18n:scan

# Validate translation coverage
npm run i18n:validate
```

#### **Development Workflow**

- **Pre-commit hooks** automatically check staged files
- **Build-time validation** prevents untranslated content in production
- **VS Code tasks** provide quick access to translation tools
- **AI assistance** auto-generates missing translations

### 🗄️ Database Setup

#### **For New Database Setup**

```sql
-- 1. Run the complete schema creation
\i scripts/create_db.sql

-- 2. Insert sample data (optional)
\i scripts/seed.sql
```

### For Existing Database Migration

```sql
-- Run the migration script to update to latest schema
\i scripts/migrate_to_latest.sql
```

## 📊 Database Schema Overview

### Core Tables

- **User** - User accounts with role-based access
- **Property** - Real estate listings
- **PropertyImage** - Property photos and media
- **BuyerProfile** / **SellerProfile** - User-specific profiles

### Service Provider System

- **ServiceProvider** - Service provider profiles
- **ServiceBooking** - Booking management
- **Advertiser** - Paid advertising accounts
- **AdvertiserSubscription** - Subscription management

### Communication & Analytics

- **Conversation** / **Message** - Messaging system
- **Notifications** - User notifications
- **UserActivity** - Activity tracking
- **PropertyAnalytics** - Property view statistics

### Stripe Integration

- **stripe_customers** - Stripe customer mapping
- **stripe_payments** - Payment tracking
- **stripe_invoices** - Invoice management
- **stripe_products** / **stripe_prices** - Product catalog

## 🔧 Enums and Types

### User Management

```sql
UserRole: 'ADMIN', 'USER', 'PRODUCT', 'OPERATOR', 'service_provider'
UserType: 'buyer', 'seller'
```

### Property Management

```sql
PropertyStatus: 'pending', 'active', 'sold', 'expired'
```

### Service Provider System

```sql
ServiceType: 'lawyer', 'photographer', 'inspector', 'appraiser',
             'home_inspector', 'mortgage_broker', 'insurance_agent',
             'contractor', 'cleaner', 'stager', 'marketing_agency'
BookingStatus: 'pending', 'confirmed', 'completed', 'cancelled'
```

### Advertiser System

```sql
AdvertiserPlan: 'basic', 'premium', 'enterprise'
AdvertiserStatus: 'pending', 'active', 'suspended', 'cancelled'
```

### General

```sql
SubscriptionStatus: 'active', 'inactive', 'cancelled', 'past_due', 'unpaid'
OfferStatus: 'pending', 'reviewed', 'accepted', 'rejected'
AccessType: 'qr_scan', 'online_access'
Country: 'ca', 'us'
```

## 🔐 Default Admin User

The seed script creates a default admin user:

- **Email**: `javian.picardo.sonobrokers@gmail.com`
- **Role**: `ADMIN`
- **UserType**: `buyer`

## 📋 Sample Data

The seed script includes:

- **6 sample users** (admin, buyers, sellers, service providers)
- **3 service providers** (lawyer, photographer, inspector)
- **3 advertisers** with different subscription plans
- **5 sample properties** with realistic data
- **Role permissions** for all user types

## 🔄 Migration Notes

### From SNB Schema to Public

If migrating from the old SNB schema:

1. Run `migrate_to_public.sql` first
2. Then run `create_db.sql`
3. Finally run `seed.sql` if needed

### Schema Synchronization

The scripts ensure:

- ✅ Prisma schema matches database structure
- ✅ All foreign key constraints are properly set
- ✅ Indexes are optimized for performance
- ✅ Triggers are set up for `updatedAt` fields

## 🎯 Key Features

### Role-Based Access Control

- **Admin**: Full system access
- **User**: Standard buyer/seller operations
- **Product**: Property management
- **Operator**: Service operations
- **Service Provider**: Service-specific access

### Advertiser Prioritization

- **Enterprise**: Highest priority in search results
- **Premium**: Medium priority with enhanced features
- **Basic**: Standard advertising features

### Geographic Support

- **PostGIS**: Enabled for location-based queries
- **Country Support**: Canada (ca) and USA (us)
- **Location Indexing**: Optimized for proximity searches

## 🛠️ Maintenance

### Regular Tasks

1. **Backup**: Regular database backups
2. **Analytics**: Monitor PropertyAnalytics for insights
3. **Cleanup**: Archive old conversations and notifications
4. **Optimization**: Review and update indexes as needed

### Performance Monitoring

Key indexes to monitor:

- User email and auth lookups
- Property location and price queries
- Service provider type and area searches
- Advertiser plan and status filters

## 📞 Support

For database-related issues:

1. Check the migration logs for errors
2. Verify foreign key constraints
3. Ensure all required extensions are installed
4. Contact the development team for complex issues

---

**Last Updated**: December 2024  
**Schema Version**: 2.0 (Public Schema with Advertiser Support)
