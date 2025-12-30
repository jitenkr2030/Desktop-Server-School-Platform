import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import DashboardLayout from '@/components/DashboardLayout'

export default async function StudentProfile() {
  let session = null

  try {
    session = await auth()
  } catch (error) {
    // Continue without session
  }

  if (!session?.user) {
    redirect('/auth/login')
  }

  // Get user data from session
  const userName = session.user.name || 'Student'
  const userEmail = session.user.email || 'student@example.com'

  const profile = {
    name: userName,
    email: userEmail,
    mobile: '+91 9876543210',
    location: 'India',
    memberSince: 'January 2024',
    bio: 'Passionate learner exploring web development and programming.'
  }

  return (
    <DashboardLayout userRole="student" userInfo={profile}>
      <div style={{ 
        background: 'white', 
        borderRadius: '0.75rem', 
        padding: '2rem', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
      }}>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '700', 
          color: '#1f2937', 
          marginBottom: '2rem' 
        }}>
          👤 My Profile
        </h1>

        {/* Profile Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2rem', 
          marginBottom: '3rem',
          flexWrap: 'wrap' 
        }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: '#ea580c', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '2.5rem' 
          }}>
            {profile.name.charAt(0)}
          </div>
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#1f2937', 
              marginBottom: '0.5rem' 
            }}>
              {profile.name}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '0.25rem' }}>
              Student
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Member since {profile.memberSince}
            </p>
          </div>
        </div>

        {/* Profile Information */}
        <div style={{ display: 'grid', gap: '2rem' }}>
          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '1.5rem' 
            }}>
              Personal Information
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'auto 1fr', 
                gap: '1rem', 
                alignItems: 'center' 
              }}>
                <span style={{ fontWeight: '500', color: '#374151', width: '120px' }}>Email:</span>
                <span style={{ color: '#6b7280' }}>{profile.email}</span>
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'auto 1fr', 
                gap: '1rem', 
                alignItems: 'center' 
              }}>
                <span style={{ fontWeight: '500', color: '#374151', width: '120px' }}>Phone:</span>
                <span style={{ color: '#6b7280' }}>{profile.mobile}</span>
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'auto 1fr', 
                gap: '1rem', 
                alignItems: 'center' 
              }}>
                <span style={{ fontWeight: '500', color: '#374151', width: '120px' }}>Location:</span>
                <span style={{ color: '#6b7280' }}>{profile.location}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '1.5rem' 
            }}>
              About Me
            </h3>
            <p style={{ 
              color: '#6b7280', 
              lineHeight: '1.6', 
              padding: '1rem', 
              background: '#f9fafb', 
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb' 
            }}>
              {profile.bio}
            </p>
          </div>

          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '1.5rem' 
            }}>
              Account Settings
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <button style={{
                padding: '0.75rem 1rem',
                background: '#ea580c',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                width: 'fit-content'
              }}>
                Edit Profile
              </button>
              <button style={{
                padding: '0.75rem 1rem',
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: 'pointer',
                width: 'fit-content'
              }}>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}