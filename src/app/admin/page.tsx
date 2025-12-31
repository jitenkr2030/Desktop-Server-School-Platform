"use client"

import { useState, useEffect } from 'react'

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

interface DashboardData {
  stats: AdminStats
  userGrowth: any[]
  courseStats: any[]
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('admin')
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)

  useEffect(() => {
    setMounted(true)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch stats from API
      const statsResponse = await fetch('/api/admin/stats')
      
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data: DashboardData = await statsResponse.json()
      setStats(data.stats)

      // Get current user from session
      const userResponse = await fetch('/api/auth/session')
      if (userResponse.ok) {
        const session = await userResponse.json()
        if (session?.user) {
          setUser({
            name: session.user.name || 'Admin',
            email: session.user.email || 'admin@inr99.com',
            role: session.user.role || 'ADMIN'
          })
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #dc2626', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'profile', label: '👤 Profile' },
    { id: 'courses', label: '📚 Courses' },
    { id: 'users', label: '👥 Users' },
    { id: 'admin', label: '⚙️ Admin' }
  ]

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)

  const handleTabClick = (tabId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setTab(tabId)
  }

  // Loading state
  if (loading && tab === 'dashboard' || tab === 'admin') {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
        {/* Navigation Bar */}
        <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>A</div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>Loading...</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Fetching data</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {tabs.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={(e) => handleTabClick(t.id, e)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      background: tab === t.id ? '#dc2626' : '#f3f4f6',
                      color: tab === t.id ? 'white' : '#374151',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <a href="/" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'white', color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                🚪 Logout
              </a>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ height: '20px', background: '#e5e7eb', borderRadius: '4px', width: '60%', marginBottom: '0.5rem' }}></div>
                <div style={{ height: '32px', background: '#e5e7eb', borderRadius: '4px', width: '40%' }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && (tab === 'dashboard' || tab === 'admin')) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
        {/* Navigation Bar */}
        <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>A</div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>Demo Admin</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>admin1@inr99.com</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {tabs.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={(e) => handleTabClick(t.id, e)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      background: tab === t.id ? '#dc2626' : '#f3f4f6',
                      color: tab === t.id ? 'white' : '#374151',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <a href="/" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'white', color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                🚪 Logout
              </a>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#991b1b', marginBottom: '0.5rem' }}>Error Loading Data</h2>
            <p style={{ color: '#7f1d1d', marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={fetchDashboardData}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#dc2626',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      {/* Navigation Bar */}
      <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>A</div>
              <div>
                <div style={{ fontWeight: '600', color: '#1f2937' }}>{user?.name || 'Demo Admin 1'}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user?.email || 'admin1@inr99.com'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={(e) => handleTabClick(t.id, e)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    background: tab === t.id ? '#dc2626' : '#f3f4f6',
                    color: tab === t.id ? 'white' : '#374151',
                    transition: 'all 0.2s'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <a href="/" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'white', color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
              🚪 Logout
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {tab === 'dashboard' && stats && (
          <div>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Welcome back, Admin!</h1>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Monitor your platform performance and manage users</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: '👥' },
                { label: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: '✅' },
                { label: 'Total Courses', value: stats.totalCourses.toLocaleString(), icon: '📚' },
                { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: '💰' }
              ].map(stat => (
                <div key={stat.label} style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{stat.label}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.25rem' }}>{stat.value}</p>
                    </div>
                    <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>My Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div style={{ textAlign: 'center', padding: '2rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>A</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>{user?.name || 'Demo Admin 1'}</h3>
                <p style={{ color: '#6b7280' }}>{user?.email || 'admin1@inr99.com'}</p>
                <span style={{ display: 'inline-block', marginTop: '0.5rem', background: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600' }}>Administrator</span>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { label: 'Name', value: user?.name || 'Demo Admin 1', icon: '👤' },
                  { label: 'Email', value: user?.email || 'admin1@inr99.com', icon: '📧' },
                  { label: 'Role', value: user?.role || 'Administrator', icon: '🛡️' },
                  { label: 'Member Since', value: 'January 2024', icon: '📅' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.label}</p>
                      <p style={{ fontWeight: '500', color: '#1f2937' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'courses' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>📚 All Courses</h2>
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem' }}>
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>Course management coming soon...</p>
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>👥 All Users</h2>
            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem' }}>
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>User management coming soon...</p>
            </div>
          </div>
        )}

        {tab === 'admin' && stats && (
          <div>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>⚙️ Admin Dashboard</h1>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Complete platform overview and management</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: '👥' },
                { label: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: '✅' },
                { label: 'Total Courses', value: stats.totalCourses.toLocaleString(), icon: '📚' },
                { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: '💰' },
                { label: 'Active Students', value: stats.activeSubscriptions.toLocaleString(), icon: '🎓' },
                { label: 'Monthly Revenue', value: formatCurrency(stats.monthlyRevenue), icon: '📈' },
                { label: 'Certificates', value: stats.totalCertificates.toLocaleString(), icon: '🏆' },
                { label: 'Discussions', value: stats.totalDiscussions.toLocaleString(), icon: '💬' }
              ].map(stat => (
                <div key={stat.label} style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{stat.label}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.25rem' }}>{stat.value}</p>
                    </div>
                    <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Quick Actions</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: '#dc2626', color: 'white', borderRadius: '0.5rem', border: 'none', fontWeight: '600', cursor: 'pointer' }}>👥 Manage Users</button>
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#374151', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontWeight: '600', cursor: 'pointer' }}>📚 Course Management</button>
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#374151', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontWeight: '600', cursor: 'pointer' }}>📊 Analytics & Reports</button>
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#374151', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontWeight: '600', cursor: 'pointer' }}>⚙️ System Settings</button>
                <button type="button" style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#374151', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontWeight: '600', cursor: 'pointer' }}>💰 Financial Reports</button>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>System Health</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Database', value: 'Healthy', status: 'green' },
                  { label: 'API Status', value: 'Operational', status: 'green' },
                  { label: 'Storage', value: '45% Used', status: 'yellow' },
                  { label: 'Last Backup', value: '2 hours ago', status: 'green' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                    <span style={{ color: '#6b7280' }}>{item.label}</span>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.875rem', 
                      fontWeight: '600',
                      background: item.status === 'green' ? '#dcfce7' : item.status === 'yellow' ? '#fef3c7' : '#fee2e2',
                      color: item.status === 'green' ? '#166534' : item.status === 'yellow' ? '#854d0e' : '#991b1b'
                    }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
