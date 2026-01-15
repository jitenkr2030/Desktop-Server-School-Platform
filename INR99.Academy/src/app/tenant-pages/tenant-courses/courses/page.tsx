import { getCurrentTenant } from '../../lib/tenant'
import Link from 'next/link'

export default async function TenantCoursesPage() {
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold text-gray-900 mb-4"
            style={{ color: tenant.branding?.primaryColor }}
          >
            Courses at {tenant.name}
          </h1>
          <p className="text-xl text-gray-600">
            Browse our collection of courses
          </p>
        </div>

        {/* Categories filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            className="px-6 py-2 rounded-full text-white font-medium"
            style={{ backgroundColor: tenant.branding?.primaryColor }}
          >
            All Courses
          </button>
          <button className="px-6 py-2 rounded-full bg-white text-gray-700 font-medium border border-gray-200 hover:border-gray-300">
            School
          </button>
          <button className="px-6 py-2 rounded-full bg-white text-gray-700 font-medium border border-gray-200 hover:border-gray-300">
            College
          </button>
          <button className="px-6 py-2 rounded-full bg-white text-gray-700 font-medium border border-gray-200 hover:border-gray-300">
            Skills
          </button>
        </div>

        {/* Course grid placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="text-xs font-medium text-blue-600 mb-2">
                  Category
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Course Title {i}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  This is a placeholder course description. The actual course
                  content and details will be loaded from the database.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Free</span>
                  <Link
                    href={`/courses/${i}`}
                    className="px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                    style={{
                      backgroundColor: tenant.branding?.primaryColor,
                    }}
                  >
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="text-center mt-12">
          <button
            className="px-8 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Load More Courses
          </button>
        </div>
      </div>
    </div>
  )
}
