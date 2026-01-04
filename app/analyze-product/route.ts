import { NextRequest, NextResponse } from "next/server";
import { analyzeProduct, GeminiError } from "../../lib/gemini";

function looksLikeProductPage(urlStr: string) {
  try {
    const u = new URL(urlStr);
    const path = u.pathname.toLowerCase();
    if (path.length > 1) return true;
    if (
      path.includes("/dp/") ||
      path.includes("/product") ||
      path.includes("/p/")
    )
      return true;
    if (u.searchParams.has("id")) return true;
    return false;
  } catch (err) {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productLink, productName, description } = await request.json();

    if (
      !productLink ||
      typeof productLink !== "string" ||
      !productLink.trim()
    ) {
      return NextResponse.json(
        { success: false, error: "Product link is required" },
        { status: 400 }
      );
    }
    if (!/^https?:\/\//i.test(productLink)) {
      return NextResponse.json({
        error: "Invalid product link. Please provide a product page URL.",
      }, { status: 400 });
    }
    if (!looksLikeProductPage(productLink)) {
      return NextResponse.json({
        error: "Invalid product link. Please provide a product page URL.",
      }, { status: 400 });
    }

    if (
      !productName ||
      typeof productName !== "string" ||
      !productName.trim()
    ) {
      return NextResponse.json({
        success: false,
        error: "Product name is required"
      }, { status: 400 });
    }

    const desc = typeof description === "string" ? description : "";
    if (!desc.trim()) {
      return NextResponse.json({
        success: false,
        error: "Product description or reviews are required",
      }, { status: 400 });
    }

    const aiResult = await analyzeProduct(productLink, productName, desc);
    return NextResponse.json(aiResult);
  } catch (err) {
    console.error("Analyze product error:", err);
    // If it's a config issue about the API key, return a clear message
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("GEMINI_API_KEY")) {
      return NextResponse.json({
        success: false,
        error:
          "Server misconfiguration: GEMINI_API_KEY is not configured",
      }, { status: 500 });
    }
    // If it's an error from the Gemini integration, return a safe message and 502
    if (err instanceof GeminiError) {
      return NextResponse.json({ success: false, error: err.safeMessage }, { status: 502 });
    }
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}
