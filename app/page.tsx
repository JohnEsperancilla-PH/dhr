'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [eventName, setEventName] = useState('Attendance Tracker')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEventName()
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {loading ? 'Loading...' : eventName}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple and efficient attendance tracking system for educational institutions
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Student Check-in
              </h2>
              <p className="text-gray-600 mb-6">
                Record your attendance by entering your school ID and name
              </p>
              <Link href="/attendance" className="btn-primary inline-block">
                Check In
              </Link>
            </div>
          </div>
          
          <div className="card hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Admin Dashboard
              </h2>
              <p className="text-gray-600 mb-6">
                View and download attendance records as CSV files
              </p>
              <Link href="/admin" className="btn-secondary inline-block">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 