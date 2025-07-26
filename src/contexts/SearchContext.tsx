'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface SearchParams {
  searchQuery: string
  mlsNumber: string
  propertyType: string
  adType: string
  priceMin: string
  priceMax: string
  yearBuiltMin: string
  yearBuiltMax: string
  beds: string
  baths: string
  storeys: string
  parkingTypes: string[]
  extraFeatures: string[]
}

interface SearchContextType {
  searchParams: SearchParams
  setSearchParams: (params: Partial<SearchParams>) => void
  resetSearchParams: () => void
}

const defaultSearchParams: SearchParams = {
  searchQuery: '',
  mlsNumber: '',
  propertyType: '',
  adType: '',
  priceMin: '',
  priceMax: '',
  yearBuiltMin: '',
  yearBuiltMax: '',
  beds: '',
  baths: '',
  storeys: '',
  parkingTypes: [],
  extraFeatures: []
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParamsState] = useState<SearchParams>(defaultSearchParams)

  const setSearchParams = (params: Partial<SearchParams>) => {
    setSearchParamsState(prev => ({ ...prev, ...params }))
  }

  const resetSearchParams = () => {
    setSearchParamsState(defaultSearchParams)
  }

  return (
    <SearchContext.Provider value={{ searchParams, setSearchParams, resetSearchParams }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

export function useSearchOptional() {
  const context = useContext(SearchContext)
  return context
}
