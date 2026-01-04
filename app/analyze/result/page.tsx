"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FakeScoreBar from "@/components/FakeScoreBar";
import VerdictBox from "@/components/VerdictBox";
import ProsCons from "@/components/ProsCons";
import AlternativeCard from "@/components/AlternativeCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ResultPage() {
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("analysisResult");
      if (!raw) {
        setResult(null);
        return;
      }
      const parsed = JSON.parse(raw);
      setResult(parsed);
    } catch (e) {
      setResult(null);
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">No analysis found</h2>
          <p className="text-gray-600 mb-6">Please run an analysis first.</p>
          <Button onClick={() => router.push('/analyze')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Analyze
          </Button>
        </div>
      </div>
    );
  }

  const {
    summary,
    pros = [],
    cons = [],
    fakeReviewProbability = 0,
    verdict = '',
    bestAlternative = { name: '', reason: '', priceRange: '' },
    raw,
  } = result;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push('/analyze')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Analyze Another Product
          </Button>
          {raw && (
            <details className="text-sm">
              <summary className="cursor-pointer text-muted-foreground">Show raw AI output</summary>
              <pre className="mt-2 bg-gray-900 text-white p-3 rounded text-xs overflow-auto">{raw}</pre>
            </details>
          )}
        </div>

        <div className="grid gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Summary</h1>
            <p className="text-gray-800">{summary || verdict}</p>
          </div>

          <FakeScoreBar probability={Number(fakeReviewProbability)} />
          <VerdictBox verdict={verdict} />
          <ProsCons pros={pros} cons={cons} />

          {bestAlternative && bestAlternative.name && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Best Alternative</h2>
              <AlternativeCard alternative={{ productName: bestAlternative.name, reason: bestAlternative.reason }} />
              {bestAlternative.priceRange && (
                <p className="mt-2 text-sm text-muted-foreground">Price range: {bestAlternative.priceRange}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
