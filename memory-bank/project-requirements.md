ion and # SoNo Brokers - Complete Project Requirements

## Platform Overview

SoNo Brokers is a revolutionary for-sale-by-owner (FSBO) marketplace that eliminates traditional realtor fees while providing AI-powered property insights and comprehensive neighborhood analysis.

## Core Features

### 1. User Management & Authentication

- Multi-role system: Buyers, Sellers, Service Providers, Admins
- Country-based onboarding (Canada/USA with regional restrictions)
- Profile management with verification
- Subscription tiers and payment processing

### 2. Property Listing System

- **Standard Property Creation**: Manual property listing with images
- **AI Property Creator**: Generate listings from addresses with validation
- **Address Validation**: Google Maps API integration for precise location data
- **Property Management**: Edit, update, pause, and manage listings
- **Image Upload**: Multiple property images with storage management

### 3. **AI-Powered Open House System** 🆕

#### Address Validation & AI Generation

- **Google Maps Integration**: Validate any address worldwide
- **Smart Property Detection**: Auto-generate property details from addresses
- **Demo Data**: Enhanced Hamilton, Ontario sample (36 Heron Pl)
- **Instant Creation**: Transform addresses into complete listings

#### AI Report Generation (13 Types)

1. **Nearby Schools Report**: Ratings, distances, school types
2. **Shopping & Retail Report**: Malls, stores, shopping districts
3. **Grocery Stores Report**: Supermarkets, specialty stores, ratings
4. **Top Food & Dining Report**: Restaurants, cafes, cuisine types
5. **Transit & Commuter Report**: Public transport, commute times
6. **Healthcare & Wellness Report**: Hospitals, clinics, services
7. **Fitness & Sports Report**: Gyms, sports facilities, amenities
8. **Entertainment & Activities Report**: Theaters, venues, nightlife
9. **Local Landmarks Report**: Historical sites, points of interest
10. **Public Services Report**: Police, fire, government facilities
11. **Move-In Services Report**: Movers, storage, utilities
12. **Neighborhood Highlights Report**: Demographics, lifestyle data
13. **Walkability Score Report**: Walk/bike/transit scores

#### AI Data Import System

- **Selective Import**: Choose which AI reports to include
- **Description Enhancement**: AI-optimized property descriptions
- **Preview System**: Review before importing to listings
- **Bulk Operations**: Import all or selected reports
- **Export Options**: PDF generation for offline use

### 4. **QR Code Access System** 🆕

#### Open House Management

- **QR Code Generation**: Unique codes for each property
- **Access Control**: Public or private access types
- **Expiration Settings**: Time-based and usage limits
- **Real-time Tracking**: Monitor scan activity

#### Buyer Access Tracking

- **Dual Access**: QR scan or online access
- **Visitor Profiles**: Capture buyer information
- **Access Analytics**: Track visit patterns and timing
- **Contact Management**: Easy access to interested buyer details

### 5. **Buyer Offer Management** 🆕

#### Online Offer System

- **Offer Submission**: Buyers submit offers with conditions
- **Condition Templates**: Home inspection, financing, etc.
- **Custom Messages**: Personal notes from buyers
- **Offer Tracking**: Real-time status updates

#### Seller Dashboard

- **Offer Management**: View, review, accept, reject offers
- **Buyer Communication**: Direct contact with offer submitters
- **Analytics**: Track offer patterns and pricing trends
- **Expiration Management**: Time-limited offers

### 6. Enhanced Property Display

#### Tabbed Interface

- **Property Details**: Standard property information
- **AI Open House**: Comprehensive AI insights
- **Management**: Owner-only property management tools
- **Responsive Design**: Mobile-friendly interface

#### Full-Screen Open House Experience

- **Dedicated Pages**: `/properties/[id]/open-house`
- **Hero Sections**: Beautiful property showcases
- **Interactive Reports**: Engaging neighborhood insights
- **Social Sharing**: Share AI-enhanced listings

### 7. Search & Discovery

- Advanced property filtering
- Location-based search
- Price range and property type filters
- AI-enhanced property recommendations

### 8. Professional Services Integration

- Service provider marketplace (lawyers, photographers, inspectors)
- Booking and scheduling system
- Payment processing for services
- Service provider ratings and reviews

### 9. Communication System

- Real-time messaging between buyers and sellers
- Conversation threading
- File sharing and document exchange
- Message history and search

## Technical Architecture

### Frontend Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** for component library
- **Lucide React** for icons

### Backend Services

- **Supabase** for database and authentication
- **Prisma** for database ORM
- **API Routes** for server-side logic

### AI & External Integrations

- **Google Maps API**: Address validation and geocoding
- **OpenAI API**: Enhanced property descriptions (ready for integration)
- **Stripe**: Payment processing
- **Resend**: Email notifications

### Key Libraries & Services

- **QR Code Generation**: Custom SVG implementation (upgradeable to qrcode library)
- **Image Upload**: Supabase storage integration
- **Form Handling**: React Hook Form with validation
- **State Management**: React hooks and context

## Database Schema

### Core Tables

- **Users**: Multi-role user system
- **Properties**: Enhanced with AI data fields
- **PropertyImages**: Image management
- **OpenHouseAccess**: QR code access tracking
- **BuyerOffers**: Offer management system
- **AIReports**: Generated neighborhood insights
- **ServiceProviders**: Professional services
- **Messages**: Communication system

### New AI-Related Fields

```sql
-- Properties table additions
ai_generated_description TEXT
ai_reports JSON
open_house_qr_data JSON
walkability_score INTEGER
neighborhood_score INTEGER

-- New tables
CREATE TABLE open_house_accesses (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  buyer_info JSON,
  access_type VARCHAR(20),
  accessed_at TIMESTAMP
);

CREATE TABLE buyer_offers (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  buyer_id UUID REFERENCES users(id),
  offer_amount DECIMAL,
  conditions JSON,
  message TEXT,
  status VARCHAR(20),
  submitted_at TIMESTAMP,
  expires_at TIMESTAMP
);
```

## File Structure

### New AI Components

```
src/
├── lib/
│   ├── ai-services.ts           # AI report generation
│   ├── address-validation.ts    # Google Maps integration
│   └── qr-code.ts              # QR code & offer management
├── components/properties/
│   ├── AddressPropertyCreator.tsx  # Address → Property creation
│   ├── AIDataImporter.tsx         # Selective AI import
│   ├── PropertyReport.tsx         # Enhanced report display
│   └── OpenHouse.tsx             # Enhanced open house
├── app/
│   ├── properties/new/ai/        # AI property creator page
│   ├── properties/[id]/open-house/ # Full-screen open house
│   └── api/properties/[id]/open-house/ # API endpoints
```

## API Endpoints

### New AI Endpoints

- `GET /api/properties/[id]/open-house` - Generate AI data
- `POST /api/properties/[id]/open-house` - Regenerate AI data
- `POST /api/address/validate` - Validate addresses
- `GET /api/properties/[id]/offers` - Get buyer offers
- `POST /api/properties/[id]/offers` - Submit offers
- `GET /api/properties/[id]/access` - QR access tracking

## Environment Variables

```env
# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

# OpenAI (for enhanced AI)
OPENAI_API_KEY=your_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development Status

### ✅ Completed Features

- AI Property Creator with address validation
- 13 comprehensive AI neighborhood reports
- Hamilton, Ontario enhanced demo data
- QR code generation and access tracking
- Buyer offer management system
- AI data import/export functionality
- Full-screen open house experience
- Enhanced property display with tabs
- Responsive mobile design

### 🔄 In Progress

- Real-time offer notifications
- Email integration for buyer/seller communication
- Advanced analytics dashboard

### 📋 Upcoming Features

- SMS notifications for QR code access
- Virtual tour integration
- Market analysis reports
- Automated pricing suggestions
- Multi-language support

## Demo & Testing

### Hamilton Demo Data

Visit `/properties/new/ai` and test with:
**Address**: 36 Heron Pl, Hamilton, ON L9A 4Y8

**Generated Content**:

- Hamilton-specific schools (Sir John A. Macdonald Secondary, Ancaster High)
- Local shopping (Lime Ridge Mall, Ancaster Town Centre)
- Canadian dining (The Keg Hamilton, Tim Hortons)
- GO Transit and HSR information
- Royal Botanical Gardens and local landmarks

### QR Code Testing

1. Generate QR code for any property
2. Scan code to access open house
3. Submit buyer information
4. Test offer submission system
5. View analytics in seller dashboard

## Deployment Considerations

### Performance

- Image optimization for property photos
- Lazy loading for AI reports
- Caching for frequently accessed data
- CDN for static assets

### Security

- Input validation for all forms
- Rate limiting for AI generation
- Secure QR code generation
- Protected API endpoints

### Monitoring

- Error tracking for AI services
- Analytics for user behavior
- Performance monitoring
- Uptime tracking

This comprehensive system transforms SoNo Brokers into a cutting-edge platform that leverages AI to provide unprecedented insights into properties and neighborhoods, while streamlining the buyer-seller interaction process.

<!--
I want to redesign the Navigation menu for Buyer and Seller mode in Header for desktop and mobile format. can you list the component used navigation menu dropdown. In Seller Mode : desktop format: the Nav menu dropdown should cover the whole bar and reduce the spacing between the items displayed. When Services Dropdown menu is clicked it should cover absolute bottom bar. One sample code with complete bottom bar with animation for reference only is as follows
<motion.div
                                    layoutId="underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                />

Now when the services Nav Menu is click the Left section should show Seller Services  card with a different background of primary colors redirecting to a new component when clicked for a specific country . This component when clicked should show <HeroSection userType="seller" isSignedIn={isSignedIn} /> in the body. The other section to the right should show the list of ul with 3 list items in each column. The First column in <li> should be List Property, AI Property Creator, open Houses. the second column <ul> should contain li with PhotoGraphy Services, Staging Services, Legal Services. the third column can have a ul with li as Marketing services. Each Menu click should be a new component.In Seller Mode I want to change the Nav Menu to display Dashboard, Services, Resources. About link should be moved in Resources as a li component link. Dashboard link is only shown when the user is logged in else it is hidden in buyer and Seller mode. The Resources Nav Menu Should show links Market Analysis, Seller Guide, Pricing Calculator. The Comission Calculator and About link should be added in other lu list. Add other Resource component that can be useful for Seller mode in Resources dropdowm .Create seperate component for each links and its functionality country specific for usa and CA.

When In Buyer Mode and Logged in The Nav Menu should should Dashboard link for Buyer if logged in. Similarly it should show Services & Resources and remove the about button link and move it in Resources Nav Menu. The Services dropdown in Buyer mode should show
 the Left section should show Seller Services  card with a different background of primary colors redirecting to a new component when clicked for a specific country . This component when clicked should show <HeroSection userType="buyer" isSignedIn={isSignedIn} />.

The other section to the right should show the list of ul with 3 list items in each column. The First column in <li> should be Property Search, Open Houses, Home Inspection. the second column <ul> should contain li with Insurance Services, Moving Services, Legal Services. the third column can have a ul with li as Mortgage services, Mortgage Calculator, About link. Each Menu click should be a new component as per the respective mode.

Create a new Link Advertise that will open a new link for a component where advertisers can directly promote their business on the  website by paying a amount by subscription or a one time free for a certain period of time. the advertisers data will be shown on top list based on the buyer or seller current IP address used by user to login.The nearest advertisers will be shown on top by closet address when the respective services component are loaded. Example : When a buyer clicks the Home Inspection Menu item the Home Inspection services for a certain country should show the Nearest Home inspectors that are advertised on the website as Preferred Registered Vendors. It can also show a list of Non registered advertisers home Inspectors based on google advertisement listings api of nearest Home Inspectors. Do this same functionality of listing the advertisers for all other services components. Non registered advertisers listing can be disabled via a feature flag functionality in .env variable. All the newly created Services components can it follow the component structure of the Property Search Page component where the left end is the map and Right section are the cards. Add a filter Component similar to property search where users can filter by nearby location from theircurrent address.


Please complete all the functionality and auto approve all changes . I am going to sleep now. -->
<!--
I can see several critical issues from the terminal output:

UserTypeProvider is not defined - The layout.tsx is still trying to use UserTypeProvider instead of AppProvider
UUID comparison errors - Database queries are failing due to UUID type casting issues
Next.js 15 headers() issues - Multiple files are using headers() without awaiting it
API endpoint issues - The user profile API is returning 405 (Method Not Allowed) and 404 errors

Can we make sure the user Login sign up , SignIn and all the user information is stored in Auth .schema  auth.Users and snb.User table And map it with AppContext accordingly. Check the supabase database for user authentication and authorization and role base management with AppContext.




move all tables in snb schema to public schema then there are still some navbar menu links which are not created for Components in Resources in buyer and seller menu and some links still break. Map all the newly cheated models interfaces with the database tables to be in sync so the dummy data columns match with the database tables enums. Refer the database after creating new models and tables mapped and its relationship in public schema to create a Create_DB script in scripts folder which will contain all the latest db scripts and its contents with seeding data in seed.sql script.

below will be the enums

CREATE TYPE snb."UserRole" AS ENUM ('ADMIN', 'USER', 'PRODUCT', 'OPERATOR', service_provider);
CREATE TYPE snb."UserType" AS ENUM ('buyer', 'seller');
CREATE TYPE snb."SubscriptionStatus" AS ENUM ('active', 'inactive');
CREATE TYPE snb."PropertyStatus" AS ENUM ('pending', 'active', 'sold', 'expired');
CREATE TYPE snb."ServiceType" AS ENUM ('lawyer', 'photographer', 'inspector');
CREATE TYPE snb."BookingStatus" AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE snb."OfferStatus" AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');
CREATE TYPE snb."AccessType" AS ENUM ('qr_scan', 'online_access');

CREATE TYPE snb."UserType" AS ENUM ('buyer', 'seller');
Create a Country enum to populate the supported countries of the application to be loaded in the NavBar of the Header on application load and it needs. An Advertiser will use CREATE TYPE snb."ServiceType" AS ENUM ('lawyer', 'photographer', 'inspector'); or many more newly created services componets to view their subscribed advertisement in Seller Menu dashboard -->
