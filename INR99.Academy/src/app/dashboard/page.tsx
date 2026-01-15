import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export default async function DashboardPage() {
  let session = null
  let isAuthenticated = false

  try {
    session = await auth()
    isAuthenticated = !!session?.user
  } catch (error) {
    isAuthenticated = false
  }

  if (!isAuthenticated || !session?.user) {
    redirect('/auth/login')
  }

  // Get user role from session
  const userRole = (session.user as { role?: string })?.role || 'STUDENT'

  // Redirect to role-specific dashboard
  switch (userRole) {
    case 'INSTRUCTOR':
      redirect('/dashboard/instructor/overview')
    case 'ADMIN':
    case 'SUPER_ADMIN':
      redirect('/dashboard/admin/overview')
    case 'STUDENT':
    default:
      redirect('/dashboard/student/overview')
  }
}
