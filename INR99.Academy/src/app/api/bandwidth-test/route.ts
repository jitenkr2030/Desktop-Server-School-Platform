import { NextResponse } from 'next/server'

export async function GET() {
  // Simple endpoint for bandwidth testing
  // Returns a small response to measure latency
  return NextResponse.json({
    success: true,
    timestamp: Date.now(),
    message: 'Bandwidth test'
  })
}

export async function HEAD() {
  // HEAD request for even lighter bandwidth testing
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}