"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';

interface UserProfile {
  personalInfo: {
    name: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
  };
  bodyMeasurements: {
    bust: string;
    waist: string;
    hip: string;
    inseam: string;
    shoulderWidth: string;
  };
  stylePreferences: {
    skinTone: string;
    bodyType: string;
    preferredColors: string[];
    stylePersonality: string;
    budget: string;
    region: string;
  };
  measurements: {
    shirtSize: string;
    pantSize: string;
    shoeSize: string;
    dressSize: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    personalInfo: {
      name: '',
      age: '',
      gender: '',
      height: '',
      weight: ''
    },
    bodyMeasurements: {
      bust: '',
      waist: '',
      hip: '',
      inseam: '',
      shoulderWidth: ''
    },
    stylePreferences: {
      skinTone: '',
      bodyType: '',
      preferredColors: [],
      stylePersonality: '',
      budget: '',
      region: ''
    },
    measurements: {
      shirtSize: '',
      pantSize: '',
      shoeSize: '',
      dressSize: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load profile from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setSaveStatus('saving');

    try {
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('userProfile', JSON.stringify(profile));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateBodyMeasurements = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      bodyMeasurements: {
        ...prev.bodyMeasurements,
        [field]: value
      }
    }));
  };

  const updateStylePreferences = (field: string, value: string | string[]) => {
    setProfile(prev => ({
      ...prev,
      stylePreferences: {
        ...prev.stylePreferences,
        [field]: value
      }
    }));
  };

  const updateMeasurements = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [field]: value
      }
    }));
  };

  const addPreferredColor = (color: string) => {
    if (color && !profile.stylePreferences.preferredColors.includes(color)) {
      updateStylePreferences('preferredColors', [...profile.stylePreferences.preferredColors, color]);
    }
  };

  const removePreferredColor = (color: string) => {
    updateStylePreferences('preferredColors', profile.stylePreferences.preferredColors.filter(c => c !== color));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Personal Style Profile
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          My Fashion Profile
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
          Create and manage your personal style profile to get more accurate fashion recommendations.
          The more details you provide, the better our AI can understand your preferences.
        </p>
      </div>

      {/* Profile Form */}
      <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">Profile Information</CardTitle>
          <CardDescription>Complete your profile to get personalized fashion recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="measurements">Measurements</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="sizes">Sizes</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.personalInfo.name}
                    onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-slate-700 dark:text-slate-300 font-medium">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.personalInfo.age}
                    onChange={(e) => updatePersonalInfo('age', e.target.value)}
                    placeholder="Enter your age"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-slate-700 dark:text-slate-300 font-medium">Gender</Label>
                  <Select onValueChange={(value) => updatePersonalInfo('gender', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height" className="text-slate-700 dark:text-slate-300 font-medium">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.personalInfo.height}
                    onChange={(e) => updatePersonalInfo('height', e.target.value)}
                    placeholder="e.g., 170"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300 font-medium">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profile.personalInfo.weight}
                    onChange={(e) => updatePersonalInfo('weight', e.target.value)}
                    placeholder="e.g., 65"
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Body Measurements Tab */}
            <TabsContent value="measurements" className="space-y-6 mt-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Body Measurements</h3>
                <p className="text-slate-600 dark:text-slate-400">Accurate measurements help us recommend the perfect fit</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bust" className="text-slate-700 dark:text-slate-300 font-medium">Bust/Chest (cm)</Label>
                  <Input
                    id="bust"
                    type="number"
                    value={profile.bodyMeasurements.bust}
                    onChange={(e) => updateBodyMeasurements('bust', e.target.value)}
                    placeholder="e.g., 90"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waist" className="text-slate-700 dark:text-slate-300 font-medium">Waist (cm)</Label>
                  <Input
                    id="waist"
                    type="number"
                    value={profile.bodyMeasurements.waist}
                    onChange={(e) => updateBodyMeasurements('waist', e.target.value)}
                    placeholder="e.g., 70"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hip" className="text-slate-700 dark:text-slate-300 font-medium">Hip (cm)</Label>
                  <Input
                    id="hip"
                    type="number"
                    value={profile.bodyMeasurements.hip}
                    onChange={(e) => updateBodyMeasurements('hip', e.target.value)}
                    placeholder="e.g., 95"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inseam" className="text-slate-700 dark:text-slate-300 font-medium">Inseam (cm)</Label>
                  <Input
                    id="inseam"
                    type="number"
                    value={profile.bodyMeasurements.inseam}
                    onChange={(e) => updateBodyMeasurements('inseam', e.target.value)}
                    placeholder="e.g., 75"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shoulderWidth" className="text-slate-700 dark:text-slate-300 font-medium">Shoulder Width (cm)</Label>
                  <Input
                    id="shoulderWidth"
                    type="number"
                    value={profile.bodyMeasurements.shoulderWidth}
                    onChange={(e) => updateBodyMeasurements('shoulderWidth', e.target.value)}
                    placeholder="e.g., 40"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Measurement Tips</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      For best results, measure yourself wearing fitted clothing or undergarments.
                      Consider using our Virtual Try-On feature for AI-assisted measurements.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Style Preferences Tab */}
            <TabsContent value="style" className="space-y-6 mt-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Style Preferences</h3>
                <p className="text-slate-600 dark:text-slate-400">Tell us about your style personality and preferences</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="skinTone" className="text-slate-700 dark:text-slate-300 font-medium">Skin Tone</Label>
                  <Select onValueChange={(value) => updateStylePreferences('skinTone', value)}>
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
                  <Select onValueChange={(value) => updateStylePreferences('bodyType', value)}>
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

                <div className="space-y-2">
                  <Label htmlFor="stylePersonality" className="text-slate-700 dark:text-slate-300 font-medium">Style Personality</Label>
                  <Select onValueChange={(value) => updateStylePreferences('stylePersonality', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic & Timeless</SelectItem>
                      <SelectItem value="trendy">Trendy & Fashion-Forward</SelectItem>
                      <SelectItem value="bohemian">Bohemian & Free-Spirited</SelectItem>
                      <SelectItem value="minimalist">Minimalist & Clean</SelectItem>
                      <SelectItem value="edgy">Edgy & Bold</SelectItem>
                      <SelectItem value="romantic">Romantic & Feminine</SelectItem>
                      <SelectItem value="casual">Casual & Comfortable</SelectItem>
                      <SelectItem value="professional">Professional & Polished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-slate-700 dark:text-slate-300 font-medium">Budget Range</Label>
                  <Select onValueChange={(value) => updateStylePreferences('budget', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget-Friendly ($0-50)</SelectItem>
                      <SelectItem value="moderate">Moderate ($50-150)</SelectItem>
                      <SelectItem value="mid-range">Mid-Range ($150-300)</SelectItem>
                      <SelectItem value="premium">Premium ($300-500)</SelectItem>
                      <SelectItem value="luxury">Luxury ($500+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region" className="text-slate-700 dark:text-slate-300 font-medium">Region</Label>
                  <Select onValueChange={(value) => updateStylePreferences('region', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="eu">Europe</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Sizes Tab */}
            <TabsContent value="sizes" className="space-y-6 mt-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Clothing Sizes</h3>
                <p className="text-slate-600 dark:text-slate-400">Your typical sizes for different clothing categories</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shirtSize" className="text-slate-700 dark:text-slate-300 font-medium">Shirt/Top Size</Label>
                  <Select onValueChange={(value) => updateMeasurements('shirtSize', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select shirt size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xs">XS</SelectItem>
                      <SelectItem value="s">S</SelectItem>
                      <SelectItem value="m">M</SelectItem>
                      <SelectItem value="l">L</SelectItem>
                      <SelectItem value="xl">XL</SelectItem>
                      <SelectItem value="xxl">XXL</SelectItem>
                      <SelectItem value="xxxl">XXXL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pantSize" className="text-slate-700 dark:text-slate-300 font-medium">Pant Size</Label>
                  <Input
                    id="pantSize"
                    value={profile.measurements.pantSize}
                    onChange={(e) => updateMeasurements('pantSize', e.target.value)}
                    placeholder="e.g., 32, 28W/30L"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dressSize" className="text-slate-700 dark:text-slate-300 font-medium">Dress Size</Label>
                  <Select onValueChange={(value) => updateMeasurements('dressSize', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select dress size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xs">XS</SelectItem>
                      <SelectItem value="s">S</SelectItem>
                      <SelectItem value="m">M</SelectItem>
                      <SelectItem value="l">L</SelectItem>
                      <SelectItem value="xl">XL</SelectItem>
                      <SelectItem value="xxl">XXL</SelectItem>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="14">14</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                      <SelectItem value="18">18</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shoeSize" className="text-slate-700 dark:text-slate-300 font-medium">Shoe Size</Label>
                  <Input
                    id="shoeSize"
                    value={profile.measurements.shoeSize}
                    onChange={(e) => updateMeasurements('shoeSize', e.target.value)}
                    placeholder="e.g., 8, 8.5, 42"
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-center pt-8 border-t border-slate-200 dark:border-slate-700">
            <Button
              onClick={handleSaveProfile}
              disabled={isLoading}
              size="lg"
              className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white mr-2"></div>
                  Saving Profile...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Profile
                </>
              )}
            </Button>
          </div>

          {/* Save Status */}
          {saveStatus !== 'idle' && (
            <div className="flex justify-center mt-4">
              {saveStatus === 'saved' && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Profile saved successfully!
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Error saving profile. Please try again.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 dark:border-slate-700"
              onClick={() => router.push('/project-advisor/virtual-try-on')}>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <CardTitle className="text-slate-900 dark:text-slate-100">Use Virtual Try-On</CardTitle>
            <CardDescription>Get AI-powered measurements and recommendations</CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 dark:border-slate-700"
              onClick={() => router.push('/project-advisor')}>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <CardTitle className="text-slate-900 dark:text-slate-100">Get Recommendations</CardTitle>
            <CardDescription>Use your profile to get personalized fashion advice</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}