'use client'

import { useState, useEffect } from 'react'

interface Tenant {
  id: string
  name: string
  studentCount: number | null
  domains: Array<{ domain: string }>
  createdAt: string
}

export default function AdminVerificationPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/verification?status=UNDER_REVIEW')
      .then(res => res.json())
      .then(data => {
        if (data.success) setTenants(data.tenants)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <header style={{ backgroundColor: 'white', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Verification Review</h1>
        </div>
      </header>
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'medium', color: '#111827', marginBottom: '1rem' }}>Pending Verifications</h2>
          {loading ? (
            <p style={{ color: '#6b7280' }}>Loading...</p>
          ) : tenants.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No pending verifications</p>
          ) : (
            <ul style={{ divideY: '1px solid #e5e7eb' }}>
              {tenants.map(tenant => (
                <li key={tenant.id} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: 'medium', color: '#111827' }}>{tenant.name}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{tenant.domains.map(d => d.domain).join(', ')}</p>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{tenant.studentCount ?? 0} students</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
