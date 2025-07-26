"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
  const handleCheckout = async (priceId: string) => {
    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Pricing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Basic</CardTitle>
            <CardDescription>Perfect for individuals</CardDescription>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold mb-4">$9/month</h2>
            <ul className="list-disc list-inside">
              <li>Feature A</li>
              <li>Feature B</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handleCheckout('price_123')}>Get Started</Button>
          </CardFooter>
        </Card>

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>For growing businesses</CardDescription>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold mb-4">$29/month</h2>
            <ul className="list-disc list-inside">
              <li>All Basic features</li>
              <li>Feature C</li>
              <li>Feature D</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handleCheckout('price_456')}>Get Started</Button>
          </CardFooter>
        </Card>

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>Custom solutions for large teams</CardDescription>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <ul className="list-disc list-inside">
              <li>All Pro features</li>
              <li>Custom integrations</li>
              <li>Dedicated support</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Contact Sales</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}