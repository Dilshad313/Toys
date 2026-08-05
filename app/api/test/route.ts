import { NextResponse } from 'next/server'

// ✅ Make sure this is properly exported
export async function GET() {
  console.log('✅ Test API called!')
  return NextResponse.json({ 
    success: true, 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  })
}