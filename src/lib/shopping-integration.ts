// Shopping Integration Service
// This service handles affiliate links, price comparisons, and regional shopping

export interface ShoppingItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  description: string;
  category: string;
  color: string;
  sizes: string[];
  affiliateUrl: string;
  retailer: string;
  rating?: number;
  reviews?: number;
  inStock: boolean;
  salePercentage?: number;
  region: string;
}

export interface ShoppingFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  color?: string;
  size?: string;
  region?: string;
  onSale?: boolean;
}

// Mock shopping data - in a real app, this would come from APIs like Amazon, Shopify, etc.
const mockShoppingData: ShoppingItem[] = [
  {
    id: '1',
    name: 'Classic White Button-Down Shirt',
    brand: 'Everlane',
    price: 45,
    originalPrice: 68,
    currency: 'USD',
    image: '/api/placeholder/300/400',
    description: 'Crisp white cotton button-down shirt with a relaxed fit',
    category: 'tops',
    color: 'white',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    affiliateUrl: 'https://everlane.com/products/womens-relaxed-shirt-white?affiliate=fashionai',
    retailer: 'Everlane',
    rating: 4.5,
    reviews: 1250,
    inStock: true,
    salePercentage: 34,
    region: 'US'
  },
  {
    id: '2',
    name: 'High-Waisted Straight Leg Jeans',
    brand: "Levi's",
    price: 89,
    currency: 'USD',
    image: '/api/placeholder/300/400',
    description: 'Classic high-waisted straight leg jeans in dark wash',
    category: 'bottoms',
    color: 'dark blue',
    sizes: ['24', '25', '26', '27', '28', '29', '30', '31', '32'],
    affiliateUrl: 'https://levi.com/products/womens-501-original-jeans?affiliate=fashionai',
    retailer: "Levi's",
    rating: 4.3,
    reviews: 890,
    inStock: true,
    region: 'US'
  },
  {
    id: '3',
    name: 'Wool Blend Blazer',
    brand: 'J.Crew',
    price: 128,
    originalPrice: 198,
    currency: 'USD',
    image: '/api/placeholder/300/400',
    description: 'Structured wool blend blazer in navy with notched lapels',
    category: 'outerwear',
    color: 'navy',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    affiliateUrl: 'https://jcrew.com/products/womens-blazer-navy?affiliate=fashionai',
    retailer: 'J.Crew',
    rating: 4.7,
    reviews: 456,
    inStock: true,
    salePercentage: 35,
    region: 'US'
  },
  {
    id: '4',
    name: 'Leather Ankle Boots',
    brand: 'Steve Madden',
    price: 95,
    currency: 'USD',
    image: '/api/placeholder/300/400',
    description: 'Black leather ankle boots with block heel',
    category: 'shoes',
    color: 'black',
    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'],
    affiliateUrl: 'https://stevemadden.com/products/womens-ankle-boots-black?affiliate=fashionai',
    retailer: 'Steve Madden',
    rating: 4.2,
    reviews: 678,
    inStock: true,
    region: 'US'
  },
  {
    id: '5',
    name: 'Cashmere Blend Sweater',
    brand: 'Uniqlo',
    price: 39,
    originalPrice: 59,
    currency: 'USD',
    image: '/api/placeholder/300/400',
    description: 'Soft cashmere blend crew neck sweater in cream',
    category: 'tops',
    color: 'cream',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    affiliateUrl: 'https://uniqlo.com/products/womens-cashmere-sweater-cream?affiliate=fashionai',
    retailer: 'Uniqlo',
    rating: 4.6,
    reviews: 1100,
    inStock: true,
    salePercentage: 34,
    region: 'US'
  }
];

export class ShoppingService {
  private static instance: ShoppingService;
  private affiliateId: string = 'fashionai-001';

  private constructor() {}

  public static getInstance(): ShoppingService {
    if (!ShoppingService.instance) {
      ShoppingService.instance = new ShoppingService();
    }
    return ShoppingService.instance;
  }

  // Search for items based on filters
  public searchItems(filters: ShoppingFilter): ShoppingItem[] {
    let results = [...mockShoppingData];

    if (filters.category) {
      results = results.filter(item => item.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      results = results.filter(item => item.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter(item => item.price <= filters.maxPrice!);
    }

    if (filters.brand) {
      results = results.filter(item => 
        item.brand.toLowerCase().includes(filters.brand!.toLowerCase())
      );
    }

    if (filters.color) {
      results = results.filter(item => 
        item.color.toLowerCase().includes(filters.color!.toLowerCase())
      );
    }

    if (filters.region) {
      results = results.filter(item => item.region === filters.region);
    }

    if (filters.onSale) {
      results = results.filter(item => item.salePercentage && item.salePercentage > 0);
    }

    return results;
  }

  // Get items on sale in a specific region
  public getSaleItems(region: string = 'US', category?: string): ShoppingItem[] {
    return this.searchItems({
      region,
      category,
      onSale: true
    });
  }

  // Get budget-friendly items
  public getBudgetItems(maxPrice: number, category?: string, region: string = 'US'): ShoppingItem[] {
    return this.searchItems({
      maxPrice,
      category,
      region
    });
  }

  // Generate affiliate URL with tracking
  public generateAffiliateUrl(item: ShoppingItem, source: string = 'outfit-builder'): string {
    const baseUrl = item.affiliateUrl;
    const trackingParams = new URLSearchParams({
      utm_source: 'fashionai',
      utm_medium: source,
      utm_campaign: 'outfit_recommendation',
      affiliate_id: this.affiliateId,
      item_id: item.id
    });

    return `${baseUrl}&${trackingParams.toString()}`;
  }

  // Track affiliate click
  public async trackClick(item: ShoppingItem, source: string = 'unknown', userId?: string): Promise<void> {
    try {
      await fetch('/api/affiliate/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item.id,
          itemName: item.name,
          brand: item.brand,
          price: item.price,
          category: item.category,
          userId,
          source,
          region: item.region
        })
      });
    } catch (error) {
      console.error('Failed to track affiliate click:', error);
    }
  }

  // Get price comparison for similar items
  public getPriceComparison(itemId: string): ShoppingItem[] {
    const item = mockShoppingData.find(i => i.id === itemId);
    if (!item) return [];

    // Find similar items (same category and color)
    return mockShoppingData.filter(i => 
      i.id !== itemId && 
      i.category === item.category && 
      i.color === item.color
    ).sort((a, b) => a.price - b.price);
  }

  // Get regional availability
  public getRegionalAvailability(itemId: string): string[] {
    // In a real app, this would check multiple regional APIs
    return ['US', 'CA', 'UK', 'EU'];
  }

  // Calculate savings
  public calculateSavings(item: ShoppingItem): number {
    if (!item.originalPrice) return 0;
    return item.originalPrice - item.price;
  }

  // Get recommended items based on user profile
  public getRecommendedItems(userProfile: any, category?: string): ShoppingItem[] {
    let items = mockShoppingData;

    if (category) {
      items = items.filter(item => item.category === category);
    }

    // Filter by budget if available
    if (userProfile?.stylePreferences?.budget) {
      const budgetRanges = {
        'budget': { min: 0, max: 50 },
        'moderate': { min: 50, max: 150 },
        'mid-range': { min: 150, max: 300 },
        'premium': { min: 300, max: 500 },
        'luxury': { min: 500, max: Infinity }
      };

      const range = budgetRanges[userProfile.stylePreferences.budget as keyof typeof budgetRanges];
      if (range) {
        items = items.filter(item => item.price >= range.min && item.price <= range.max);
      }
    }

    // Filter by region
    if (userProfile?.stylePreferences?.region) {
      const regionMap: { [key: string]: string } = {
        'us': 'US',
        'ca': 'CA',
        'uk': 'UK',
        'eu': 'EU'
      };
      const region = regionMap[userProfile.stylePreferences.region];
      if (region) {
        items = items.filter(item => item.region === region);
      }
    }

    return items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
}

export const shoppingService = ShoppingService.getInstance();
