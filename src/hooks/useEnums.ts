'use client';

import { useState, useEffect } from 'react';

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  value: string;
}

export interface UserTypeOption {
  value: string;
  label: string;
}

interface EnumData {
  countries: CountryOption[];
  userTypes: UserTypeOption[];
}

// Client-side cache
let clientCache: {
  data?: EnumData;
  lastFetch?: number;
} = {};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch enum values from API
async function fetchEnumValues(): Promise<EnumData> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (clientCache.data && clientCache.lastFetch && (now - clientCache.lastFetch) < CACHE_DURATION) {
    return clientCache.data;
  }

  try {
    const response = await fetch('/api/enums');
    if (!response.ok) {
      throw new Error('Failed to fetch enum values');
    }
    
    const data = await response.json();
    
    // Update cache
    clientCache.data = data;
    clientCache.lastFetch = now;
    
    return data;
  } catch (error) {
    console.error('Failed to fetch enum values:', error);
    throw new Error('Unable to load application configuration. Please refresh the page or contact support.');
  }
}

// Hook to get countries
export function useCountries() {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCountries() {
      try {
        setLoading(true);
        const data = await fetchEnumValues();
        setCountries(data.countries);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load countries');
      } finally {
        setLoading(false);
      }
    }

    loadCountries();
  }, []);

  return { countries, loading, error };
}

// Hook to get user types
export function useUserTypes() {
  const [userTypes, setUserTypes] = useState<UserTypeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserTypes() {
      try {
        setLoading(true);
        const data = await fetchEnumValues();
        setUserTypes(data.userTypes);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user types');
      } finally {
        setLoading(false);
      }
    }

    loadUserTypes();
  }, []);

  return { userTypes, loading, error };
}

// Hook to get all enum values
export function useEnums() {
  const [enumData, setEnumData] = useState<EnumData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEnums() {
      try {
        setLoading(true);
        const data = await fetchEnumValues();
        setEnumData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load enum values');
      } finally {
        setLoading(false);
      }
    }

    loadEnums();
  }, []);

  return { 
    countries: enumData?.countries || [], 
    userTypes: enumData?.userTypes || [], 
    loading, 
    error 
  };
}

// Function to refresh enum cache
export function refreshEnumCache() {
  clientCache = {};
}
