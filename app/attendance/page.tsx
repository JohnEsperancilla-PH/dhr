'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AttendancePage() {
  const [schoolId, setSchoolId] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [eventName, setEventName] = useState('Attendance Tracker')

  useEffect(() => {
    fetchEventName()
  }, [])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')
    setMessageType('')

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schoolId, name }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Attendance recorded successfully!')
        setMessageType('success')
        setSchoolId('')
        setName('')
      } else {
        setMessage(data.error || 'Failed to record attendance')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
      setMessageType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Back to Home Link - Fixed at top */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium inline-block">
          ← Back to Home
        </Link>
      </div>
      
      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {eventName}
            </h1>
            <p className="text-gray-600">
              Please enter your school ID and name to record your attendance
            </p>
          </div>

          {/* Current Time Display */}
          <div className="text-center mb-8">
            <div className="bg-blue-100 rounded-xl p-6 max-w-md mx-auto">
              <div className="text-3xl font-bold text-blue-900 mb-2">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-lg text-blue-700">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-2">
                  School ID
                </label>
                <input
                  type="text"
                  id="schoolId"
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="input-field"
                  placeholder="Enter your school ID"
                  required
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${
                  messageType === 'success' 
                    ? 'bg-green-100 border border-green-400 text-green-700' 
                    : 'bg-red-100 border border-red-400 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Recording...' : 'Record Attendance'}
                </button>
              </div>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-medium text-blue-900">Important Note</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Make sure to enter your correct school ID and full name. This information will be used for attendance tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 