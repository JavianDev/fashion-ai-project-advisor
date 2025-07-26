# SonoBrokers Platform - Project Brief

## Problem Statement
The traditional real estate market relies heavily on realtors as intermediaries, leading to high commission fees and a complex buying/selling process. Home sellers and buyers need a more direct, cost-effective alternative that still provides essential legal and professional support services.

## Key Value Proposition
SonoBrokers offers a commission-free platform for private property sales with integrated professional services (legal, photography, inspection) on-demand. This creates a transparent marketplace that significantly reduces transaction costs while maintaining service quality and legal compliance.

## Target Audience
- Property sellers seeking to avoid realtor commission fees
- Home buyers looking for direct contact with sellers and lower property prices
- First-time homebuyers who need guidance but want cost savings
- Real estate service providers (lawyers, photographers, inspectors)
- Property investors looking for direct deals

## Technical Vision
A Next.js React web application with Tailwind CSS built on the MicroSaaS Fast framework. The platform will be cloud-native with serverless architecture leveraging Supabase (PostgreSQL) for data persistence, Clerk.com for authentication, Stripe for payments, Make.com/n8n for workflow automation, and modern SaaS integrations for support and analytics. 


**SonoBrokers Platform - Project Requirements Document \(PRD\)** **1. Project Context**

## **Problem Statement**

The traditional real estate market relies heavily on realtors as intermediaries, leading to high commission fees and a complex buying/sel ing process. Home sel ers and buyers need a more direct, cost-effective alternative that stil provides essential legal and professional support services. 

## **Key Value Proposition**

SonoBrokers offers a commission-free platform for private property sales with integrated professional services \(legal, photography, inspection\) on-demand. This creates a transparent marketplace that significantly reduces transaction costs while maintaining service quality and legal compliance. 

## **Target Audience**

**Primary Users**:

Property sel ers seeking to avoid realtor commission fees Home buyers looking for direct contact with sel ers and lower property prices First-time homebuyers who need guidance but want cost savings **Secondary Users**:

Real estate service providers \(lawyers, photographers, inspectors\) Property investors looking for direct deals **Technical Vision**

A Next.js React web application with Tailwind CSS built on the MicroSaaS Fast framework. The platform wil be cloud-native with serverless architecture leveraging Supabase \(PostgreSQL\) for data persistence, Clerk.com for authentication, Stripe for payments, Make.com/n8n for workflow automation, and modern SaaS integrations for support and analytics. 

## **2. Functional Requirements**

**Authentication & User Management**





**ID**

**Type Title**

**Description**

**Priority**

## **Dependencies**

### User

Implement secure user authentication with role-2.1

Epic

High

-

Authentication

based access

Al ow users to sign up with email, Google, or Apple 2.1.1 Story User Registration

High

Clerk.com

accounts

2.1.2 Story Role Selection

Users select buyer or sel er role during registration High

2.1.1

Create editable user profiles with contact 2.1.3 Story User Profile

Medium 2.1.1

information

Account

2.1.4 Story

Implement email/phone verification process High

2.1.1

Verification





**Property Listing Management**

**ID**

**Type Title**

**Description**

**Priority**

## **Dependencies**

### Property

Core functionality for creating and managing property 2.2

Epic

High

-

Listings

listings

Sel ers can create property listings with details, photos, 2.2.1 Story Create Listing

High

2.1.2

and price

Listing

2.2.2 Story

Implement payment system for listing properties High

Stripe

Payment

2.2.3 Story Edit Listing

Al ow sel ers to edit their property listings Medium 2.2.1

Listing

2.2.4 Story

Set expiration dates for listings and offer renewal Low

2.2.1

Expiration

Listing

2.2.5 Story

Track views, inquiries, and engagement metrics Medium 2.2.1, GA4

Analytics





**Property Search & Discovery**





**ID**

**Type Title**

**Description**

**Priority**

## **Dependencies**

2.3

Epic

Property Search

Enable buyers to find properties based on criteria High

-

2.3.1 Story Search Filters

Implement filters for location, price, size, features High

2.2.1

Google Maps

2.3.2 Story Map View

Show properties on interactive Google Map High

API

2.3.3 Story List View

Display properties in sortable list format High

2.3.1

Al ow buyers to save search criteria for 2.3.4 Story Saved Searches

Medium 2.3.1

notifications

Subscription

Implement subscription for viewing sel er contact 2.3.5 Story

High

Stripe

Access

details





**Professional Services Integration**

**ID**

**Type Title**

**Description**

**Priority**

## **Dependencies**

### Service Provider

Connect buyers/sel ers with necessary 2.4

Epic

High

-

Integration

professional services

Al ow selection of lawyers for property Service provider

2.4.1 Story Lawyer Selection

High

transactions

database

Photographer

Facilitate booking professional

Service provider

2.4.2 Story

Medium

Booking

photographers

database

Enable scheduling of property

Service provider

2.4.3 Story Inspector Scheduling

Medium

inspections

database

Service Provider

Create profiles for service providers with 2.4.4 Story

Medium 2.4.1, 2.4.2, 2.4.3

Profiles

ratings

Implement booking and payment system

2.4.5 Story Service Booking

High

Stripe

for services





**Communication & Transaction Management**





**ID**

**Type Title**

**Description**

**Priority**

## **Dependencies**

### Communication

Facilitate buyer-sel er communication and 2.5

Epic

High

-

System

transaction processes

2.5.1 Story Messaging System

In-app messaging between buyers and sel ers High

2.1, 2.3.5

Property Viewing

Tool to schedule and manage property

2.5.2 Story

High

2.5.1

Scheduler

viewings

System for submitting, tracking, and

2.5.3 Story Offer Management

High

2.5.1

responding to offers

2.5.4 Story Document Storage

Secure repository for transaction documents Medium Supabase

2.5.5 Story Transaction Timeline

Visual timeline of transaction progress Medium 2.5.3, 2.5.4





**Support & Analytics**

**ID**

**Type Title**

**Description**

**Priority**

## **Dependencies**

Platform Support & 

2.6

Epic

Implement support systems and tracking Medium -

Analytics

2.6.1 Story Live Chat Support

Integrate Crisp for customer support

Medium Crisp

Set up Google Analytics 4 for usage

2.6.2 Story Analytics Integration

Medium GA4

tracking

2.6.3 Story Feedback System

Al ow users to submit feedback and ratings Low

2.1

Create knowledge base for common

2.6.4 Story Help Center

Low

-

questions





**3. Non-Functional Requirements**

## **Performance**

Page load time under 2 seconds for main pages Map interaction response time under 500ms Server response time under 300ms for API cal s Support up to 10,000 concurrent users Lazy loading for image gal eries and search results Optimized image delivery via CDN

## **Security**

### End-to-end encryption for al communications

HTTPS implementation with TLS 1.3

JWT-based authentication with short expiration times Role-based access control \(RBAC\) for al features Regular penetration testing and security audits Compliance with real estate data protection regulations Secure storage for legal documents and transaction data **Scalability**

Horizontal scaling for API services

Database sharding strategy for property listings by region CDN implementation for static assets

Caching strategy for frequent searches and popular listings Queue-based processing for high-volume operations \(search indexing\) Rate limiting for API endpoints to prevent abuse **Compatibility**

Support for modern browsers \(Chrome, Firefox, Safari, Edge\) Responsive design for desktop, tablet, and mobile devices Progressive Web App \(PWA\) capabilities for mobile users Minimum screen resolution support: 320px width \(mobile\) Accessibility compliance with WCAG 2.1 AA standards **4. Technical Architecture**

## **System Diagram**

┌─

┌ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┐

─ 

┐ 





┌

─

┌ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┐

─ 

┐ 





┌

─

┌ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┐

─

│ 

│ 



C

l

C i

l e

i n

e t

n 

t L

a

L y

a e

y r

e 

r 





│



│ 





│



│ 



S

e

S r

e v

r i

v c

i e

c 

e L

a

L y

a e

y r

e 

r 



│



│ 





│



│ 





D

a

D t

a a

t 

a L

a

L y

a e

y r

e 

r 





│



│ 

│ 





│



│ 





│



│ 





│



│ 





│



│ 





│



│ 

│ 

┌

─

┌ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┐

─ 

┐ 

│



│ 





│



│ 

┌

─

┌ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┐

─ 

┐ 

│



│ 





│



│ 

┌

─

┌ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┐

─ 

┐ 

│



│ 

│ 

│



│ N

e

N x

e t

x . 

t j

. s

j 

s S

P

S A

P 

A │



│ 

│



│ 





│



│ 

│



│ 



N

e

N x

e t

x . 

t j

. s

j 

s 



│



│ 

│



│ 





│



│ 

│



│ 

S

u

S p

u a

p b

a a

b s

a e

s 

e 



│



│ 

│



│ 

│ 

│



│ R

e

R a

e c

a t

c /

t R

/ e

R d

e u

d x

u 

x │

◄

│ ─

◄ ┼

─ ─

┼ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┼

─ ─

┼ ►

─ │

► 

│ 





A

P

A I

P 

I 





│

◄

│ ─

◄ ┼

─ ─

┼ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┼

─ ─

┼ ►

─ │

► 

│ P

o

P s

o t

s g

t r

g e

r S

e Q

S L

Q 

L 

│



│ 

│



│ 

│ 

│



│ T

a

T i

a l

i w

l i

w n

i d

n 

d C

S

C S

S │

S 

│ 

│



│ 





│



│ 

│



│ 



R

o

R u

o t

u e

t s

e 

s 





│



│ 

│



│ 





│



│ 

│



│ 

D

a

D t

a a

t b

a a

b s

a e

s 

e 



│



│ 

│



│ 

│ 

└

─

└ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┘

─ 

┘ 

│



│ 





│



│ 

└

─

└ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┘

─ 

┘ 

│



│ 





│



│ 

└

─

└ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┘

─ 

┘ 

│



│ 

│ 





│



│ 





│



│ 





│



│ 





│



│ 





│



└─

└ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┘

─ 

┘ 





└

─

└ ─

─ ─

─ ┬

─ ─

┬ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┬

─ ─

┬ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┘

─ 

┘ 





└

─

└ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┘

─





│ 

│ 





│





┌─

┌ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┘

─ 

┘ 





└

─

└ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┐

─





▼ 

▼ 





▼





┌─

┌ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┐

─ 

┐ 





┌

─

┌ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┐

─





│ 

│ 

A

u

A t

u h

t e

h n

e t

n i

t c

i a

c t

a i

t o

i n

o 

n 



│



│ 





│



│ 



I

n

I t

n e

t g

e r

g a

r t

a i

t o

i n

o s

n 

s 





│





│ 

│ 





│



│ 





│



│ 





│





│ 

│ 



┌

─

┌ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┐

─ 

┐ │



│ 





│



│ ┌

─

┌ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┐

─ 

┐ 



│





│ 

│ 



│



│ 

C

l

C e

l r

e k

r . 

k c

. o

c m

o 

m 

│



│ │



│ 





│



│ │



│ 



S

t

S r

t i

r p

i e

p 

e 





│



│ 



│





│ 

│ 



└

─

└ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┘

─ 

┘ │



│ 





│



│ └

─

└ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┘

─ 

┘ 



│





│ 

│ 





│



│ 





│



│ ┌

─

┌ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┐

─ 

┐ 



│





└─

└ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┘

─ 

┘ 





│



│ │



│ 

M

a

M k

a e

k . 

e c

. o

c m

o /

m 

/ 

│



│ 



│





│ 

│ │



│ 





n

8

n n

8 

n 





│



│ 



│





│ 

│ └

─

└ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┘

─ 

┘ 



│





│ 

│ ┌

─

┌ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┐

─ 

┐ 



│





│ 

│ │

G

│ o

G o

o g

o l

g e

l 

e M

a

M p

a s

p 

s 

│



│ 



│





│ 

│ └

─

└ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┘

─ 

┘ 



│





│ 

│ ┌

─

┌ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┐

─ 

┐ 



│





│ 

│ │



│ 





C

r

C i

r s

i p

s 

p 





│



│ 



│





│ 

│ └

─

└ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┘

─ 

┘ 



│





│ 

│ ┌

─

┌ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┐

─ 

┐ 



│





│ 

│ │



│ 





G

A

G 4

A 

4 





│



│ 



│





│ 

│ └

─

└ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┘

─ 

┘ 



│





└─

└ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ─

─ ┘

─

**Tech Stack**

## **Frontend**

**Framework**: Next.js with React 18

**Styling**: Tailwind CSS with custom theme **State Management**: React Context API \+ SWR for data fetching **Map Integration**: Google Maps JavaScript API with custom React components

**UI Components**: Headless UI, Radix UI **Form Handling**: React Hook Form with Zod validation **Internationalization**: next-i18next \(supporting English, French for Canadian market\) **Backend**

**API Framework**: Next.js API Routes \(serverless functions\) **Database**: Supabase with PostgreSQL

**Authentication**: Clerk.com with JWT tokens **File Storage**: Supabase Storage for property images and documents **Search Engine**: PostgreSQL Ful -Text Search with PostGIS for location queries **Caching**: Vercel Edge Cache, Redis \(optional\) **Third-Party Services**

**Payment Processing**: Stripe Connect for listings, subscriptions, and service bookings **Workflow Automation**: Make.com or n8n for notification systems and process management **Maps & Geocoding**: Google Maps API **Customer Support**: Crisp live chat **Analytics**: Google Analytics 4

**Email Service**: SendGrid or AWS SES

**SMS Notifications**: Twilio

## **DevOps**

**Hosting**: Vercel \(frontend and serverless functions\) **Database Hosting**: Supabase managed PostgreSQL

**CI/CD**: GitHub Actions

**Monitoring**: Sentry for error tracking, Vercel Analytics **Logging**: Supabase Edge Functions logs, custom logging solutions **Environment Management**: Environment variables via Vercel **Data Flow**

1. **Property Listing**: User → Frontend → Next.js API → Supabase → Stripe → Confirmation → Search Indexing





2. **Property Search**: User → Search Input → API → Supabase \(SQL/PostGIS\) → Return Results →

Map/List Display

3. **Buyer Subscription**: User → Subscribe Button → Stripe Checkout → Payment → Update User Permissions → Access Contact Info

4. **Service Booking**: Select Provider → Book Time Slot → Make.com Workflow → Provider Notification

→ Confirmation

**5. Risk & Dependency Management** **Technical Risks**

**Risk**

**Description**

**Impact**

**Probability Mitigation**

## **ID**

### Supabase performance with

Implement proper indexing, query optimization, R1

High

Medium

large property database

and consider table partitioning by region Google Maps API cost

Implement usage quotas, caching of static map R2

Medium Medium

escalation

data, and optimize API cal s

Robust error handling, transaction logs, and R3

Payment processing failures

High

Low

recovery processes

Regular security audits, proper encryption, and R4

Security breaches in user data

Critical

Low

least privilege access principles

Integration failures with third-

Circuit breakers, fal back mechanisms, and R5

Medium Medium

party services

comprehensive monitoring

Performance issues during

Load testing, autoscaling configuration, and R6

High

Medium

high traffic periods

performance optimization





## **Dependencies**



**Dependency**

**Risk**

**Description**

**Contingency Plan**

**ID**

## **Level**

Clerk.com authentication

Fal back to email/password authentication if service D1

Medium

service

disruption

D2

Supabase availability

High

Regular backups, disaster recovery plan D3

Stripe API

High

Cache transaction states, implement retry logic D4

Google Maps API

Medium

Fal back to simplified location search and static maps Design critical workflows with manual override D5

Make.com/n8n workflows

Medium

capabilities

D6

Crisp live chat

Low

Fal back to email support form





**6. Database Design**

**Schema Design**

## **Users Table**

### sql

CR

C E

R A

E T

A E

T TA

T B

A L

B E

L u

s

u e

s r

e s

r 

s \(



i

d

i 

d U

U

U I

U D

I 

D PR

P I

R M

I A

M R

A Y

R KE

K Y

E RE

R F

E E

F R

E E

R N

E C

N E

C S

E a

u

a t

u h

t .us

u e

s r

e s

r , 



u

s

u e

s r

e \_

r t

\_ y

t p

y e

p 

e VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L CH

C E

H C

E K

C \(us

u e

s r

e \_

r t

\_ y

t p

y e

p 

e IN

I \('b

' u

b y

u e

y r

e ' 

r , 's

' e

s l

e l

l e

l r

e ' 

r , 's

' e

s r

e v

r i

v c

i e

c \_

e p

\_ r

p o

r v

o i

v d

i e

d r

e ' 

r \)\), 



e

m

e a

m i

a l

i 

l VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L UN

U I

N Q

I U

Q E

U , 



f

u

f l

u l

l \_

l n

\_ a

n m

a e

m 

e VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L , 



p

h

p o

h n

o e

n 

e VA

V R

A C

R H

C A

H R

A , 



a

d

a d

d r

d e

r s

e s

s 

s J

S

J O

S N

O B

N , 



c

r

c e

r a

e t

a e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\), 



u

p

u d

p a

d t

a e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\)

\); 

## **Properties Table**

sql

CR

C E

R A

E T

A E

T TA

T B

A L

B E

L p

r

p o

r p

o e

p r

e t

r i

t e

i s

e 

s \(



i

d

i 

d U

U

U I

U D

I 

D PR

P I

R M

I A

M R

A Y

R KE

K Y

E DE

D F

E A

F U

A L

U T

L u

u

u i

u d

i \_

d g

\_ e

g n

e e

n r

e a

r t

a e

t \_

e v

\_ 4

v \(\), 



s

e

s l

e l

l e

l r

e \_

r i

\_ d

i 

d U

U

U I

U D

I 

D NO

N T

O NU

N L

U L

L RE

R F

E E

F R

E E

R N

E C

N E

C S

E u

s

u e

s r

e s

r \(id

i \), 



t

i

t t

i l

t e

l 

e VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L , 



d

e

d s

e c

s r

c i

r p

i t

p i

t o

i n

o 

n TE

T X

E T

X , 



p

r

p i

r c

i e

c 

e DE

D C

E I

C M

I A

M L

A NO

N T

O NU

N L

U L

L , 



b

e

b d

e r

d o

r o

o m

o s

m 

s SM

S A

M L

A L

L I

L N

I T

N , 



b

a

b t

a h

t r

h o

r o

o m

o s

m 

s SM

S A

M L

A L

L I

L N

I T

N , 



s

q

s f

q t

f 

t IN

I T

N E

T G

E E

G R

E , 



p

r

p o

r p

o e

p r

e t

r y

t \_

y t

\_ y

t p

y e

p 

e VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L , 



a

d

a d

d r

d e

r s

e s

s 

s J

S

J O

S N

O B

N 

B NO

N T

O NU

N L

U L

L , 



c

o

c o

o r

o d

r i

d n

i a

n t

a e

t s

e 

s G

E

G O

E G

O R

G A

R P

A H

P Y

H \(PO

P I

O N

I T

N \), 



f

e

f a

e t

a u

t r

u e

r s

e 

s J

S

J O

S N

O B

N , 



st

s a

t t

a u

t s

u VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L DE

D F

E A

F U

A L

U T

L 'p

' e

p n

e d

n i

d n

i g

n ' 

g CH

C E

H C

E K

C \(st

s a

t t

a u

t s

u IN

I \('p

' e

p n

e d

n i

d n

i g

n ' 

g , 'a

' c

a t

c i

t v

i e

v ' 

e , 's

' o

s l

o d

l ' 

d , 'e

' x

e p

x



c

r

c e

r a

e t

a e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\), 



u

p

u d

p a

d t

a e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\), 



e

x

e p

x i

p r

i e

r s

e \_

s a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N

\); 

*--*

*- *

*- I*

* n*

*I d*

*n e*

*d x*

*e *

*x f*

* o*

*f r*

*o *

*r s*

* p*

*s a*

*p t*

*a i*

*t a*

*i l*

*a *

*l q*

* u*

*q e*

*u r*

*e i*

*r e*

*i s*

*e*

CR

C E

R A

E T

A E

T IN

I D

N E

D X

E p

r

p o

r p

o e

p r

e t

r i

t e

i s

e \_

s c

\_ o

c o

o r

o d

r i

d n

i a

n t

a e

t s

e \_

s i

\_ d

i x

d 

x ON

O p

r

p o

r p

o e

p r

e t

r i

t e

i s

e 

s US

U I

S N

I G

N G

I

G S

I T

S 

T \(co

c o

o r

o d

r i

d n

i a

n t

a e

t s

e \); 





## **Property Images Table**

### sql

CR

C E

R A

E T

A E

T TA

T B

A L

B E

L p

r

p o

r p

o e

p r

e t

r y

t \_

y i

\_ m

i a

m g

a e

g s

e 

s \(



i

d

i 

d U

U

U I

U D

I 

D PR

P I

R M

I A

M R

A Y

R KE

K Y

E DE

D F

E A

F U

A L

U T

L u

u

u i

u d

i \_

d g

\_ e

g n

e e

n r

e a

r t

a e

t \_

e v

\_ 4

v \(\), 



p

r

p o

r p

o e

p r

e t

r y

t \_

y i

\_ d

i 

d U

U

U I

U D

I 

D NO

N T

O NU

N L

U L

L RE

R F

E E

F R

E E

R N

E C

N E

C S

E p

r

p o

r p

o e

p r

e t

r i

t e

i s

e \(id

i \) ON

O DE

D L

E E

L T

E E

T CA

C S

A C

S A

C D

A E

D , 



u

r

u l

r 

l VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L , 



s

t

s o

t r

o a

r g

a e

g \_

e p

\_ a

p t

a h

t 

h VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L , 



i

s

i \_

s p

\_ r

p i

r m

i a

m r

a y

r 

y BO

B O

O L

O E

L A

E N

A DE

D F

E A

F U

A L

U T

L fa

f l

a s

l e

s , 



c

r

c e

r a

e t

a e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\)

\); 

## **Subscriptions Table**

sql

CR

C E

R A

E T

A E

T TA

T B

A L

B E

L s

u

s b

u s

b c

s r

c i

r p

i t

p i

t o

i n

o s

n 

s \(



i

d

i 

d U

U

U I

U D

I 

D PR

P I

R M

I A

M R

A Y

R KE

K Y

E DE

D F

E A

F U

A L

U T

L u

u

u i

u d

i \_

d g

\_ e

g n

e e

n r

e a

r t

a e

t \_

e v

\_ 4

v \(\), 



u

s

u e

s r

e \_

r i

\_ d

i 

d U

U

U I

U D

I 

D NO

N T

O NU

N L

U L

L RE

R F

E E

F R

E E

R N

E C

N E

C S

E u

s

u e

s r

e s

r \(id

i \), 



s

t

s r

t i

r p

i e

p \_

e s

\_ u

s b

u s

b c

s r

c i

r p

i t

p i

t o

i n

o \_

n i

\_ d

i 

d VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L , 



st

s a

t t

a u

t s

u VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L , 



p

l

p a

l n

a \_

n t

\_ y

t p

y e

p 

e VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L , 



s

t

s a

t r

a t

r s

t \_

s a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E NO

N T

O NU

N L

U L

L , 



e

n

e d

n s

d \_

s a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E NO

N T

O NU

N L

U L

L , 



c

r

c e

r a

e t

a e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\), 



u

p

u d

p a

d t

a e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\)

\); 

## **Service Providers Table**

### sql

CR

C E

R A

E T

A E

T TA

T B

A L

B E

L s

e

s r

e v

r i

v c

i e

c \_

e p

\_ r

p o

r v

o i

v d

i e

d r

e s

r 

s \(



i

d

i 

d U

U

U I

U D

I 

D PR

P I

R M

I A

M R

A Y

R KE

K Y

E DE

D F

E A

F U

A L

U T

L u

u

u i

u d

i \_

d g

\_ e

g n

e e

n r

e a

r t

a e

t \_

e v

\_ 4

v \(\), 



u

s

u e

s r

e \_

r i

\_ d

i 

d U

U

U I

U D

I 

D NO

N T

O NU

N L

U L

L RE

R F

E E

F R

E E

R N

E C

N E

C S

E u

s

u e

s r

e s

r \(id

i \), 



s

e

s r

e v

r i

v c

i e

c \_

e t

\_ y

t p

y e

p 

e VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L CH

C E

H C

E K

C \(se

s r

e v

r i

v c

i e

c \_

e t

\_ y

t p

y e

p 

e IN

I \('l

' a

l w

a y

w e

y r

e ' 

r , 'p

' h

p o

h t

o o

t g

o r

g a

r p

a h

p e

h r

e ' 

r , 'i

' n

i s

n p

s e

p c

e t

c o

t r

o ' 

r \)\)



b

u

b s

u i

s n

i e

n s

e s

s \_

s n

\_ a

n m

a e

m 

e VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L , 



d

e

d s

e c

s r

c i

r p

i t

p i

t o

i n

o 

n TE

T X

E T

X , 



l

i

l c

i e

c n

e s

n e

s \_

e n

\_ u

n m

u b

m e

b r

e 

r VA

V R

A C

R H

C A

H R

A , 



r

e

r g

e i

g o

i n

o s

n 

s J

S

J O

S N

O B

N , *--*

*- *

*- A*

* r*

*A r*

*r a*

*r y*

*a *

*y o*

* f*

*o *

*f s*

* u*

*s p*

*u p*

*p o*

*p r*

*o t*

*r e*

*t d*

*e *

*d r*

* e*

*r g*

*e i*

*g o*

*i n*

*o s*

*n*



r

a

r t

a e

t s

e 

s J

S

J O

S N

O B

N , 



r

a

r t

a i

t n

i g

n 

g DE

D C

E I

C M

I A

M L

A , 



c

r

c e

r a

e t

a e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\), 



u

p

u d

p a

d t

a e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\)

\); 





## **Service Bookings Table**

sql

CR

C E

R A

E T

A E

T TA

T B

A L

B E

L s

e

s r

e v

r i

v c

i e

c \_

e b

\_ o

b o

o k

o i

k n

i g

n s

g 

s \(



i

d

i 

d U

U

U I

U D

I 

D PR

P I

R M

I A

M R

A Y

R KE

K Y

E DE

D F

E A

F U

A L

U T

L u

u

u i

u d

i \_

d g

\_ e

g n

e e

n r

e a

r t

a e

t \_

e v

\_ 4

v \(\), 



p

r

p o

r p

o e

p r

e t

r y

t \_

y i

\_ d

i 

d U

U

U I

U D

I 

D NO

N T

O NU

N L

U L

L RE

R F

E E

F R

E E

R N

E C

N E

C S

E p

r

p o

r p

o e

p r

e t

r i

t e

i s

e \(id

i \), 



s

e

s r

e v

r i

v c

i e

c \_

e p

\_ r

p o

r v

o i

v d

i e

d r

e \_

r i

\_ d

i 

d U

U

U I

U D

I 

D NO

N T

O NU

N L

U L

L RE

R F

E E

F R

E E

R N

E C

N E

C S

E s

e

s r

e v

r i

v c

i e

c \_

e p

\_ r

p o

r v

o i

v d

i e

d r

e s

r \(id

i \), 



u

s

u e

s r

e \_

r i

\_ d

i 

d U

U

U I

U D

I 

D NO

N T

O NU

N L

U L

L RE

R F

E E

F R

E E

R N

E C

N E

C S

E u

s

u e

s r

e s

r \(id

i \), 



s

e

s r

e v

r i

v c

i e

c \_

e t

\_ y

t p

y e

p 

e VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L , 



st

s a

t t

a u

t s

u VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L DE

D F

E A

F U

A L

U T

L 'p

' e

p n

e d

n i

d n

i g

n ' 

g , 



s

c

s h

c e

h d

e u

d l

u e

l d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N , 



c

o

c m

o p

m l

p e

l t

e e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N , 



n

o

n t

o e

t s

e 

s TE

T X

E T

X , 



p

a

p y

a m

y e

m n

e t

n \_

t i

\_ d

i 

d VA

V R

A C

R H

C A

H R

A , 



c

r

c e

r a

e t

a e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\), 



u

p

u d

p a

d t

a e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\)

\); 

## **Property Viewings Table**

### sql

CR

C E

R A

E T

A E

T TA

T B

A L

B E

L p

r

p o

r p

o e

p r

e t

r y

t \_

y v

\_ i

v e

i w

e i

w n

i g

n s

g 

s \(



i

d

i 

d U

U

U I

U D

I 

D PR

P I

R M

I A

M R

A Y

R KE

K Y

E DE

D F

E A

F U

A L

U T

L u

u

u i

u d

i \_

d g

\_ e

g n

e e

n r

e a

r t

a e

t \_

e v

\_ 4

v \(\), 



p

r

p o

r p

o e

p r

e t

r y

t \_

y i

\_ d

i 

d U

U

U I

U D

I 

D NO

N T

O NU

N L

U L

L RE

R F

E E

F R

E E

R N

E C

N E

C S

E p

r

p o

r p

o e

p r

e t

r i

t e

i s

e \(id

i \), 



b

u

b y

u e

y r

e \_

r i

\_ d

i 

d U

U

U I

U D

I 

D NO

N T

O NU

N L

U L

L RE

R F

E E

F R

E E

R N

E C

N E

C S

E u

s

u e

s r

e s

r \(id

i \), 



st

s a

t t

a u

t s

u VA

V R

A C

R H

C A

H R

A NO

N T

O NU

N L

U L

L DE

D F

E A

F U

A L

U T

L 'r

' e

r q

e u

q e

u s

e t

s e

t d

e ' 

d , 



p

r

p o

r p

o o

p s

o e

s d

e \_

d t

\_ i

t m

i e

m s

e 

s J

S

J O

S N

O B

N , 



c

o

c n

o f

n i

f r

i m

r e

m d

e \_

d t

\_ i

t m

i e

m 

e TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N , 



n

o

n t

o e

t s

e 

s TE

T X

E T

X , 



c

r

c e

r a

e t

a e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\), 



u

p

u d

p a

d t

a e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\)

\); 

## **Messages Table**

sql

CR

C E

R A

E T

A E

T TA

T B

A L

B E

L m

e

m s

e s

s a

s g

a e

g s

e 

s \(



i

d

i 

d U

U

U I

U D

I 

D PR

P I

R M

I A

M R

A Y

R KE

K Y

E DE

D F

E A

F U

A L

U T

L u

u

u i

u d

i \_

d g

\_ e

g n

e e

n r

e a

r t

a e

t \_

e v

\_ 4

v \(\), 



c

o

c n

o v

n e

v r

e s

r a

s t

a i

t o

i n

o \_

n i

\_ d

i 

d U

U

U I

U D

I 

D NO

N T

O NU

N L

U L

L RE

R F

E E

F R

E E

R N

E C

N E

C S

E c

o

c n

o v

n e

v r

e s

r a

s t

a i

t o

i n

o s

n \(id

i \), 



s

e

s n

e d

n e

d r

e \_

r i

\_ d

i 

d U

U

U I

U D

I 

D NO

N T

O NU

N L

U L

L RE

R F

E E

F R

E E

R N

E C

N E

C S

E u

s

u e

s r

e s

r \(id

i \), 



m

e

m s

e s

s a

s g

a e

g 

e TE

T X

E T

X NO

N T

O NU

N L

U L

L , 



re

r a

e d

a BO

B O

O L

O E

L A

E N

A DE

D F

E A

F U

A L

U T

L fa

f l

a s

l e

s , 



c

r

c e

r a

e t

a e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\)

\); 

## **Conversations Table**

### sql

CR

C E

R A

E T

A E

T TA

T B

A L

B E

L c

o

c n

o v

n e

v r

e s

r a

s t

a i

t o

i n

o s

n 

s \(



i

d

i 

d U

U

U I

U D

I 

D PR

P I

R M

I A

M R

A Y

R KE

K Y

E DE

D F

E A

F U

A L

U T

L u

u

u i

u d

i \_

d g

\_ e

g n

e e

n r

e a

r t

a e

t \_

e v

\_ 4

v \(\), 



p

r

p o

r p

o e

p r

e t

r y

t \_

y i

\_ d

i 

d U

U

U I

U D

I 

D RE

R F

E E

F R

E E

R N

E C

N E

C S

E p

r

p o

r p

o e

p r

e t

r i

t e

i s

e \(id

i \), 



p

a

p r

a t

r i

t c

i i

c p

i a

p n

a t

n s

t 

s J

S

J O

S N

O B

N 

B NO

N T

O NU

N L

U L

L , *--*

*- *

*- A*

* r*

*A r*

*r a*

*r y*

*a *

*y o*

* f*

*o *

*f u*

* s*

*u e*

*s r*

*e \_*

*r i*

*\_ d*

*i s*

*d*



l

a

l s

a t

s \_

t m

\_ e

m s

e s

s a

s g

a e

g \_

e a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\), 



c

r

c e

r a

e t

a e

t d

e \_

d a

\_ t

a 

t TI

T M

I E

M S

E T

S A

T M

A P

M WI

W T

I H

T TI

T M

I E

M Z

O

Z N

O E

N 

E DE

D F

E A

F U

A L

U T

L no

n w

o \(\)

\); 

## **Data Optimization Strategies**

1. **Indexing**:

Geographic spatial indexing for location-based searches B-tree indexes on frequently queried fields \(status, price\) Ful -text search indexing on property descriptions 2. **Caching**:

Result caching for common searches

Edge caching for static property details Redis cache for user session data and high-frequency queries 3. **Query Performance**:

Use of materialized views for complex aggregation queries Pagination and infinite scrol ing to limit data fetch size Database connection pooling

4. **Storage Optimization**:

Store image references, not binary data in database

Use efficient JSON storage for flexible attributes Implement database partitioning for historical data **7. Compliance & Governance**

**Regulatory Compliance**

## **United States**

### Compliance with Fair Housing Act

State-specific real estate disclosure requirements Electronic signature compliance \(ESIGN Act\) Privacy laws compliance \(CCPA for California users\) **Canada**

Provincial real estate regulations

PIPEDA compliance for personal data

Electronic commerce laws compliance

Language requirements \(French for Quebec\) **General**

GDPR compliance for potential European users Anti-money laundering \(AML\) checks for transactions Data breach notification procedures

Terms of service and privacy policy implementation **Access Control**

**Role-Based Access Control \(RBAC\)**: Buyer role permissions

Sel er role permissions

Service provider role permissions

Admin role permissions

**Data Access Policies**:

Row-level security in Supabase

Content-based access controls





API endpoint protection

**Audit Trail**:

Transaction logs for al property actions Admin action logging

User session tracking

Payment event logging

## **Data Retention**

User data retained for 2 years after account closure Transaction records retained for 7 years \(legal requirement\) Property listing data archived after 3 years Chat logs deleted 1 year after conversation end Automated data pruning workflows

User data export functionality

Clear data deletion procedures on request **8. Milestones & Delivery Plan**

**Phase 1: MVP \(Months 1-3\)**

**Milestone**

**Features**

**Timeline**

## **Dependencies**

### User Authentication

User registration, login, profiles

Weeks 1-2

Clerk.com setup

Basic Property Listings

Create, view property listings

Weeks 3-4

User Auth, Supabase

Search Functionality

Basic search and filtering

Weeks 5-6

Property Listings

Payment Integration

Listing payments, basic subscriptions Weeks 7-8

Stripe setup

Map Integration

Google Maps property display

Weeks 9-10

Google Maps API

Basic Messaging

Simple buyer-sel er messaging

Weeks 11-12

User Auth





**Phase 2: Core Features \(Months 4-6\)**





**Milestone**

**Features**

**Timeline**

## **Dependencies**

### Enhanced Search

Advanced filters, saved searches

Weeks 13-14 Phase 1 completion

Service Provider Integration

Lawyer, photographer profiles

Weeks 15-17 User Auth

Booking System

Property viewing scheduler

Weeks 18-19 Basic Messaging

Transaction Management

Document uploads, transaction tracking Weeks 20-22 Service Provider Integration Analytics & Support

GA4, Crisp integration

Weeks 23-24 Core platform





**Phase 3: Advanced Features \(Months 7-9\)** **Milestone**

**Features**

**Timeline**

## **Dependencies**

### Workflow Automation

Automated notifications, reminders

Weeks 25-27

Make.com/n8n setup

Service Marketplace

Ful service booking and payment

Weeks 28-30

Service Provider Integration

Advanced User Features

Favorites, history, recommendations

Weeks 31-33

Enhanced Search

Mobile Optimization

Progressive Web App capabilities

Weeks 34-36

Core platform





**Phase 4: Optimization & Expansion \(Months 10-12\)** **Milestone**

**Features**

**Timeline**

## **Dependencies**

### Performance Optimization

Code splitting, caching strategy

Weeks 37-39

Ful platform

Advanced Analytics

Conversion tracking, heat maps

Weeks 40-42

GA4 integration

API Development

Partner integrations, webhooks

Weeks 43-45

Core platform

Regional Expansion

Support for additional regions

Weeks 46-48

Ful platform





**9. Architectural Decisions**

## **Framework Selection**

**Next.js** was chosen over traditional React for its superior SEO capabilities, server-side rendering, and API routes that eliminate the need for a separate backend service. 

**Supabase** was selected over Firebase due to its PostgreSQL foundation, which provides better support for complex geospatial queries essential for property searches. 

## **Authentication Strategy**

**Clerk.com** was preferred over custom auth or Auth0 because it offers superior user management features specifical y designed for marketplaces with multiple user types. 

## **Database Decisions**

Relational model \(PostgreSQL\) chosen over NoSQL for maintaining data integrity in complex property transactions. 

PostGIS extension utilized for location-based queries instead of implementing custom geospatial indexing. 

## **Integration Philosophy**

Using established SaaS components \(Stripe, Clerk, Supabase\) to accelerate development and maintain security best practices. 

Workflow automation tools \(Make.com/n8n\) preferred over custom code for business logic that may need frequent adjustments. 

## **Scalability Approach**

Serverless architecture chosen to handle variable load without maintaining infrastructure. 

Regional database strategy planned for future scale to reduce latency for international users.



