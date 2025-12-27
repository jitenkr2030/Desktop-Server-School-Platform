"use client"

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { useSession } from 'next-auth/react'

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  totalDiscussions: number
  totalSubscriptions: number
  activeSubscriptions: number
  totalCertificates: number
  totalPayments: number
  totalRevenue: number
  monthlyRevenue: number
}

export default function AdminOverview() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      
      if (data.stats) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const userName = session?.user?.name || 'Admin'
  const userEmail = session?.user?.email || ''

  if (loading) {
    return (
      <DashboardLayout userRole="admin" userInfo={{ name: userName, email: userEmail }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="admin" userInfo={{ name: userName, email: userEmail }}>
      <div>
        {/* Welcome Section */}
        <div style={{ 
          background: 'white', 
          borderRadius: '0.75rem', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: '#1f2937', 
            marginBottom: '0.5rem' 
          }}>
            Admin Dashboard 🛠️
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            System overview and management tools
          </p>
        </div>

        {/* System Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #059669' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Users</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{stats?.totalUsers?.toLocaleString() || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>{stats?.activeUsers?.toLocaleString() || 0} active</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #3b82f6' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Active Students</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{stats?.activeSubscriptions?.toLocaleString() || 0}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #9333ea' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Courses</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{stats?.totalCourses?.toLocaleString() || 0}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #ea580c' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Revenue</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #16a34a' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Monthly Revenue</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>₹{stats?.monthlyRevenue?.toLocaleString() || 0}</div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #eab308' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Certificates</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{stats?.totalCertificates?.toLocaleString() || 0}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
          {/* Quick Actions */}
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '2rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#1f2937', 
              marginBottom: '1.5rem' 
            }}>
              Quick Actions
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <button style={{
                padding: '1rem',
                background: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>👥</span>
                Manage Users
              </button>
              
              <button style={{
                padding: '1rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>📚</span>
                Course Management
              </button>
              
              <button style={{
                padding: '1rem',
                background: '#9333ea',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>📊</span>
                Analytics & Reports
              </button>
              
              <button style={{
                padding: '1rem',
                background: '#ea580c',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>⚙️</span>
                System Settings
              </button>
              
              <button style={{
                padding: '1rem',
                background: '#eab308',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>💰</span>
                Financial Reports
              </button>
            </div>
          </div>

          {/* System Health */}
          <div style={{ 
            background: 'white', 
            borderRadius: '0.75rem', 
            padding: '2rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#1f2937', 
              marginBottom: '1.5rem' 
            }}>
              System Health
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ 
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500' }}>Database</span>
                  <span style={{ background: '#16a34a', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem' }}>Healthy</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Connection active</div>
              </div>
              
              <div style={{ 
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500' }}>API Status</span>
                  <span style={{ background: '#16a34a', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem' }}>Operational</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>All endpoints responding</div>
              </div>
              
              <div style={{ 
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500' }}>Storage</span>
                  <span style={{ background: '#3b82f6', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem' }}>45% Used</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>4.5 GB of 10 GB</div>
              </div>
              
              <div style={{ 
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500' }}>Last Backup</span>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
