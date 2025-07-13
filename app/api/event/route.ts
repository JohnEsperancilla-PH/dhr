import { NextRequest, NextResponse } from 'next/server'
import { getEventName, setEventName } from '@/lib/attendance'

export async function GET() {
  try {
    const eventName = await getEventName()
    return NextResponse.json({ eventName })
  } catch (error) {
    console.error('Error getting event name:', error)
    return NextResponse.json(
      { error: 'Failed to get event name' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { eventName } = await request.json()
    
    // Validate input
    if (!eventName || typeof eventName !== 'string') {
      return NextResponse.json(
        { error: 'Event name is required' },
        { status: 400 }
      )
    }
    
    if (eventName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Event name cannot be empty' },
        { status: 400 }
      )
    }
    
    // Set the event name
    await setEventName(eventName)
    
    return NextResponse.json({ 
      success: true, 
      eventName: eventName.trim(),
      message: 'Event name updated successfully' 
    })
  } catch (error) {
    console.error('Error setting event name:', error)
    return NextResponse.json(
      { error: 'Failed to update event name' },
      { status: 500 }
    )
  }
} 