export interface GeminiResult {
  summary: string;
  pros: string[];
  cons: string[];
  fakeReviewProbability: number;
  verdict: string;
  bestAlternative: {
    name: string;
    reason: string;
    priceRange: string;
  };
  raw?: string; // raw AI text for debugging
}

export class GeminiError extends Error {
  public readonly safeMessage: string;
  constructor(message: string, safeMessage?: string) {
    super(message);
    this.name = "GeminiError";
    this.safeMessage = safeMessage || "AI analysis service error";
  }
}

function buildPrompt(
  productLink: string,
  productName: string,
  description: string
) {
  return `You are an expert product-review analyst. Based on the product context below and the provided description or pasted reviews, produce a STRICT JSON object as the ONLY output matching this exact schema:

{
  "summary": "(one short paragraph summarizing overall customer sentiment without inventing reviews)",
  "pros": ["string", "string"],
  "cons": ["string", "string"],
  "fakeReviewProbability": 0, // integer 0-100
  "verdict": "Buy|Consider|Avoid",
  "bestAlternative": { "name": "string", "reason": "string", "priceRange": "string" }
}

Context:
- Product Link: ${productLink}
- Product Name: ${productName}
- Description / Reviews: ${description}

Requirements:
- Do NOT invent or fabricate review text. If the provided text is insufficient, state conclusions conservatively in the summary.
- Aggregate sentiment and list the top 3–5 pros and 3–5 cons observed across the provided text and typical market patterns for similar products.
- Estimate fakeReviewProbability (0-100) using linguistic signals and review sampling; explain nothing — only return the number.
- Provide a single-word verdict: either "Buy", "Consider", or "Avoid".
- Suggest ONE better alternative within a similar price range with a one-sentence reason and a short priceRange string.

Only output the JSON object and nothing else. Ensure valid JSON (no comments, no markdown).`;
}

import fs from "fs";
import path from "path";

function ensureLogDir() {
  const dir = path.join(process.cwd(), "logs");
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    // ignore
  }
  return dir;
}

function logToFile(entry: any) {
  try {
    const dir = ensureLogDir();
    const file = path.join(dir, "gemini.log");
    const line = `[${new Date().toISOString()}] ${
      typeof entry === "string" ? entry : JSON.stringify(entry)
    }\n`;
    fs.appendFileSync(file, line);
  } catch (e) {
    console.error("Failed to write gemini log", e);
  }
}

export async function analyzeProduct(
  productLink: string,
  productName: string,
  description: string
): Promise<GeminiResult> {
  function getGeminiApiKey(): string {
    const key = process.env.GEMINI_API_KEY;
    if (!key || typeof key !== "string" || !key.trim()) {
      logToFile({ event: "missing_api_key" });
      throw new Error("GEMINI_API_KEY not configured in backend environment");
    }
    return key.trim();
  }

  const apiKey = getGeminiApiKey();
  // log masked apiKey info for debugging (do NOT log full key)
  try {
    const len = apiKey.length;
    const masked =
      apiKey.length > 8
        ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`
        : `***len:${len}`;
    logToFile({ event: "api_key_info", masked, length: len });
  } catch (e) {
    logToFile({ event: "api_key_info_error", error: String(e) });
  }

  const prompt = buildPrompt(productLink, productName, description);
  // Use stable v1beta Gemini endpoint (generateContent)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

  // Use the contents shape expected by the v1beta generateContent endpoint.
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

  try {
    // Log outgoing request prompt
    logToFile({
      event: "request",
      productLink,
      productName,
      prompt: prompt.slice(0, 2000),
    });

    // Use API key via query param (standard for generateContent); log the request url without exposing the key
    const requestUrl = url.replace(apiKey, "REDACTED");
    logToFile({ event: "request_url", url: requestUrl });

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const errText = await resp.text();
      logToFile({
        event: "http_error",
        status: resp.status,
        body: errText.slice(0, 2000),
      });
      throw new Error(`Gemini HTTP ${resp.status}: ${errText}`);
    }
    const data: any = await resp.json();
    // Log full response JSON for debugging
    logToFile({
      event: "response_json",
      data: JSON.stringify(data).slice(0, 20000),
    });

    // extract text output from possible response shapes
    let text: string | undefined;
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = data.candidates[0].content.parts[0].text;
    } else if (
      data?.candidates &&
      data.candidates[0] &&
      data.candidates[0].content
    ) {
      // Fallback for other shapes if any
      text =
        typeof data.candidates[0].content === "string"
          ? data.candidates[0].content
          : JSON.stringify(data.candidates[0].content);
    }

    if (!text && typeof data === "string") text = data as string;
    if (!text)
      throw new GeminiError(
        "No text returned from Gemini",
        "No text returned from AI service"
      );

    const cleaned = text.replace(/```json|```/g, "").trim();
    // Log raw response
    logToFile({ event: "response_raw", raw: text.slice(0, 20000) });

    let parsed: GeminiResult;
    try {
      parsed = JSON.parse(cleaned) as GeminiResult;
    } catch (parseErr) {
      logToFile({
        event: "json_parse_error",
        error: String(parseErr),
        raw: cleaned.slice(0, 2000),
      });
      throw new GeminiError(
        "Failed to parse Gemini JSON output",
        "AI produced invalid output"
      );
    }

    parsed.fakeReviewProbability = Number(parsed.fakeReviewProbability || 0);
    parsed.pros = parsed.pros || [];
    parsed.cons = parsed.cons || [];
    parsed.summary = parsed.summary || parsed.verdict || "";
    parsed.bestAlternative = parsed.bestAlternative || {
      name: "",
      reason: "",
      priceRange: "",
    };
    // attach raw AI output for debugging/visibility
    parsed.raw = text;
    // Log parsed JSON
    logToFile({ event: "response_parsed", parsed });
    return parsed;
  } catch (err) {
    // Log full details for diagnostics but expose only safe messages to callers.
    try {
      logToFile({ event: "error", error: String(err) });
    } catch (e) {
      console.error("Failed to write gemini error log", e);
    }
    console.error("Gemini call/parse failed", err);
    if (err instanceof GeminiError) throw err;
    throw new GeminiError(
      String(err || "Unknown error from Gemini"),
      "AI analysis failed"
    );
  }
}