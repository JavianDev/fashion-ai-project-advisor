import { auth } from '@clerk/nextjs/server'
import { apiClient } from "@/lib/lib/api-client"

/**
 * Admin API Service
 * Handles administrative functions and system management
 */

// Types
export interface AdminDashboardStats {
  users: {
    total: number
    active: number
    newThisMonth: number
    buyers: number
    sellers: number
  }
  properties: {
    total: number
    active: number
    sold: number
    pending: number
    newThisMonth: number
  }
  advertisers: {
    total: number
    active: number
    premium: number
    verified: number
    newThisMonth: number
  }
  revenue: {
    thisMonth: number
    lastMonth: number
    growth: number
    totalRevenue: number
  }
  activity: {
    dailyActiveUsers: number
    propertyViews: number
    searchQueries: number
    contactRequests: number
  }
}

export interface AdminUser {
  id: string
  email: string
  fullName: string
  role: string
  userType: string
  isActive: boolean
  loggedIn: boolean
  createdAt: string
  lastLoginAt?: string
  propertiesCount: number
  advertiserProfile?: {
    id: string
    businessName: string
    serviceType: string
    plan: string
    status: string
  }
}

export interface AdminUserSearchParams {
  page?: number
  limit?: number
  role?: string
  userType?: string
  isActive?: boolean
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface AdminUserSearchResponse {
  users: AdminUser[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  database: {
    status: 'connected' | 'disconnected'
    responseTime: number
    connections: number
  }
  api: {
    status: 'operational' | 'degraded' | 'down'
    responseTime: number
    errorRate: number
  }
  external: {
    clerk: boolean
    supabase: boolean
    resend: boolean
  }
  performance: {
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
  }
  lastChecked: string
}

export interface AdminActivity {
  id: string
  userId: string
  userEmail: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  createdAt: string
}

/**
 * Server Action: Get admin dashboard statistics
 */
export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  try {
    const { getToken } = await auth()
    const token = await getToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const stats = await apiClient.get<AdminDashboardStats>('/api/admin/dashboard/stats')
    return stats
  } catch (error) {
    console.error('Failed to get admin dashboard stats:', error)
    throw error
  }
}

/**
 * Server Action: Get all users for admin management
 */
export async function getAdminUsers(params: AdminUserSearchParams = {}): Promise<AdminUserSearchResponse> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })

    const response = await apiClient.get<AdminUserSearchResponse>(`/api/admin/users?${searchParams}`)
    return response
  } catch (error) {
    console.error('Failed to get admin users:', error)
    throw error
  }
}

/**
 * Server Action: Update user role
 */
export async function updateUserRoleAdmin(userId: string, role: string): Promise<AdminUser> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const user = await apiClient.put<AdminUser>(`/api/admin/users/${userId}/role`, { role })
    return user
  } catch (error) {
    console.error('Failed to update user role:', error)
    throw error
  }
}

/**
 * Server Action: Activate/Deactivate user
 */
export async function toggleUserStatus(userId: string, isActive: boolean): Promise<AdminUser> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const user = await apiClient.put<AdminUser>(`/api/admin/users/${userId}/status`, { isActive })
    return user
  } catch (error) {
    console.error('Failed to toggle user status:', error)
    throw error
  }
}

/**
 * Server Action: Get system health status
 */
export async function getSystemHealth(): Promise<SystemHealth> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const health = await apiClient.get<SystemHealth>('/api/admin/system/health')
    return health
  } catch (error) {
    console.error('Failed to get system health:', error)
    throw error
  }
}

/**
 * Server Action: Get admin activity logs
 */
export async function getAdminActivityLogs(params: {
  page?: number
  limit?: number
  userId?: string
  action?: string
  resource?: string
  startDate?: string
  endDate?: string
} = {}): Promise<{
  activities: AdminActivity[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })

    const response = await apiClient.get(`/api/admin/activity-logs?${searchParams}`) as any
    return response.data || { activities: [], total: 0, page: 1, totalPages: 0 }
  } catch (error) {
    console.error('Failed to get admin activity logs:', error)
    throw error
  }
}

/**
 * Server Action: Export data
 */
export async function exportData(type: 'users' | 'properties' | 'advertisers', format: 'csv' | 'json' = 'csv'): Promise<{
  downloadUrl: string
  filename: string
  expiresAt: string
}> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await apiClient.post(`/api/admin/export`, { type, format }) as any
    return response.data || { downloadUrl: '', filename: '', expiresAt: '' }
  } catch (error) {
    console.error('Failed to export data:', error)
    throw error
  }
}

/**
 * Server Action: Get property management data for admin
 */
export async function getAdminProperties(params: {
  page?: number
  limit?: number
  status?: string
  sellerId?: string
  search?: string
} = {}): Promise<{
  properties: any[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })

    const response = await apiClient.get(`/api/admin/properties?${searchParams}`) as any
    return response.data || { properties: [], total: 0, page: 1, totalPages: 0 }
  } catch (error) {
    console.error('Failed to get admin properties:', error)
    throw error
  }
}

/**
 * Server Action: Get advertiser management data for admin
 */
export async function getAdminAdvertisers(params: {
  page?: number
  limit?: number
  status?: string
  serviceType?: string
  plan?: string
  search?: string
} = {}): Promise<{
  advertisers: any[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })

    const response = await apiClient.get(`/api/admin/advertisers?${searchParams}`) as any
    return response.data || { advertisers: [], total: 0, page: 1, totalPages: 0 }
  } catch (error) {
    console.error('Failed to get admin advertisers:', error)
    throw error
  }
}

/**
 * Server Action: Verify advertiser
 */
export async function verifyAdvertiser(advertiserId: string, isVerified: boolean): Promise<void> {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    await apiClient.put(`/api/admin/advertisers/${advertiserId}/verify`, { isVerified })
  } catch (error) {
    console.error('Failed to verify advertiser:', error)
    throw error
  }
}
