import { promises as fs } from 'fs'
import { join } from 'path'

export interface AttendanceRecord {
  id: string
  schoolId: string
  name: string
  timestamp: string
  date: string
}

export interface AttendanceData {
  eventName: string
  records: AttendanceRecord[]
}

const DATA_FILE = join(process.cwd(), 'data', 'attendance.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(join(process.cwd(), 'data'), { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
}

// Read attendance data from file
async function getAttendanceData(): Promise<AttendanceData> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(data)
    
    // Handle legacy format (array of records)
    if (Array.isArray(parsed)) {
      return {
        eventName: 'Attendance Tracker',
        records: parsed
      }
    }
    
    // Handle new format (object with eventName and records)
    return {
      eventName: parsed.eventName || 'Attendance Tracker',
      records: parsed.records || []
    }
  } catch (error) {
    // File doesn't exist yet or is empty, return default
    return {
      eventName: 'Attendance Tracker',
      records: []
    }
  }
}

// Read attendance records from file
export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
  const data = await getAttendanceData()
  return data.records
}

// Add a new attendance record
export async function addAttendanceRecord(schoolId: string, name: string): Promise<AttendanceRecord> {
  const data = await getAttendanceData()
  
  const now = new Date()
  const record: AttendanceRecord = {
    id: `${schoolId}-${now.getTime()}`,
    schoolId: schoolId.trim(),
    name: name.trim(),
    timestamp: now.toISOString(),
    date: now.toLocaleDateString()
  }
  
  data.records.push(record)
  
  await ensureDataDir()
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
  
  return record
}

// Convert records to CSV format
export function recordsToCSV(records: AttendanceRecord[]): string {
  const headers = ['School ID', 'Name', 'Date', 'Time']
  const rows = records.map(record => [
    record.schoolId,
    record.name,
    record.date,
    new Date(record.timestamp).toLocaleTimeString()
  ])
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
  
  return csvContent
}

// Get today's attendance records
export async function getTodaysAttendance(): Promise<AttendanceRecord[]> {
  const records = await getAttendanceRecords()
  const today = new Date().toLocaleDateString()
  
  return records.filter(record => record.date === today)
}

// Clear all attendance records
export async function clearAllAttendanceRecords(): Promise<void> {
  const data = await getAttendanceData()
  data.records = []
  
  await ensureDataDir()
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

// Get event name
export async function getEventName(): Promise<string> {
  const data = await getAttendanceData()
  return data.eventName
}

// Set event name
export async function setEventName(eventName: string): Promise<void> {
  const data = await getAttendanceData()
  data.eventName = eventName.trim()
  
  await ensureDataDir()
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
} 