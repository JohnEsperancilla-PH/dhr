'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AttendanceRecord {
  id: string
  schoolId: string
  name: string
  timestamp: string
  date: string
}

export default function AdminPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [eventName, setEventName] = useState('Attendance Tracker')
  const [editingEventName, setEditingEventName] = useState(false)
  const [newEventName, setNewEventName] = useState('')

  useEffect(() => {
    fetchRecords()
    fetchEventName()
  }, [])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/attendance')
      const data = await response.json()
      
      if (response.ok) {
        setRecords(data.records)
      } else {
        setError(data.error || 'Failed to fetch records')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchEventName = async () => {
    try {
      const response = await fetch('/api/event')
      if (response.ok) {
        const data = await response.json()
        setEventName(data.eventName)
      }
    } catch (error) {
      console.error('Error fetching event name:', error)
    }
  }

  const downloadCSV = async (filter: 'all' | 'today' = 'all') => {
    try {
      setDownloading(true)
      const response = await fetch(`/api/download?filter=${filter}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        
        // Generate filename with event name
        const sanitizedEventName = eventName.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-')
        a.download = filter === 'today' 
          ? `${sanitizedEventName}-attendance-${new Date().toISOString().split('T')[0]}.csv`
          : `${sanitizedEventName}-attendance-all.csv`
        
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        setError('Failed to download CSV')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const clearAllRecords = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear all attendance records? This action cannot be undone.'
    )
    
    if (!confirmed) return
    
    try {
      setClearing(true)
      setError('')
      
      const response = await fetch('/api/attendance', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setRecords([])
        // Show success message by clearing error and setting a temporary success state
        setError('')
        // Refresh the records to ensure UI is updated
        await fetchRecords()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to clear records')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setClearing(false)
    }
  }

  const updateEventName = async () => {
    if (!newEventName.trim()) {
      setError('Event name cannot be empty')
      return
    }

    try {
      const response = await fetch('/api/event', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventName: newEventName }),
      })

      if (response.ok) {
        setEventName(newEventName)
        setEditingEventName(false)
        setNewEventName('')
        setError('')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update event name')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const startEditingEventName = () => {
    setNewEventName(eventName)
    setEditingEventName(true)
    setError('')
  }

  const cancelEditingEventName = () => {
    setEditingEventName(false)
    setNewEventName('')
    setError('')
  }

  const todaysRecords = records.filter(record => 
    record.date === new Date().toLocaleDateString()
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              View and download attendance records
            </p>
          </div>

          {/* Event Name Section */}
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Event Settings
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name
                </label>
                {editingEventName ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newEventName}
                      onChange={(e) => setNewEventName(e.target.value)}
                      className="input-field flex-1 max-w-md"
                      placeholder="Enter event name"
                    />
                    <button
                      onClick={updateEventName}
                      className="btn-primary"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditingEventName}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-900">
                      {eventName}
                    </span>
                    <button
                      onClick={startEditingEventName}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {records.length}
              </div>
              <div className="text-gray-600">Total Records</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {todaysRecords.length}
              </div>
              <div className="text-gray-600">Today's Attendance</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {new Set(records.map(r => r.schoolId)).size}
              </div>
              <div className="text-gray-600">Unique Students</div>
            </div>
          </div>

          {/* Download Section */}
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Download Records
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => downloadCSV('all')}
                disabled={downloading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? 'Downloading...' : 'Download All Records'}
              </button>
              <button
                onClick={() => downloadCSV('today')}
                disabled={downloading}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? 'Downloading...' : "Download Today's Records"}
              </button>
            </div>
          </div>

          {/* Clear Records Section */}
          <div className="card mb-8 border-red-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Clear All Records
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 className="font-medium text-red-900">Warning</h3>
                  <p className="text-sm text-red-700 mt-1">
                    This action will permanently delete all attendance records. This cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={clearAllRecords}
              disabled={clearing}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {clearing ? 'Clearing...' : 'Clear All Records'}
            </button>
          </div>

          {/* Recent Records */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Records
              </h2>
              <button
                onClick={fetchRecords}
                disabled={loading}
                className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading records...</p>
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600">No attendance records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">School ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {records.slice(0, 50).map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{record.schoolId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{record.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {records.length > 50 && (
                  <div className="mt-4 text-center text-gray-600">
                    Showing first 50 records. Download CSV for complete data.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 