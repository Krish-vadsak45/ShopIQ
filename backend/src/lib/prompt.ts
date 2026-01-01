// AI prompt template for review analysis
export function getPrompt(productName: string, price: number, reviews: string): string {
  return `
You are an expert at analyzing e-commerce product reviews to detect fake reviews and extract genuine insights.

Product: ${productName}
Price: $${price}

Reviews to analyze:
${reviews}

Task:
1. Extract 3-5 genuine pros from authentic reviews
2. Extract 3-5 genuine cons from authentic reviews
3. Analyze for fake review patterns (repetitive language, overly positive, suspicious timing, etc.)
4. Calculate fake review probability as a percentage (0-100)
5. Provide a clear buying verdict based on genuine reviews
6. If appropriate, suggest a better alternative product with reason

Important:
- Focus on genuine, detailed reviews
- Ignore obviously fake or promotional content
- Be balanced and honest
- Return ONLY valid JSON with no additional text

Output format:
{
  "pros": ["genuine pro 1", "genuine pro 2", "genuine pro 3"],
  "cons": ["genuine con 1", "genuine con 2"],
  "fakeReviewProbability": 45,
  "verdict": "Clear verdict statement based on analysis",
  "alternative": {
    "productName": "Alternative Product Name",
    "reason": "Why this is a better choice"
  }
}

If no alternative is needed, omit the "alternative" field entirely.
`
}
