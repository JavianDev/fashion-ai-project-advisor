export * from "./config";

// =====================================================
// ENUMS - Matching .NET Web API
// =====================================================

// Country enum
export enum Country {
  CA = 'CA',
  US = 'US',
  UAE = 'UAE'
}

// User role enum
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  PRODUCT = 'PRODUCT',
  OPERATOR = 'OPERATOR',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER'
}

// User status enum
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING'
}

// User type enum
export enum SnbUserType {
  Buyer = 'Buyer',
  Seller = 'Seller'
}

// Property status enum
export enum PropertyStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  PENDING = 'PENDING',
  WITHDRAWN = 'WITHDRAWN',
  EXPIRED = 'EXPIRED',
  DRAFT = 'DRAFT'
}

// Contact share status enum
export enum ContactShareStatus {
  Sent = 'Sent',
  Viewed = 'Viewed',
  Responded = 'Responded',
  Accepted = 'Accepted',
  Declined = 'Declined',
  Expired = 'Expired'
}

// Contact share type enum
export enum ContactShareType {
  ContactRequest = 'ContactRequest',
  PropertyOffer = 'PropertyOffer',
  ScheduleVisit = 'ScheduleVisit',
  OfferWithVisit = 'OfferWithVisit'
}

// =====================================================
// API RESPONSE TYPES - Matching .NET Web API
// =====================================================

// Standard API response wrapper
export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  errors: string[]
  timestamp: string
  requestId?: string
  totalCount?: number
  page?: number
  pageSize?: number
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}

// =====================================================
// USER TYPES - Matching .NET Web API UserDTOs
// =====================================================

export interface UserProfile {
  id: string
  email: string
  fullName: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  profileImageUrl?: string
  clerkUserId?: string
  role: UserRole
  userType: SnbUserType
  status: UserStatus
  isActive: boolean
  loggedIn: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  email: string
  fullName: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  clerkUserId: string
  role?: UserRole
  userType?: SnbUserType
}

export interface UpdateUserRequest {
  fullName?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
}

export interface UserSearchParams {
  email?: string
  role?: UserRole
  userType?: SnbUserType
  isActive?: boolean
  page?: number
  limit?: number
}

export interface UserSearchResponse {
  users: UserProfile[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}

// Legacy User interface for backward compatibility
export interface User {
  id: string
  clerkId: string
  email: string
  fullName: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  profileImageUrl?: string
  clerkUserId?: string
  role: UserRole
  userType: SnbUserType
  status: SnbUserType  // For backward compatibility, status maps to userType
  isActive: boolean
  loggedIn: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

// =====================================================
// PROPERTY TYPES - Matching .NET Web API PropertyDTOs
// =====================================================

export interface PropertyResponse {
  id: string
  sellerId: string
  sellerName: string
  sellerEmail: string
  title: string
  description: string
  price: number
  propertyType: string
  listingType: string
  status: PropertyStatus
  bedrooms: number
  bathrooms: number
  squareFootage: number
  address: PropertyAddress
  features: string[]
  images: PropertyImage[]
  createdAt: string
  updatedAt: string
}

export interface PropertyAddress {
  street: string
  city: string
  province: string
  country: string
  postalCode: string
  latitude?: number
  longitude?: number
}

export interface PropertyImage {
  id: string
  propertyId: string
  imageUrl: string
  displayOrder: number
  caption?: string
  createdAt: string
}

// New PropertyMedia interface for unified media handling
export interface PropertyMedia {
  id: string
  propertyId: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  title?: string
  altText?: string
  displayOrder: number
  isPrimary: boolean
  duration?: number // For videos (in seconds)
  thumbnailUrl?: string // For video thumbnails
  createdAt: string
  storagePath?: string
  containerName?: string
  fileSize?: number
  contentType?: string
  country?: string
  isVideo: boolean // Backward compatibility
}

// Request types for PropertyMedia operations
export interface UploadMediaRequest {
  propertyId: string
  files: File[]
}

export interface UpdateMediaRequest {
  id: string
  title?: string
  altText?: string
  displayOrder?: number
  isPrimary?: boolean
}

export interface ReorderMediaRequest {
  propertyId: string
  mediaIds: string[]
}

// Property Validation Types
export interface PropertyValidationResult {
  isValid: boolean
  errorMessage: string
  errors: string[]
  photoCount: number
  hasRequiredPhotos: boolean
}

// Property Validation Types
export interface PropertyValidationResult {
  isValid: boolean
  errorMessage: string
  errors: string[]
  photoCount: number
  hasRequiredPhotos: boolean
}

export interface CreatePropertyRequest {
  title: string
  description: string
  price: number
  propertyType: string
  listingType: string
  bedrooms: number
  bathrooms: number
  squareFootage: number
  address: PropertyAddress
  features?: string[]
}

export interface UpdatePropertyRequest {
  title?: string
  description?: string
  price?: number
  propertyType?: string
  listingType?: string
  bedrooms?: number
  bathrooms?: number
  squareFootage?: number
  address?: PropertyAddress
  features?: string[]
  status?: PropertyStatus
}

export interface PropertySearchParams {
  searchTerm?: string
  country?: string
  minPrice?: number
  maxPrice?: number
  propertyType?: string
  bedrooms?: number
  bathrooms?: number
  status?: PropertyStatus
  page?: number
  pageSize?: number
}

// =====================================================
// CONTACT SHARING TYPES - Matching .NET Web API ContactShareDTOs
// =====================================================

export interface ContactShareResponse {
  id: string
  propertyId: string
  propertyTitle: string
  propertyAddress: string
  propertyPrice: number
  buyerId: string
  buyerName: string
  buyerEmail: string
  buyerPhone?: string
  sellerId: string
  sellerName: string
  sellerEmail: string
  message?: string
  shareType: ContactShareType
  shareTypeDisplay: string
  offerAmount?: number
  schedulingPreference?: string
  preferredVisitDate?: string
  preferredVisitTime?: string
  status: ContactShareStatus
  statusDisplay: string
  createdAt: string
  updatedAt: string
  expiresAt?: string
}

export interface CreateContactShareRequest {
  propertyId: string
  sellerId: string
  message?: string
  shareType: ContactShareType
  offerAmount?: number
  schedulingPreference?: string
  preferredVisitDate?: string
  preferredVisitTime?: string
}

export interface ContactShareSearchParams {
  propertyId?: string
  buyerId?: string
  sellerId?: string
  shareType?: ContactShareType
  status?: ContactShareStatus
  page?: number
  limit?: number
}

export interface ContactShareSearchResponse {
  contactShares: ContactShareResponse[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}

export interface ContactShareStats {
  total: number
  pending: number
  responded: number
  accepted: number
  declined: number
  contactRequests: number
  propertyOffers: number
  scheduleRequests: number
  pendingResponses: number
  totalContactShares: number
}

// =====================================================
// ADVERTISER TYPES - Matching .NET Web API AdvertiserDTOs
// =====================================================

export interface AdvertiserResponse {
  id: string
  userId: string
  businessName: string
  contactName: string
  email: string
  phoneNumber: string
  serviceType: string
  description: string
  location: string
  website?: string
  isVerified: boolean
  isPremium: boolean
  rating: number
  reviewCount: number
  images: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateAdvertiserRequest {
  businessName: string
  contactName: string
  email: string
  phoneNumber: string
  serviceType: string
  description: string
  location: string
  website?: string
}

export interface UpdateAdvertiserRequest {
  businessName?: string
  contactName?: string
  email?: string
  phoneNumber?: string
  serviceType?: string
  description?: string
  location?: string
  website?: string
}

export interface AdvertiserSearchParams {
  page?: number
  limit?: number
  serviceType?: string
  location?: string
  verified?: boolean
  premium?: boolean
  sortBy?: string
}

// =====================================================
// MESSAGING TYPES - For chat and communication
// =====================================================

export interface MessageResponse {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  messageType: 'text' | 'image' | 'file'
  isRead: boolean
  createdAt: string
}

export interface ConversationResponse {
  id: string
  propertyId: string
  propertyTitle: string
  buyerId: string
  buyerName: string
  sellerId: string
  sellerName: string
  lastMessage?: MessageResponse
  unreadCount: number
  createdAt: string
  updatedAt: string
}

// =====================================================
// ADMIN TYPES - For admin dashboard and management
// =====================================================

export interface AdminDashboardStats {
  users: {
    total: number
    active: number
    recent: number
    byRole: Record<string, number>
    byType: Record<string, number>
  }
  properties: {
    total: number
    active: number
    sold: number
    pending: number
  }
  activity: {
    logins: number
    registrations: number
    propertyViews: number
    contactShares: number
  }
}
