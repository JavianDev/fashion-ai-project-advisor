"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-green-500 to-green-700 text-white flex items-center justify-center">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-4">
            Your Personal AI Fashion Advisor
          </h1>
          <p className="max-w-[700px] mx-auto text-lg md:text-xl mb-8">
            Unlock your style potential with AI-powered recommendations tailored to your unique body, skin tone, and preferences.
          </p>
          <div className="space-x-4">
            <Link href="/sign-up">
              <Button className="bg-white text-green-700 hover:bg-gray-100 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Get Started Free
              </Button>
            </Link>
            <Link href="/project-advisor">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-700 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">How UtardiAdvisor Transforms Your Style</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Leveraging cutting-edge AI to provide personalized fashion insights.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col items-center p-6 text-center">
              <CheckCircleIcon className="w-12 h-12 text-green-500 mb-4" />
              <CardTitle className="mb-2">Personalized Recommendations</CardTitle>
              <CardDescription>Get clothing suggestions tailored to your unique body shape, skin tone, and preferences.</CardDescription>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center">
              <CheckCircleIcon className="w-12 h-12 text-green-500 mb-4" />
              <CardTitle className="mb-2">Virtual Try-On (Experimental)</CardTitle>
              <CardDescription>See how clothes might look on you using your webcam or uploaded images.</CardDescription>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center">
              <CheckCircleIcon className="w-12 h-12 text-green-500 mb-4" />
              <CardTitle className="mb-2">Outfit Builder</CardTitle>
              <CardDescription>Mix and match items to create perfect outfits and discover new combinations.</CardDescription>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center">
              <CheckCircleIcon className="w-12 h-12 text-green-500 mb-4" />
              <CardTitle className="mb-2">Occasion-Based Styling</CardTitle>
              <CardDescription>Receive advice on what to wear for any event, from casual outings to formal galas.</CardDescription>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center">
              <CheckCircleIcon className="w-12 h-12 text-green-500 mb-4" />
              <CardTitle className="mb-2">Integrated AI</CardTitle>
              <CardDescription>Our RAG model combines vast fashion knowledge with your profile for smart suggestions.</CardDescription>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center">
              <CheckCircleIcon className="w-12 h-12 text-green-500 mb-4" />
              <CardTitle className="mb-2">Secure & Private</CardTitle>
              <CardDescription>Your data is handled with care. Image processing is client-side for privacy.</CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Call to Action */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-800 text-white flex items-center justify-center">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
            Ready to Elevate Your Style?
          </h2>
          <p className="max-w-[700px] mx-auto text-lg md:text-xl mb-8">
            Choose a plan that fits your needs and start your personalized fashion journey today.
          </p>
          <Link href="/pricing">
            <Button className="bg-white text-green-800 hover:bg-gray-100 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
              View Pricing Plans
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
