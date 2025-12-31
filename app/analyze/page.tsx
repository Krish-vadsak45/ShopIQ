"use client";

import { useState } from "react";
import ReviewForm from "../../components/ReviewForm";
import ProsCons from "../../components/ProsCons";
import FakeScoreBar from "../../components/FakeScoreBar";
import VerdictBox from "../../components/VerdictBox";
import AlternativeCard from "../../components/AlternativeCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AnalysisResult {
  pros: string[];
  cons: string[];
  fakeReviewProbability: number;
  verdict: string;
  alternative?: {
    productName: string;
    reason: string;
  };
}

export default function AnalyzePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Analyze Product Reviews
          </h1>
          <p className="text-gray-600">
            Paste reviews to detect fake content and get insights.
          </p>
        </div>

        {!result ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                Enter the product information and reviews below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewForm onAnalysis={setResult} />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
              variant="outline"
              onClick={() => setResult(null)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Analyze Another Product
            </Button>

            <div className="grid gap-6">
              <FakeScoreBar probability={result.fakeReviewProbability} />
              <VerdictBox verdict={result.verdict} />
              <ProsCons pros={result.pros} cons={result.cons} />
              {result.alternative && (
                <AlternativeCard alternative={result.alternative} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
