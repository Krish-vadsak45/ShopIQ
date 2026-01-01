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

// Placeholder AI function - returns mock data for demo
export async function analyzeReviews(productName: string, price: number, reviews: string): Promise<AnalysisResult> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const reviewCount = reviews.split('\n').filter(Boolean).length || 1
  const hasPositive = reviews.toLowerCase().includes('good') || reviews.toLowerCase().includes('great')
  const hasNegative = reviews.toLowerCase().includes('bad') || reviews.toLowerCase().includes('poor')

  let fakeProb = 30
  if (reviewCount < 3) fakeProb = 60
  if (hasPositive && !hasNegative) fakeProb = 20

  return {
    pros: hasPositive ? ['High quality materials', 'Excellent performance', 'Great value for money'] : ['Decent build quality'],
    cons: hasNegative ? ['Some users report issues', 'Could be improved'] : ['Minor design flaws'],
    fakeReviewProbability: fakeProb,
    verdict: fakeProb < 40 ? 'Recommended for purchase based on genuine reviews.' : 'Exercise caution; high chance of fake reviews.',
    alternative: price > 100 ? {
      productName: 'Budget Alternative Model',
      reason: 'Similar features at lower price with better reviews'
    } : undefined
  }
}
