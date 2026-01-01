import { NextRequest, NextResponse } from 'next/server'
import { analyzeReviews } from '../../../lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productName, price, reviews } = body

    // Validate input
    if (!productName || typeof productName !== 'string' || !productName.trim()) {
      return NextResponse.json({ success: false, error: 'Invalid product name' }, { status: 400 })
    }
    if (!price || typeof price !== 'number' || price <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid price' }, { status: 400 })
    }
    if (!reviews || typeof reviews !== 'string' || !reviews.trim()) {
      return NextResponse.json({ success: false, error: 'Invalid reviews' }, { status: 400 })
    }

    // Call AI analysis
    const result = await analyzeReviews(productName, price, reviews)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}