# SoNoBrokers API Integration Guide

## Overview

This document describes the integration between the SoNoBrokers React frontend and .NET Web API backend. The migration from direct Prisma/Supabase calls to a centralized .NET API provides better security, performance, and maintainability.

## Architecture

### Request Flow
```
React Component → Server Action → API Service → .NET Controller → Service Layer → Database
```

### Authentication Flow
```
Clerk (Frontend) → JWT Token → .NET Middleware → Controller Authorization
```

## Controller Architecture (Updated 2024)

### Core Controllers
Located in `Controllers/Core/` - Handle system-level operations:

- **`/api/core/user`** - User management (UserController)
- **`/api/core/user/analytics`** - User analytics (UserAnalyticsController)
- **`/api/core/clerk/webhooks`** - Clerk authentication webhooks (ClerkWebhookController)

### SoNoBrokers Controllers
Located in `Controllers/SoNoBrokers/` - Handle business logic:

- **`/api/sonobrokers/properties`** - Property management (PropertiesController)
- **`/api/sonobrokers/subscriptions`** - Subscription management (SubscriptionsController)

### Health & Test Endpoints
- **`/health`** - Health check endpoint
- **`/api/sonobrokers/test/ping`** - API connectivity test

## API Client Configuration

### Base Configuration
```typescript
// src/lib/api-client.ts
import axios from 'axios';
import { auth } from '@clerk/nextjs';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5005',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(async (config) => {
  const { getToken } = auth();
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## API Services

### Properties API
```typescript
// src/lib/api/properties-api.ts
import apiClient from '../api-client';
import type { 
  PropertySearchParams, 
  PropertyResponse, 
  CreatePropertyRequest,
  UpdatePropertyRequest 
} from '@/types/property';

export const propertiesApi = {
  // Search properties
  searchProperties: async (params: PropertySearchParams): Promise<PropertyResponse[]> => {
    const response = await apiClient.get('/api/sonobrokers/properties', { params });
    return response.data.data;
  },

  // Get property by ID
  getProperty: async (id: string): Promise<PropertyResponse> => {
    const response = await apiClient.get(`/api/sonobrokers/properties/${id}`);
    return response.data.data;
  },

  // Create new property
  createProperty: async (data: CreatePropertyRequest): Promise<PropertyResponse> => {
    const response = await apiClient.post('/api/sonobrokers/properties', data);
    return response.data.data;
  },

  // Update property
  updateProperty: async (id: string, data: UpdatePropertyRequest): Promise<PropertyResponse> => {
    const response = await apiClient.put(`/api/sonobrokers/properties/${id}`, data);
    return response.data.data;
  },

  // Delete property
  deleteProperty: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/sonobrokers/properties/${id}`);
  },

  // Get user's properties
  getUserProperties: async (userId: string): Promise<PropertyResponse[]> => {
    const response = await apiClient.get(`/api/sonobrokers/properties/user/${userId}`);
    return response.data.data;
  },

  // Get featured properties
  getFeaturedProperties: async (): Promise<PropertyResponse[]> => {
    const response = await apiClient.get('/api/sonobrokers/properties/featured');
    return response.data.data;
  }
};
```

### Core User API (New Structure)
```typescript
// src/lib/api/core-user-api.ts
import apiClient from '../api-client';
import type { UserProfile, UpdateUserRequest } from '@/types/user';

export const coreUserApi = {
  // Get all users (admin only)
  getAllUsers: async (): Promise<UserProfile[]> => {
    const response = await apiClient.get('/api/core/user');
    return response.data.data;
  },

  // Get user by ID
  getUser: async (id: string): Promise<UserProfile> => {
    const response = await apiClient.get(`/api/core/user/${id}`);
    return response.data.data;
  },

  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/api/core/user/profile');
    return response.data.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateUserRequest): Promise<UserProfile> => {
    const response = await apiClient.put('/api/core/user/profile', data);
    return response.data.data;
  },

  // Update user type (Buyer/Seller)
  updateUserType: async (userType: string): Promise<UserProfile> => {
    const response = await apiClient.put('/api/core/user/user-type', userType);
    return response.data.data;
  },

  // Sync user with Clerk
  syncWithClerk: async (): Promise<UserProfile> => {
    const response = await apiClient.post('/api/core/user/sync');
    return response.data.data;
  },

  // Update user role (admin only)
  updateUserRole: async (id: string, role: string): Promise<UserProfile> => {
    const response = await apiClient.put(`/api/core/user/${id}/role`, role);
    return response.data.data;
  },

  // Update user status (admin only)
  updateUserStatus: async (id: string, isActive: boolean): Promise<UserProfile> => {
    const response = await apiClient.put(`/api/core/user/${id}/status`, isActive);
    return response.data.data;
  }
};
```

### User Analytics API (New Structure)
```typescript
// src/lib/api/user-analytics-api.ts
import apiClient from '../api-client';
import type { DashboardOverview, UserSession, AnalyticsData } from '@/types/analytics';

export const userAnalyticsApi = {
  // Get dashboard overview
  getDashboardOverview: async (): Promise<DashboardOverview> => {
    const response = await apiClient.get('/api/core/user/analytics/dashboard/overview');
    return response.data.data;
  },

  // Get online users
  getOnlineUsers: async (): Promise<UserSession[]> => {
    const response = await apiClient.get('/api/core/user/analytics/users/online');
    return response.data.data;
  },

  // Get user activity
  getUserActivity: async (userId: string, params?: any): Promise<AnalyticsData> => {
    const response = await apiClient.get(`/api/core/user/analytics/users/${userId}/activity`, { params });
    return response.data.data;
  },

  // Update user online status
  updateOnlineStatus: async (sessionId: string, currentPage?: string): Promise<void> => {
    await apiClient.post('/api/core/user/analytics/users/online', {
      sessionId,
      currentPage
    });
  }
};
```

### Property Images API
```typescript
// src/lib/api/property-images-api.ts
import apiClient from '../api-client';
import type { PropertyImage, UploadImageRequest } from '@/types/property-image';

// New PropertyMedia API (Unified Images & Videos)
export const propertyMediaApi = {
  // Get all property media (images and videos)
  getPropertyMedia: async (propertyId: string): Promise<PropertyMedia[]> => {
    const response = await apiClient.get(`/api/sonobrokers/property-media/property/${propertyId}`);
    return response.data.data;
  },

  // Get property images only
  getPropertyImages: async (propertyId: string): Promise<PropertyMedia[]> => {
    const response = await apiClient.get(`/api/sonobrokers/property-media/property/${propertyId}/images`);
    return response.data.data;
  },

  // Get property videos only
  getPropertyVideos: async (propertyId: string): Promise<PropertyMedia[]> => {
    const response = await apiClient.get(`/api/sonobrokers/property-media/property/${propertyId}/videos`);
    return response.data.data;
  },

  // Upload media files (images and videos)
  uploadMedia: async (propertyId: string, files: File[]): Promise<PropertyMedia[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await apiClient.post(`/api/sonobrokers/property-media/property/${propertyId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Update media details
  updateMedia: async (data: UpdateMediaRequest): Promise<PropertyMedia> => {
    const response = await apiClient.put(`/api/sonobrokers/property-media/${data.id}`, data);
    return response.data.data;
  },

  // Delete media file
  deleteMedia: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/sonobrokers/property-media/${id}`);
  },

  // Set primary media
  setPrimaryMedia: async (propertyId: string, mediaId: string): Promise<void> => {
    await apiClient.put(`/api/sonobrokers/property-media/${propertyId}/primary/${mediaId}`);
  },

  // Reorder media files
  reorderMedia: async (propertyId: string, mediaIds: string[]): Promise<void> => {
    await apiClient.put(`/api/sonobrokers/property-media/property/${propertyId}/reorder`, {
      mediaIds
    });
  },
};

// Legacy PropertyImages API (Backward Compatibility)
export const propertyImagesApi = {
  // Get property images (legacy format)
  getPropertyImages: async (propertyId: string): Promise<PropertyImage[]> => {
    const response = await apiClient.get(`/api/sonobrokers/properties/${propertyId}/images`);
    return response.data.data;
  },

  // Upload property images (legacy format)
  uploadImages: async (propertyId: string, files: File[]): Promise<PropertyImage[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await apiClient.post(`/api/sonobrokers/properties/${propertyId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Delete property image (legacy)
  deleteImage: async (propertyId: string, imageId: string): Promise<void> => {
    await apiClient.delete(`/api/sonobrokers/properties/${propertyId}/images/${imageId}`);
  },

  // Update image
  updateImage: async (id: string, data: Partial<PropertyImage>): Promise<PropertyImage> => {
    const response = await apiClient.put(`/api/sonobrokers/property-images/${id}`, data);
    return response.data.data;
  },

  // Delete image
  deleteImage: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/sonobrokers/property-images/${id}`);
  },

  // Set primary image
  setPrimaryImage: async (propertyId: string, imageId: string): Promise<void> => {
    await apiClient.put(`/api/sonobrokers/property-images/${propertyId}/primary/${imageId}`);
  }
};
```

## Server Actions

### Property Actions
```typescript
// src/lib/actions/property-actions.ts
'use server';

import { propertiesApi } from '@/lib/api/properties-api';
import { revalidatePath } from 'next/cache';
import type { PropertySearchParams, CreatePropertyRequest } from '@/types/property';

export async function getPropertiesAction(params: PropertySearchParams) {
  try {
    const properties = await propertiesApi.searchProperties(params);
    return { success: true, data: properties };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return { success: false, error: 'Failed to fetch properties' };
  }
}

export async function getPropertyAction(id: string) {
  try {
    const property = await propertiesApi.getProperty(id);
    return { success: true, data: property };
  } catch (error) {
    console.error('Error fetching property:', error);
    return { success: false, error: 'Failed to fetch property' };
  }
}

export async function createPropertyAction(data: CreatePropertyRequest) {
  try {
    const property = await propertiesApi.createProperty(data);
    revalidatePath('/dashboard/properties');
    return { success: true, data: property };
  } catch (error) {
    console.error('Error creating property:', error);
    return { success: false, error: 'Failed to create property' };
  }
}

export async function updatePropertyAction(id: string, data: UpdatePropertyRequest) {
  try {
    const property = await propertiesApi.updateProperty(id, data);
    revalidatePath(`/properties/${id}`);
    revalidatePath('/dashboard/properties');
    return { success: true, data: property };
  } catch (error) {
    console.error('Error updating property:', error);
    return { success: false, error: 'Failed to update property' };
  }
}

export async function deletePropertyAction(id: string) {
  try {
    await propertiesApi.deleteProperty(id);
    revalidatePath('/dashboard/properties');
    return { success: true };
  } catch (error) {
    console.error('Error deleting property:', error);
    return { success: false, error: 'Failed to delete property' };
  }
}
```

### Core User Actions (Updated)
```typescript
// src/lib/actions/core-user-actions.ts
'use server';

import { coreUserApi } from '@/lib/api/core-user-api';
import { revalidatePath } from 'next/cache';
import type { UpdateUserRequest } from '@/types/user';

export async function getUserProfileAction() {
  try {
    const profile = await coreUserApi.getProfile();
    return { success: true, data: profile };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, error: 'Failed to fetch user profile' };
  }
}

export async function updateUserProfileAction(data: UpdateUserRequest) {
  try {
    const profile = await coreUserApi.updateProfile(data);
    revalidatePath('/dashboard/profile');
    return { success: true, data: profile };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update user profile' };
  }
}

export async function updateUserTypeAction(userType: string) {
  try {
    const profile = await coreUserApi.updateUserType(userType);
    revalidatePath('/dashboard/profile');
    return { success: true, data: profile };
  } catch (error) {
    console.error('Error updating user type:', error);
    return { success: false, error: 'Failed to update user type' };
  }
}

export async function syncUserWithClerkAction() {
  try {
    const profile = await coreUserApi.syncWithClerk();
    revalidatePath('/dashboard/profile');
    return { success: true, data: profile };
  } catch (error) {
    console.error('Error syncing user with Clerk:', error);
    return { success: false, error: 'Failed to sync user' };
  }
}
```

### User Analytics Actions (New)
```typescript
// src/lib/actions/user-analytics-actions.ts
'use server';

import { userAnalyticsApi } from '@/lib/api/user-analytics-api';
import { revalidatePath } from 'next/cache';

export async function getDashboardOverviewAction() {
  try {
    const overview = await userAnalyticsApi.getDashboardOverview();
    return { success: true, data: overview };
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    return { success: false, error: 'Failed to fetch dashboard data' };
  }
}

export async function getOnlineUsersAction() {
  try {
    const users = await userAnalyticsApi.getOnlineUsers();
    return { success: true, data: users };
  } catch (error) {
    console.error('Error fetching online users:', error);
    return { success: false, error: 'Failed to fetch online users' };
  }
}

export async function updateUserOnlineStatusAction(sessionId: string, currentPage?: string) {
  try {
    await userAnalyticsApi.updateOnlineStatus(sessionId, currentPage);
    return { success: true };
  } catch (error) {
    console.error('Error updating online status:', error);
    return { success: false, error: 'Failed to update online status' };
  }
}
```

## Component Integration

### Using Server Actions in Components
```typescript
// src/components/PropertyList.tsx
import { getPropertiesAction } from '@/lib/actions/property-actions';
import { PropertyCard } from './PropertyCard';

interface PropertyListProps {
  searchParams: PropertySearchParams;
}

export async function PropertyList({ searchParams }: PropertyListProps) {
  const result = await getPropertiesAction(searchParams);

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {result.data.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

### Client-Side API Calls
```typescript
// src/components/PropertyFormClient.tsx
'use client';

import { useState } from 'react';
import { createPropertyAction } from '@/lib/actions/property-actions';
import { useRouter } from 'next/navigation';

export function PropertyFormClient() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      // ... other fields
    };

    const result = await createPropertyAction(data);
    
    if (result.success) {
      router.push(`/properties/${result.data.id}`);
    } else {
      // Handle error
      console.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <form action={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Property'}
      </button>
    </form>
  );
}
```

## Error Handling

### API Error Response Format
```typescript
interface ApiErrorResponse {
  success: false;
  message: string;
  errors: string[];
  statusCode: number;
  timestamp: string;
}
```

### Error Handling in Services
```typescript
// src/lib/api/error-handler.ts
export function handleApiError(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.status === 401) {
    return 'Authentication required';
  }
  
  if (error.response?.status === 403) {
    return 'Access denied';
  }
  
  if (error.response?.status === 404) {
    return 'Resource not found';
  }
  
  if (error.response?.status >= 500) {
    return 'Server error occurred';
  }
  
  return 'An unexpected error occurred';
}
```

## Testing API Integration

### Test Endpoints (Updated Structure)
```bash
# Test API connectivity
curl http://localhost:5005/health
curl http://localhost:5005/api/sonobrokers/test/ping

# Test Core User endpoints
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5005/api/core/user/profile

# Test User Analytics endpoints
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5005/api/core/user/analytics/dashboard/overview

# Test Properties endpoints
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5005/api/sonobrokers/properties

# Test Clerk webhooks (POST only)
curl -X POST -H "Content-Type: application/json" \
     http://localhost:5005/api/core/clerk/webhooks
```

### Automated API Testing
Use the provided test scripts:

```bash
# Node.js test script
cd SoNoBrokers
node test-api-connectivity.js

# React test component
# Visit: http://localhost:3000/test/api-connectivity
```

### Integration Tests (Updated)
```typescript
// src/__tests__/api/core-user.test.ts
import { coreUserApi } from '@/lib/api/core-user-api';

describe('Core User API', () => {
  it('should fetch user profile', async () => {
    const profile = await coreUserApi.getProfile();
    expect(profile.id).toBeDefined();
    expect(profile.email).toBeDefined();
  });

  it('should update user type', async () => {
    const updatedProfile = await coreUserApi.updateUserType('Seller');
    expect(updatedProfile.userType).toBe('Seller');
  });
});

// src/__tests__/api/user-analytics.test.ts
import { userAnalyticsApi } from '@/lib/api/user-analytics-api';

describe('User Analytics API', () => {
  it('should fetch dashboard overview', async () => {
    const overview = await userAnalyticsApi.getDashboardOverview();
    expect(overview.totalUsers).toBeDefined();
    expect(overview.activeUsers).toBeDefined();
  });

  it('should fetch online users', async () => {
    const users = await userAnalyticsApi.getOnlineUsers();
    expect(Array.isArray(users)).toBe(true);
  });
});
```

## Performance Optimization

### Caching Strategy
- Use Next.js built-in caching for static data
- Implement SWR or React Query for client-side caching
- Cache API responses at the server level
- Use revalidation for dynamic content

### Request Optimization
- Implement request batching where possible
- Use pagination for large datasets
- Optimize image uploads with compression
- Implement proper loading states

## Security Considerations

### Authentication
- All API calls require valid Clerk JWT tokens
- Tokens are automatically refreshed
- Implement proper logout handling
- Secure token storage

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- Input validation and sanitization
- Rate limiting and abuse prevention

## Migration Status (Updated December 2024)

### ✅ Completed
- **Controller Reorganization**: Core vs SoNoBrokers controller separation
- **API client configuration**: Updated for new endpoint structure
- **Core User API**: Complete user management with new endpoints
- **User Analytics API**: Dashboard and analytics functionality
- **Clerk Integration**: Webhook handling and user synchronization
- **Properties API**: Full CRUD operations
- **Authentication integration**: JWT token handling
- **Error handling framework**: Comprehensive error management
- **API Testing Tools**: Node.js and React test components

### 🔄 In Progress
- Advanced property features (scheduling, communication)
- Property image management optimization
- Real-time analytics updates
- Performance optimization
- Comprehensive testing coverage

### 📋 Pending
- Real-time features (WebSocket integration)
- Advanced caching strategies
- Monitoring and analytics dashboard
- Production deployment optimization
- Mobile app API support

## API Endpoints Summary

### Core Controllers (`/api/core/`)
- **User Management**: `/api/core/user/*` - 8 endpoints
- **User Analytics**: `/api/core/user/analytics/*` - 4 endpoints
- **Clerk Webhooks**: `/api/core/clerk/webhooks` - 1 endpoint

### SoNoBrokers Controllers (`/api/sonobrokers/`)
- **Properties**: `/api/sonobrokers/properties/*` - 10+ endpoints
- **Subscriptions**: `/api/sonobrokers/subscriptions/*` - 5+ endpoints
- **Test**: `/api/sonobrokers/test/ping` - 1 endpoint

### Health & Monitoring
- **Health Check**: `/health` - 1 endpoint
- **API Documentation**: `/scalar/v1` - Interactive API docs

## Next Steps

1. **Complete Property Features**: Finish advanced property management
2. **Implement Real-time Features**: WebSocket integration for live updates
3. **Add Comprehensive Testing**: Unit and integration tests for all endpoints
4. **Performance Optimization**: Caching and query optimization
5. **Production Deployment**: Environment-specific configurations

## Testing & Validation

Use the provided testing tools to validate API connectivity:

- **Node.js Script**: `node test-api-connectivity.js`
- **React Component**: Visit `/test/api-connectivity` in your browser
- **Manual Testing**: Use the curl commands provided above

For more information, see:
- [Controller Architecture Guide](./controller-architecture.md)
- [React-API Mapping](./React-API-Mapping.md)
- [API Documentation](../../SoNoBrokersWebApi/MicroSaasWebApi.App/Documentation/)
- Interactive API docs at `/scalar/v1` when running the API
