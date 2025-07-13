import { NextRequest, NextResponse } from 'next/server'
import { getAttendanceRecords, recordsToCSV, getTodaysAttendance, getEventName } from '@/lib/attendance'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    
    let records
    let filename
    
    // Get event name for filename
    const eventName = await getEventName()
    const sanitizedEventName = eventName.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-')
    
    if (filter === 'today') {
      records = await getTodaysAttendance()
      const today = new Date().toISOString().split('T')[0]
      filename = `${sanitizedEventName}-attendance-${today}.csv`
    } else {
      records = await getAttendanceRecords()
      filename = `${sanitizedEventName}-attendance-all.csv`
    }
    
    const csvContent = recordsToCSV(records)
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Error generating CSV:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSV' },
      { status: 500 }
    )
  }
} 