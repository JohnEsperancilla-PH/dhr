import { NextRequest, NextResponse } from 'next/server'
import { addAttendanceRecord, getAttendanceRecords, clearAllAttendanceRecords } from '@/lib/attendance'

export async function POST(request: NextRequest) {
  try {
    const { schoolId, name } = await request.json()
    
    // Validate input
    if (!schoolId || !name) {
      return NextResponse.json(
        { error: 'School ID and name are required' },
        { status: 400 }
      )
    }
    
    if (schoolId.trim().length === 0 || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'School ID and name cannot be empty' },
        { status: 400 }
      )
    }
    
    // Add the attendance record
    const record = await addAttendanceRecord(schoolId, name)
    
    return NextResponse.json({ 
      success: true, 
      record,
      message: 'Attendance recorded successfully' 
    })
  } catch (error) {
    console.error('Error adding attendance record:', error)
    return NextResponse.json(
      { error: 'Failed to record attendance' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const records = await getAttendanceRecords()
    return NextResponse.json({ records })
  } catch (error) {
    console.error('Error getting attendance records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    await clearAllAttendanceRecords()
    return NextResponse.json({ 
      success: true, 
      message: 'All attendance records cleared successfully' 
    })
  } catch (error) {
    console.error('Error clearing attendance records:', error)
    return NextResponse.json(
      { error: 'Failed to clear attendance records' },
      { status: 500 }
    )
  }
} 