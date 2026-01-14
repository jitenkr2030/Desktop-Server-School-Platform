import { getCurrentTenant } from './lib/tenant'
import './globals.css'

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tenant = await getCurrentTenant()

  // If no tenant found, show a simple error page
  if (!tenant) {
    return (
      <html lang="en">
        <body>
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Institution Not Found
              </h1>
              <p className="text-gray-600">
                We could not find an institution with this subdomain.
              </p>
            </div>
          </div>
        </body>
      </html>
    )
  }

  // Apply tenant branding
  const branding = tenant.branding
  const primaryColor = branding?.primaryColor || '#3b82f6'
  const secondaryColor = branding?.secondaryColor || '#1e40af'
  const fontFamily = branding?.fontFamily || 'Inter'

  return (
    <html lang="en">
      <head>
        {/* Apply tenant's custom CSS if available */}
        {branding?.customCss && (
          <style dangerouslySetInnerHTML={{ __html: branding.customCss }} />
        )}
      </head>
      <body
        className="min-h-screen bg-white"
        style={{
          fontFamily: `${fontFamily}, system-ui, sans-serif`,
        }}
      >
        {/* Tenant-specific header/navigation could go here */}
        <header
          className="border-b"
          style={{ borderColor: `${primaryColor}20` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                {branding?.logoUrl ? (
                  <img
                    src={branding.logoUrl}
                    alt={tenant.name}
                    className="h-8 w-auto"
                  />
                ) : (
                  <span
                    className="text-xl font-bold"
                    style={{ color: primaryColor }}
                  >
                    {tenant.name}
                  </span>
                )}
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex space-x-8">
                <a
                  href="/"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Home
                </a>
                <a
                  href="/courses"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Courses
                </a>
                <a
                  href="/dashboard"
                  className="text-gray-700 hover:text-gray-900"
                >
                  My Learning
                </a>
              </nav>

              {/* Login/Register buttons */}
              <div className="flex items-center space-x-4">
                <a
                  href="/auth/login"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign In
                </a>
                <a
                  href="/auth/register"
                  className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: primaryColor }}
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              Powered by INR99 Academy
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
