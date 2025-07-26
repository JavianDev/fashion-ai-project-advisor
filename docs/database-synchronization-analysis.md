# Database Synchronization Analysis

## Overview

This document analyzes the current database schema against the new React requirements and Web API models, identifying missing tables, stored procedures, and functions required for the Contact Sharing and Property Scheduling features.

## Current Status: ❌ **DATABASE NOT SYNCHRONIZED**

### Missing Components Identified

#### 🚫 **Missing Tables**
1. **ContactShare** - Core table for buyer-seller contact sharing
2. **SellerAvailability** - Seller weekly availability schedules
3. **PropertyVisitSchedule** - Property visit requests and confirmations
4. **PropertyQrCode** - QR codes for visit verification
5. **VisitVerification** - Security log of visit verifications

#### 🚫 **Missing Enums**
1. **ContactShareType** - Contact sharing types (ContactRequest, PropertyOffer, etc.)
2. **ContactShareStatus** - Status tracking (Sent, Viewed, Responded, etc.)
3. **VisitStatus** - Visit scheduling status (Pending, Confirmed, etc.)
4. **VisitType** - Visit types (InPerson, Virtual, SelfGuided)
5. **VerificationMethod** - Verification methods (QrCode, SellerPresent, etc.)

#### 🚫 **Missing Stored Procedures**
1. **sp_create_contact_share** - Create contact share with validation
2. **sp_get_contact_shares** - Get contact shares with pagination/filtering
3. **sp_update_contact_share_status** - Update contact share status
4. **sp_create_seller_availability** - Create seller availability
5. **sp_create_visit_schedule** - Create visit schedule with validation

#### 🚫 **Missing Functions**
1. **fn_get_contact_share_stats** - Contact sharing statistics
2. **fn_get_visit_stats** - Visit scheduling statistics
3. **fn_can_user_access_contact_share** - Access control validation
4. **fn_can_user_manage_property_scheduling** - Property management validation

## Web API Models vs Database Schema

### ✅ **Existing Tables (Already Synchronized)**

| Web API Model | Database Table | Status |
|---------------|----------------|--------|
| User | "User" | ✅ Synchronized |
| Property | "Property" | ✅ Synchronized |
| PropertyImage | "PropertyImage" | ✅ Synchronized |
| BuyerOffer | "BuyerOffer" | ✅ Synchronized |
| Conversation | "Conversation" | ✅ Synchronized |
| Message | "Message" | ✅ Synchronized |
| PropertyViewing | "PropertyViewing" | ✅ Synchronized |

### ❌ **Missing Tables (Need Creation)**

| Web API Model | Database Table | Status | Priority |
|---------------|----------------|--------|----------|
| ContactShare | "ContactShare" | ❌ Missing | **HIGH** |
| ContactShareResponse | "ContactShare" | ❌ Missing | **HIGH** |
| SellerAvailability | "SellerAvailability" | ❌ Missing | **HIGH** |
| PropertyVisitSchedule | "PropertyVisitSchedule" | ❌ Missing | **HIGH** |
| PropertyQrCode | "PropertyQrCode" | ❌ Missing | **MEDIUM** |
| VisitVerification | "VisitVerification" | ❌ Missing | **MEDIUM** |

## Required Database Changes

### 1. **Contact Sharing System Tables**

#### ContactShare Table
```sql
CREATE TABLE public."ContactShare" (
  id TEXT PRIMARY KEY,
  "propertyId" UUID NOT NULL,
  "buyerId" UUID NOT NULL,
  "sellerId" UUID NOT NULL,
  "buyerName" TEXT NOT NULL,
  "buyerEmail" TEXT NOT NULL,
  "buyerPhone" TEXT,
  message TEXT,
  "shareType" "ContactShareType" NOT NULL,
  "offerAmount" DECIMAL(12,2),
  "preferredVisitDate" DATE,
  "preferredVisitTime" TIME,
  status "ContactShareStatus" NOT NULL,
  "sellerResponse" TEXT,
  "emailSent" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "respondedAt" TIMESTAMP WITH TIME ZONE,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Business Logic Requirements:**
- Prevent duplicate contact shares within 24 hours
- Track email delivery status
- Support 4 different share types
- Automatic timestamp management

### 2. **Property Scheduling System Tables**

#### SellerAvailability Table
```sql
CREATE TABLE public."SellerAvailability" (
  id TEXT PRIMARY KEY,
  "propertyId" UUID NOT NULL,
  "sellerId" UUID NOT NULL,
  "dayOfWeek" INTEGER NOT NULL CHECK ("dayOfWeek" >= 0 AND "dayOfWeek" <= 6),
  "startTime" TIME NOT NULL,
  "endTime" TIME NOT NULL,
  "isAvailable" BOOLEAN DEFAULT TRUE,
  notes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### PropertyVisitSchedule Table
```sql
CREATE TABLE public."PropertyVisitSchedule" (
  id TEXT PRIMARY KEY,
  "propertyId" UUID NOT NULL,
  "buyerId" UUID NOT NULL,
  "sellerId" UUID NOT NULL,
  "contactShareId" TEXT NOT NULL,
  "requestedDate" DATE NOT NULL,
  "requestedTime" TIME NOT NULL,
  "confirmedDate" DATE,
  "confirmedTime" TIME,
  status "VisitStatus" NOT NULL DEFAULT 'Pending',
  "visitType" "VisitType" NOT NULL DEFAULT 'InPerson',
  "buyerNotes" TEXT,
  "sellerNotes" TEXT,
  "qrCodeGenerated" BOOLEAN DEFAULT FALSE,
  "visitVerified" BOOLEAN DEFAULT FALSE,
  "calendarInviteSent" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. **QR Code and Verification Tables**

#### PropertyQrCode Table
```sql
CREATE TABLE public."PropertyQrCode" (
  id TEXT PRIMARY KEY,
  "propertyId" UUID NOT NULL,
  "sellerId" UUID NOT NULL,
  "qrCodeData" TEXT NOT NULL,
  "qrCodeImage" TEXT NOT NULL,
  "isActive" BOOLEAN DEFAULT TRUE,
  "expiresAt" TIMESTAMP WITH TIME ZONE,
  "scanCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### VisitVerification Table
```sql
CREATE TABLE public."VisitVerification" (
  id TEXT PRIMARY KEY,
  "visitScheduleId" TEXT NOT NULL,
  "propertyId" UUID NOT NULL,
  "buyerId" UUID NOT NULL,
  method "VerificationMethod" NOT NULL,
  "qrCodeScanned" TEXT,
  "deviceInfo" TEXT,
  "ipAddress" TEXT,
  location TEXT,
  "isValid" BOOLEAN DEFAULT TRUE,
  "verifiedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## React Component Requirements

### Contact Sharing Components
- **ContactShareButton**: Requires ContactShare table
- **ContactShareModal**: Requires ContactShare table with all share types
- **ContactSharesDashboard**: Requires ContactShare table with pagination
- **PropertyQuickActions**: Requires ContactShare table

### Property Scheduling Components
- **SellerAvailabilityManager**: Requires SellerAvailability table
- **CalendarScheduling**: Requires SellerAvailability and PropertyVisitSchedule tables
- **PropertyQrCodeManager**: Requires PropertyQrCode table
- **VisitVerificationScanner**: Requires VisitVerification table

## API Endpoint Requirements

### Contact Sharing API
- `POST /api/sonobrokers/contact-sharing` → sp_create_contact_share
- `GET /api/sonobrokers/contact-sharing` → sp_get_contact_shares
- `PUT /api/sonobrokers/contact-sharing/{id}/respond` → sp_update_contact_share_status
- `GET /api/sonobrokers/contact-sharing/stats` → fn_get_contact_share_stats

### Property Scheduling API
- `POST /api/sonobrokers/property-scheduling/availability` → sp_create_seller_availability
- `POST /api/sonobrokers/property-scheduling/visits` → sp_create_visit_schedule
- `GET /api/sonobrokers/property-scheduling/stats` → fn_get_visit_stats

## Migration Strategy

### Phase 1: Core Tables (HIGH Priority)
1. ✅ Create missing enums
2. ✅ Create ContactShare table
3. ✅ Create SellerAvailability table
4. ✅ Create PropertyVisitSchedule table
5. ✅ Add indexes for performance

### Phase 2: QR Code System (MEDIUM Priority)
1. ✅ Create PropertyQrCode table
2. ✅ Create VisitVerification table
3. ✅ Add security indexes

### Phase 3: Stored Procedures (HIGH Priority)
1. ✅ Create contact sharing procedures
2. ✅ Create property scheduling procedures
3. ✅ Create analytics functions
4. ✅ Create utility functions

### Phase 4: Testing and Validation
1. ✅ Test all stored procedures
2. ✅ Validate foreign key constraints
3. ✅ Test Web API integration
4. ✅ Verify React component functionality

## Performance Considerations

### Indexes Required
```sql
-- Contact Share indexes
CREATE INDEX "idx_contactshare_property" ON "ContactShare"("propertyId");
CREATE INDEX "idx_contactshare_buyer" ON "ContactShare"("buyerId");
CREATE INDEX "idx_contactshare_seller" ON "ContactShare"("sellerId");
CREATE INDEX "idx_contactshare_status" ON "ContactShare"(status);

-- Property Scheduling indexes
CREATE INDEX "idx_selleravailability_property" ON "SellerAvailability"("propertyId");
CREATE INDEX "idx_propertyvisitschedule_property" ON "PropertyVisitSchedule"("propertyId");
CREATE INDEX "idx_propertyvisitschedule_requested_date" ON "PropertyVisitSchedule"("requestedDate");
```

### Query Optimization
- Use stored procedures for complex operations
- Implement pagination for large datasets
- Add proper WHERE clause indexes
- Use EXPLAIN ANALYZE for query performance

## Security Considerations

### Access Control
- Buyers can only access their own contact shares
- Sellers can only access contact shares for their properties
- Property owners can only manage their property scheduling
- QR codes have expiration dates and scan limits

### Data Validation
- Prevent duplicate contact shares within 24 hours
- Validate seller availability before scheduling visits
- Encrypt QR code data with signatures
- Log all visit verifications for security

## Migration Scripts

### 1. **missing_tables_migration.sql**
- ✅ Creates all missing tables
- ✅ Creates all missing enums
- ✅ Adds proper indexes
- ✅ Sets up foreign key constraints

### 2. **stored_procedures_functions.sql**
- ✅ Creates all required stored procedures
- ✅ Creates analytics functions
- ✅ Creates utility functions
- ✅ Implements business logic validation

## Verification Steps

### 1. **Run Migration Scripts**
```bash
# Connect to your Supabase database
psql "postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Run migrations
\i missing_tables_migration.sql
\i stored_procedures_functions.sql
```

### 2. **Verify Tables Created**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('ContactShare', 'SellerAvailability', 'PropertyVisitSchedule', 'PropertyQrCode', 'VisitVerification');
```

### 3. **Test Stored Procedures**
```sql
-- Test contact share creation
SELECT * FROM sp_create_contact_share(
  'property-uuid'::UUID, 'buyer-uuid'::UUID, 'seller-uuid'::UUID,
  'Test Buyer', 'test@example.com', NULL, 'Test message', 'ContactRequest'
);
```

## Next Steps

1. **✅ Execute Migration Scripts**: Run the provided migration scripts
2. **✅ Update Web API**: Ensure DapperDbContext can access new tables
3. **✅ Test API Endpoints**: Verify all endpoints work with new schema
4. **✅ Test React Components**: Ensure frontend components work with API
5. **✅ Performance Testing**: Validate query performance with indexes

## Conclusion

The database is currently **NOT SYNCHRONIZED** with the Web API models and React requirements. The missing tables, stored procedures, and functions are critical for the Contact Sharing and Property Scheduling features to work properly.

**Action Required**: Execute the provided migration scripts to bring the database up to date with the application requirements.
