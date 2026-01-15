import { NextRequest, NextResponse } from 'next/server'
import { getAllInstructorPlans, getInstructorSubscriptionStatus, canCreateCourse, canCreateLiveSession } from '@/lib/simple-db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    const plans = getAllInstructorPlans()
    const { plan, subscription, usage } = getInstructorSubscriptionStatus(userId)
    const coursePermission = canCreateCourse(userId)
    const sessionPermission = canCreateLiveSession(userId)

    return NextResponse.json({
      success: true,
      data: {
        currentPlan: plan,
        subscription: subscription ? {
          id: subscription.id,
          planId: subscription.planId,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
        } : null,
        usage: usage ? {
          courseCount: usage.courseCount,
          liveSessionCount: usage.liveSessionCount,
          storageUsedGB: usage.storageUsedGB,
          totalStudents: usage.totalStudents
        } : null,
        permissions: {
          canCreateCourse: coursePermission,
          canCreateLiveSession: sessionPermission
        },
        availablePlans: plans.map(plan => ({
          id: plan.id,
          name: plan.name,
          monthlyPrice: plan.monthlyPrice,
          yearlyPrice: plan.yearlyPrice,
          features: plan.features,
          limits: plan.limits
        }))
      }
    })

  } catch (error) {
    console.error('Error fetching instructor subscription status:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch subscription status' },
      { status: 500 }
    )
  }
}
