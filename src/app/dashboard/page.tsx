import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export default async function DashboardPage() {
  const session = await auth()

  // Server-side authentication check - redirect to standalone dashboard
  if (!session?.user) {
    redirect('/auth/login')
  }

  // Redirect to standalone dashboard that bypasses all potential client-side issues
  redirect('/dashboard/standalone')
}
