"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import { shoppingService, ShoppingItem } from '@/lib/shopping-integration';
import VisualRecommendations from '@/components/project-advisor/VisualRecommendations';

interface OutfitItem {
  id: string;
  type: string;
  color: string;
  brand?: string;
  price?: string;
  image?: string;
  description: string;
}

interface OutfitSuggestion {
  id: string;
  name: string;
  items: OutfitItem[];
  occasion: string;
  style: string;
  totalPrice?: string;
}

export default function OutfitBuilderPage() {
  const router = useRouter();
  const [selectedItemColor, setSelectedItemColor] = useState('');
  const [selectedItemType, setSelectedItemType] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Load user profile on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Mock outfit suggestions - in a real app, this would come from an API
  const generateMockSuggestions = (itemType: string, color: string, occasion: string): OutfitSuggestion[] => {
    const mockSuggestions: OutfitSuggestion[] = [
      {
        id: '1',
        name: 'Classic Professional Look',
        occasion: 'business professional',
        style: 'classic',
        totalPrice: '$180-250',
        items: [
          {
            id: '1a',
            type: 'blazer',
            color: 'navy',
            brand: 'J.Crew',
            price: '$89',
            description: 'Navy wool blazer with structured shoulders',
            image: '/api/placeholder/200/250'
          },
          {
            id: '1b',
            type: 'shirt',
            color: 'white',
            brand: 'Everlane',
            price: '$45',
            description: 'Crisp white cotton button-down',
            image: '/api/placeholder/200/250'
          },
          {
            id: '1c',
            type: 'pants',
            color: 'charcoal',
            brand: 'Banana Republic',
            price: '$65',
            description: 'Tailored charcoal trousers',
            image: '/api/placeholder/200/250'
          }
        ]
      },
      {
        id: '2',
        name: 'Casual Weekend Vibes',
        occasion: 'casual',
        style: 'casual',
        totalPrice: '$95-140',
        items: [
          {
            id: '2a',
            type: 'sweater',
            color: 'cream',
            brand: 'Uniqlo',
            price: '$35',
            description: 'Soft cashmere-blend sweater',
            image: '/api/placeholder/200/250'
          },
          {
            id: '2b',
            type: 'jeans',
            color: 'dark wash',
            brand: 'Levi\'s',
            price: '$60',
            description: 'High-waisted straight leg jeans',
            image: '/api/placeholder/200/250'
          },
          {
            id: '2c',
            type: 'sneakers',
            color: 'white',
            brand: 'Adidas',
            price: '$85',
            description: 'Classic white leather sneakers',
            image: '/api/placeholder/200/250'
          }
        ]
      },
      {
        id: '3',
        name: 'Date Night Elegance',
        occasion: 'date night',
        style: 'romantic',
        totalPrice: '$120-200',
        items: [
          {
            id: '3a',
            type: 'dress',
            color: 'burgundy',
            brand: 'Zara',
            price: '$79',
            description: 'Midi wrap dress in burgundy',
            image: '/api/placeholder/200/250'
          },
          {
            id: '3b',
            type: 'heels',
            color: 'nude',
            brand: 'Steve Madden',
            price: '$65',
            description: 'Nude block heel sandals',
            image: '/api/placeholder/200/250'
          },
          {
            id: '3c',
            type: 'jacket',
            color: 'black',
            brand: 'H&M',
            price: '$45',
            description: 'Black leather moto jacket',
            image: '/api/placeholder/200/250'
          }
        ]
      }
    ];

    // Filter suggestions based on occasion
    return mockSuggestions.filter(suggestion =>
      !occasion || suggestion.occasion === occasion
    );
  };

  const handleGetSuggestions = async () => {
    if (!selectedItemType) {
      alert("Please select an item type.");
      return;
    }

    setIsLoading(true);

    try {
      // Generate mock suggestions based on selections
      const mockSuggestions = generateMockSuggestions(selectedItemType, selectedItemColor, selectedOccasion);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real application, this would call the RAG API
      const response = await fetch('/api/rag/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_profile: userProfile || {},
          clothing_item: {
            color: selectedItemColor,
            type: selectedItemType,
          },
          occasion: selectedOccasion,
          budget: selectedBudget,
        }),
      });

      const data = await response.json();

      // Combine AI recommendation with mock visual suggestions
      setSuggestions(mockSuggestions);

    } catch (error) {
      console.error("Error fetching suggestions:", error);
      // Still show mock suggestions on error
      const mockSuggestions = generateMockSuggestions(selectedItemType, selectedItemColor, selectedOccasion);
      setSuggestions(mockSuggestions);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          AI Outfit Builder
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Create Perfect Outfits
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
          Mix and match clothes to create the perfect outfit. Select a piece you have, and our AI will suggest
          matching items with shopping links and budget-friendly options.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Visual Recommendations
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Shopping Integration
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Budget Filtering
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Style Matching
          </div>
        </div>
      </div>

      {/* Selection Form */}
      <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">Build Your Outfit</CardTitle>
          <CardDescription>Tell us about the item you want to style, and we'll create complete outfit suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="itemType" className="text-slate-700 dark:text-slate-300 font-medium">Item Type</Label>
              <Select onValueChange={setSelectedItemType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top/Shirt</SelectItem>
                  <SelectItem value="bottom">Bottom/Pants</SelectItem>
                  <SelectItem value="dress">Dress</SelectItem>
                  <SelectItem value="jacket">Jacket/Blazer</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemColor" className="text-slate-700 dark:text-slate-300 font-medium">Item Color</Label>
              <Input
                id="itemColor"
                type="text"
                value={selectedItemColor}
                onChange={(e) => setSelectedItemColor(e.target.value)}
                placeholder="e.g., black, white, navy"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occasion" className="text-slate-700 dark:text-slate-300 font-medium">Occasion</Label>
              <Select onValueChange={setSelectedOccasion}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="business professional">Business Professional</SelectItem>
                  <SelectItem value="date night">Date Night</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="sporty">Sporty/Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className="text-slate-700 dark:text-slate-300 font-medium">Budget Range</Label>
              <Select onValueChange={setSelectedBudget}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget ($0-50)</SelectItem>
                  <SelectItem value="moderate">Moderate ($50-150)</SelectItem>
                  <SelectItem value="mid-range">Mid-Range ($150-300)</SelectItem>
                  <SelectItem value="premium">Premium ($300+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Button
              onClick={handleGetSuggestions}
              disabled={isLoading || !selectedItemType}
              size="lg"
              className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white mr-2"></div>
                  Creating Outfits...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Get Outfit Suggestions
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Outfit Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Your Outfit Suggestions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Here are personalized outfit combinations based on your selections. Click on items to shop or save outfits for later.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {suggestions.map((outfit) => (
              <Card key={outfit.id} className="group hover:shadow-2xl transition-all duration-300 border-slate-200 dark:border-slate-700 overflow-hidden">
                <CardHeader className="text-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {outfit.occasion}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {outfit.totalPrice}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-slate-900 dark:text-slate-100">{outfit.name}</CardTitle>
                  <CardDescription className="capitalize">{outfit.style} style</CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {outfit.items.map((item) => (
                      <div key={item.id} className="group/item cursor-pointer">
                        <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl mb-3 flex items-center justify-center group-hover/item:scale-105 transition-transform duration-200">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            </div>
                            <div className="text-xs font-medium text-slate-600 dark:text-slate-400 capitalize">
                              {item.type}
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize mb-1">
                            {item.color} {item.type}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            {item.brand}
                          </div>
                          <div className="text-sm font-semibold text-primary">
                            {item.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
                      onClick={() => {
                        // Open shopping modal with individual items
                        const itemsToShop = outfit.items.map(item => ({
                          name: `${item.color} ${item.type}`,
                          brand: item.brand,
                          price: item.price,
                          category: item.type
                        }));

                        // In a real app, this would open a detailed shopping modal
                        const message = `Shopping for ${outfit.name}:\n\n` +
                          itemsToShop.map(item => `• ${item.name} by ${item.brand} - ${item.price}`).join('\n') +
                          `\n\nTotal: ${outfit.totalPrice}`;

                        alert(message);
                      }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Shop This Outfit
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          // Save outfit functionality
                          alert(`Saved ${outfit.name} to favorites!`);
                        }}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Save
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          // Share outfit functionality
                          if (navigator.share) {
                            navigator.share({
                              title: outfit.name,
                              text: `Check out this ${outfit.style} outfit for ${outfit.occasion}!`,
                              url: window.location.href
                            });
                          } else {
                            alert('Outfit link copied to clipboard!');
                          }
                        }}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Actions */}
          <div className="text-center space-y-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/project-advisor/virtual-try-on')}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Try Virtual Fitting
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push('/project-advisor/profile')}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Update Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Recommendations */}
      {suggestions.length > 0 && (
        <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">Shop Similar Items</CardTitle>
            <CardDescription>Find the perfect pieces to complete your outfit with exclusive deals</CardDescription>
          </CardHeader>
          <CardContent>
            <VisualRecommendations
              userProfile={userProfile}
              selectedCategory={selectedItemType}
              selectedColor={selectedItemColor}
              budget={selectedBudget}
              region={userProfile?.stylePreferences?.region || 'US'}
              onItemClick={(item: ShoppingItem) => {
                // Track item clicks for analytics
                console.log('Item clicked:', item);
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}