export default function SimpleHome() {
  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <a href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#1f2937',
            textDecoration: 'none'
          }}>
            <span style={{
              background: '#ea580c',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '0.5rem'
            }}>📚</span>
            INR99.Academy
          </a>
          <nav style={{
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            <a href="#categories" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>Categories</a>
            <a href="#features" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>Features</a>
            <a href="/courses" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>Courses</a>
            <a href="/subscription" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>Pricing</a>
            <a href="/auth/login" style={{
              background: '#ea580c',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}>Login</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%)',
        color: 'white',
        padding: '8rem 1rem 4rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          From Class 1 to Career — Learning for Every Indian
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          A learning utility, just like UPI — for every Indian student. Learn for just ₹99/month.
        </p>
        <a href="/auth/login" style={{
          background: 'white',
          color: '#2563eb',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.375rem',
          textDecoration: 'none',
          fontWeight: '600',
          display: 'inline-block'
        }}>Start Learning Today</a>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          marginTop: '3rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>1-12</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>School Classes</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>14+</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Learning Paths</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>₹99</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Monthly</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" style={{ padding: '4rem 1rem', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Four Main Learning Paths</h2>
            <p style={{ color: '#6b7280' }}>Comprehensive learning structure for every stage of your educational journey</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { icon: '🧒', title: 'School Learning', desc: 'Class 1-12 with all boards - Math, Science, English' },
              { icon: '🎓', title: 'College Foundation', desc: 'UG degrees - Commerce, Science, Engineering' },
              { icon: '🧑‍💼', title: 'Career Skills', desc: 'Professional development - Communication, Leadership' },
              { icon: '💰', title: 'Money & Business', desc: 'Financial literacy - Investment, Business' }
            ].map((cat, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{cat.icon}</div>
                <h3 style={{ marginBottom: '0.5rem' }}>{cat.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Why We're Different</h2>
            <p style={{ color: '#6b7280' }}>We're not a coaching center. We're a learning utility focused on foundation building.</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { icon: '📖', title: 'Concept Clarity', desc: 'Understanding concepts, not exam guarantees' },
              { icon: '💵', title: '₹99/Month', desc: 'Affordable like UPI - accessible to every Indian' },
              { icon: '🏫', title: 'Complete Ecosystem', desc: 'School + College + Skills + Career' },
              { icon: '📱', title: 'India-First Design', desc: 'Built for Indian students with local context' }
            ].map((feat, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feat.icon}</div>
                <h3 style={{ marginBottom: '0.5rem' }}>{feat.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
        color: 'white',
        textAlign: 'center',
        padding: '4rem 1rem'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to Start Your Learning Journey?</h2>
        <p style={{ opacity: 0.9, marginBottom: '2rem' }}>
          Join thousands of learners across India building their future
        </p>
        <a href="/subscription" style={{
          background: 'white',
          color: '#2563eb',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.375rem',
          textDecoration: 'none',
          fontWeight: '600',
          display: 'inline-block'
        }}>Start Learning at ₹99/month</a>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: 'white',
        padding: '3rem 1rem',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '0.5rem' }}>INR99.Academy</h3>
        <p style={{ opacity: 0.6, fontSize: '0.875rem' }}>India's Learning Infrastructure - As reliable as UPI</p>
        <p style={{ marginTop: '1rem', opacity: 0.6, fontSize: '0.875rem' }}>© 2026 INR99.Academy</p>
      </footer>
    </div>
  )
}