import { getPrompt } from './prompt'
import { GeminiError } from './gemini'

export interface AnalysisResult {
  pros: string[]
  cons: string[]
  fakeReviewProbability: number
  verdict: string
  alternative?: {
    productName: string
    reason: string
  }
}

async function callGemini(prompt: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0,
      maxOutputTokens: 800,
    },
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Gemini HTTP ${resp.status}: ${errText}`);
  }

  const data: any = await resp.json();
  let text: string | undefined;
  if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    text = data.candidates[0].content.parts[0].text;
  }

  if (!text) {
    throw new GeminiError("No text returned from Gemini", "No text returned from AI service");
  }

  const cleaned = text.replace(/```json|```/g, "").trim();
  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseErr) {
    throw new GeminiError("Failed to parse Gemini JSON output", "AI produced invalid output");
  }

  return parsed;
}

export async function analyzeReviews(productName: string, price: number, reviews: string): Promise<AnalysisResult> {
  const prompt = getPrompt(productName, price, reviews);
  const result = await callGemini(prompt);

  return {
    pros: result.pros || [],
    cons: result.cons || [],
    fakeReviewProbability: Number(result.fakeReviewProbability || 0),
    verdict: result.verdict || '',
    alternative: result.alternative ? {
      productName: result.alternative.productName,
      reason: result.alternative.reason
    } : undefined
  };
}