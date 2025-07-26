"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VisualRecommendations from '@/components/project-advisor/VisualRecommendations';

export default function ProjectAdvisorPage() {
  const router = useRouter();
  const [skinTone, setSkinTone] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [bust, setBust] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [clothingColor, setClothingColor] = useState('');
  const [clothingType, setClothingType] = useState('');
  const [occasion, setOccasion] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [showVisualRecommendations, setShowVisualRecommendations] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/rag/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_profile: {
          skin_tone: skinTone,
          body_type: bodyType,
          bust: bust,
          waist: waist,
          hip: hip,
        },
        clothing_item: {
          color: clothingColor,
          type: clothingType,
        },
        occasion: occasion,
      }),
    });

    const data = await response.json();
    setRecommendation(data.recommendation);
    setShowVisualRecommendations(true);
  };

  // Load user profile on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI-Powered Fashion Advisor
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Your Personal Style Assistant
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
          Get personalized fashion recommendations based on your unique style, body type, and preferences.
          Our AI analyzes your profile to suggest the perfect outfits for any occasion.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Personalized Recommendations
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Body Type Analysis
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Occasion-Based Styling
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Shopping Integration
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 dark:border-slate-700"
              onClick={() => router.push('/project-advisor/virtual-try-on')}>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <CardTitle className="text-slate-900 dark:text-slate-100">Virtual Try-On</CardTitle>
            <CardDescription>AI-powered body analysis and real-time style recommendations</CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 dark:border-slate-700"
              onClick={() => router.push('/project-advisor/outfit-builder')}>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <CardTitle className="text-slate-900 dark:text-slate-100">Outfit Builder</CardTitle>
            <CardDescription>Mix and match clothes to create the perfect outfit combinations</CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 dark:border-slate-700"
              onClick={() => router.push('/project-advisor/profile')}>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <CardTitle className="text-slate-900 dark:text-slate-100">My Profile</CardTitle>
            <CardDescription>Manage your measurements, preferences, and style profile</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main Recommendation Form */}
      <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">Get Instant Style Recommendations</CardTitle>
          <CardDescription>Fill in your details below to receive personalized fashion advice</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="skinTone" className="text-slate-700 dark:text-slate-300 font-medium">Skin Tone</Label>
                <Select onValueChange={setSkinTone}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your skin tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="cool">Cool</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="tan">Tan</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyType" className="text-slate-700 dark:text-slate-300 font-medium">Body Type</Label>
                <Select onValueChange={setBodyType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your body type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="athletic">Athletic</SelectItem>
                    <SelectItem value="pear">Pear</SelectItem>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="hourglass">Hourglass</SelectItem>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                    <SelectItem value="inverted triangle">Inverted Triangle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bust" className="text-slate-700 dark:text-slate-300 font-medium">Bust (cm)</Label>
                <Input
                  id="bust"
                  type="number"
                  value={bust}
                  onChange={(e) => setBust(e.target.value)}
                  placeholder="e.g., 90"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waist" className="text-slate-700 dark:text-slate-300 font-medium">Waist (cm)</Label>
                <Input
                  id="waist"
                  type="number"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  placeholder="e.g., 70"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hip" className="text-slate-700 dark:text-slate-300 font-medium">Hip (cm)</Label>
                <Input
                  id="hip"
                  type="number"
                  value={hip}
                  onChange={(e) => setHip(e.target.value)}
                  placeholder="e.g., 95"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clothingColor" className="text-slate-700 dark:text-slate-300 font-medium">Clothing Item Color</Label>
                <Input
                  id="clothingColor"
                  type="text"
                  value={clothingColor}
                  onChange={(e) => setClothingColor(e.target.value)}
                  placeholder="e.g., red, blue, black"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clothingType" className="text-slate-700 dark:text-slate-300 font-medium">Clothing Item Type</Label>
                <Select onValueChange={setClothingType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select clothing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="dress">Dress</SelectItem>
                    <SelectItem value="jacket">Jacket</SelectItem>
                    <SelectItem value="shoes">Shoes</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occasion" className="text-slate-700 dark:text-slate-300 font-medium">Occasion</Label>
                <Select onValueChange={setOccasion}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="smart casual">Smart Casual</SelectItem>
                    <SelectItem value="business professional">Business Professional</SelectItem>
                    <SelectItem value="cocktail">Cocktail/Semi-Formal</SelectItem>
                    <SelectItem value="formal">Formal/Black Tie</SelectItem>
                    <SelectItem value="sporty">Sporty/Active</SelectItem>
                    <SelectItem value="date night">Date Night</SelectItem>
                    <SelectItem value="vacation">Vacation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                size="lg"
                className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Get AI Recommendation
              </Button>
            </div>
      </form>

          </form>
        </CardContent>
      </Card>

      {/* Recommendation Results */}
      {recommendation && (
        <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">Your Style Recommendation</CardTitle>
            <CardDescription>Personalized fashion advice based on your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{recommendation}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/project-advisor/outfit-builder')}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Build Complete Outfit
                </Button>

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
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visual Shopping Recommendations */}
      {showVisualRecommendations && (
        <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">Shop Your Style</CardTitle>
            <CardDescription>Discover clothing items that match your recommendations with exclusive deals</CardDescription>
          </CardHeader>
          <CardContent>
            <VisualRecommendations
              userProfile={userProfile}
              selectedCategory={clothingType}
              selectedColor={clothingColor}
              budget={userProfile?.stylePreferences?.budget}
              region={userProfile?.stylePreferences?.region || 'US'}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}