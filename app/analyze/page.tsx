"use client";

import ReviewForm from "../../components/ReviewForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function AnalyzePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Analyze Product Reviews
          </h1>
          <p className="text-gray-600">Paste reviews to detect fake content and get insights.</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Enter the product information and reviews below.</CardDescription>
          </CardHeader>
          <CardContent>
            <ReviewForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
