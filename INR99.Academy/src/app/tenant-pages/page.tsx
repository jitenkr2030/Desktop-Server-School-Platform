import { getCurrentTenant } from './lib/tenant'
import Link from 'next/link'

export default async function TenantHomePage() {
  const tenant = await getCurrentTenant()

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Institution Not Found
          </h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative py-20 px-4"
        style={{
          background: `linear-gradient(135deg, ${tenant.branding?.primaryColor || '#3b82f6'} 0%, ${tenant.branding?.secondaryColor || '#1e40af'} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to {tenant.name}
          </h1>
          {tenant.description && (
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              {tenant.description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Courses
            </Link>
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Courses
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Access high-quality educational content powered by INR99 Academy
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course cards will be loaded here */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Course Title
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Course description will appear here
              </p>
              <Link
                href="/courses"
                className="text-blue-600 font-medium hover:underline"
              >
                View Course →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of students already learning on {tenant.name}
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: tenant.branding?.primaryColor || '#3b82f6',
            }}
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}
