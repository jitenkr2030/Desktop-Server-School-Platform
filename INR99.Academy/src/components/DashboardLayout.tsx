'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: 'student' | 'instructor' | 'admin'
  userInfo: {
    name: string
    email: string
  }
}

export default function DashboardLayout({ children, userRole, userInfo }: DashboardLayoutProps) {
  const pathname = usePathname()
  
  const navigationItems = {
    student: [
      { href: '/dashboard/student/overview', label: '📊 Dashboard', id: 'overview' },
      { href: '/dashboard/student/profile', label: '👤 Profile', id: 'profile' },
      { href: '/dashboard/student/courses', label: '📚 Courses', id: 'courses' },
      { href: '/dashboard/student/certificates', label: '🎓 Certificates', id: 'certificates' }
    ],
    instructor: [
      { href: '/dashboard/instructor/overview', label: '📊 Dashboard', id: 'overview' },
      { href: '/dashboard/instructor/profile', label: '👤 Profile', id: 'profile' },
      { href: '/dashboard/instructor/courses', label: '📚 Courses', id: 'courses' },
      { href: '/dashboard/instructor/students', label: '👥 Students', id: 'students' }
    ],
    admin: [
      { href: '/dashboard/admin/overview', label: '📊 Dashboard', id: 'overview' },
      { href: '/dashboard/admin/profile', label: '👤 Profile', id: 'profile' },
      { href: '/dashboard/admin/users', label: '👥 Users', id: 'users' },
      { href: '/dashboard/admin/settings', label: '⚙️ Settings', id: 'settings' }
    ]
  }

  const navItems = navigationItems[userRole] || []
  const roleColors = {
    student: '#ea580c',
    instructor: '#9333ea', 
    admin: '#059669'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Header */}
      <div style={{ 
        background: 'white', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {/* User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: roleColors[userRole], 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white', 
                fontWeight: 'bold', 
                fontSize: '1.25rem' 
              }}>
                {userInfo.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#1f2937' }}>{userInfo.name}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', textTransform: 'uppercase' }}>
                  {userRole}
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {navItems.map(item => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      background: isActive ? roleColors[userRole] : '#f3f4f6',
                      color: isActive ? 'white' : '#374151',
                      transition: 'all 0.2s'
                    }}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* Logout */}
            <a href="/api/auth/signout" style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '0.5rem', 
              border: '1px solid #d1d5db', 
              background: 'white', 
              color: '#374151', 
              textDecoration: 'none', 
              fontSize: '0.875rem', 
              fontWeight: '500' 
            }}>
              🚪 Logout
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {children}
      </div>
    </div>
  )
}