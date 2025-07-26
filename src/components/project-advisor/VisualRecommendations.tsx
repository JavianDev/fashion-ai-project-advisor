"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { shoppingService, ShoppingItem } from '@/lib/shopping-integration';

interface VisualRecommendationsProps {
  userProfile?: any;
  selectedCategory?: string;
  selectedColor?: string;
  budget?: string;
  region?: string;
  onItemClick?: (item: ShoppingItem) => void;
}

export default function VisualRecommendations({
  userProfile,
  selectedCategory,
  selectedColor,
  budget,
  region = 'US',
  onItemClick
}: VisualRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<ShoppingItem[]>([]);
  const [saleItems, setSaleItems] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, [userProfile, selectedCategory, selectedColor, budget, region]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    
    try {
      // Get recommended items based on user profile and filters
      const budgetRanges = {
        'budget': { min: 0, max: 50 },
        'moderate': { min: 50, max: 150 },
        'mid-range': { min: 150, max: 300 },
        'premium': { min: 300, max: 500 },
        'luxury': { min: 500, max: Infinity }
      };

      const budgetRange = budget ? budgetRanges[budget as keyof typeof budgetRanges] : undefined;

      const filters = {
        category: selectedCategory,
        color: selectedColor,
        region,
        minPrice: budgetRange?.min,
        maxPrice: budgetRange?.max
      };

      const items = shoppingService.searchItems(filters);
      setRecommendations(items.slice(0, 6)); // Limit to 6 items

      // Get sale items
      const onSaleItems = shoppingService.getSaleItems(region, selectedCategory);
      setSaleItems(onSaleItems.slice(0, 4)); // Limit to 4 sale items

    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShopItem = async (item: ShoppingItem) => {
    const affiliateUrl = shoppingService.generateAffiliateUrl(item, 'visual-recommendations');

    // Track click for affiliate commission
    await shoppingService.trackClick(item, 'visual-recommendations');

    // Track click for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        item_id: item.id,
        item_name: item.name,
        item_brand: item.brand,
        item_category: item.category,
        price: item.price,
        currency: item.currency
      });
    }

    // Open affiliate link in new tab
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');

    if (onItemClick) {
      onItemClick(item);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Finding Perfect Items...
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Searching for the best deals and recommendations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Sale Items Section */}
      {saleItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">On Sale Now</h3>
            <Badge variant="destructive" className="ml-2">Limited Time</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {saleItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-t-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  
                  {item.salePercentage && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                      -{item.salePercentage}%
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm line-clamp-2">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.brand}</p>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">
                        {formatPrice(item.price, item.currency)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-slate-500 line-through">
                          {formatPrice(item.originalPrice, item.currency)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(item.rating || 0))}
                        {'☆'.repeat(5 - Math.floor(item.rating || 0))}
                      </div>
                      <span className="text-slate-500">({item.reviews})</span>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => handleShopItem(item)}
                    >
                      Shop Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Recommended for You</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 dark:border-slate-700">
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-t-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 capitalize">
                      {item.category}
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.brand}</p>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg text-primary">
                        {formatPrice(item.price, item.currency)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-slate-500 line-through">
                          {formatPrice(item.originalPrice, item.currency)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(item.rating || 0))}
                        {'☆'.repeat(5 - Math.floor(item.rating || 0))}
                      </div>
                      <span className="text-slate-500">({item.reviews} reviews)</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1"
                        onClick={() => handleShopItem(item)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Shop Now
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Add to wishlist functionality
                          alert(`Added ${item.name} to wishlist!`);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {recommendations.length === 0 && saleItems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No items found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your filters or browse different categories
          </p>
        </div>
      )}
    </div>
  );
}
