export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '4rem 1rem' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            INR99.Academy
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#6b7280',
            marginBottom: '2rem'
          }}>
            India's Learning Infrastructure
          </p>
          <div style={{
            backgroundColor: '#ea580c',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            display: 'inline-block',
            fontWeight: '600'
          }}>
            Homepage is working correctly!
          </div>
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Simple Test Page
            </h2>
            <p style={{ color: '#4b5563' }}>
              If you can see this, the basic Next.js setup is working. 
              The complex homepage components may have been causing issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}