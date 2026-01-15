import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an instructor
    const currentUser = await db.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!currentUser || (currentUser.role !== 'INSTRUCTOR' && currentUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get instructor profile
    const instructorProfile = await db.instructorProfile.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            createdAt: true
          }
        }
      }
    })

    if (!instructorProfile) {
      return NextResponse.json({ error: 'Instructor profile not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      profile: instructorProfile
    })

  } catch (error) {
    console.error('Get instructor profile error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an instructor
    const currentUser = await db.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!currentUser || (currentUser.role !== 'INSTRUCTOR' && currentUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const {
      bio,
      expertise,
      experience,
      qualifications,
      achievements,
      socialLinks,
      teachingStyle
    } = body

    // Validate required fields
    if (!bio) {
      return NextResponse.json({ error: 'Bio is required' }, { status: 400 })
    }

    if (!expertise || !Array.isArray(expertise) || expertise.length === 0) {
      return NextResponse.json({ error: 'At least one expertise area is required' }, { status: 400 })
    }

    // Update instructor profile
    const updatedProfile = await db.instructorProfile.upsert({
      where: { userId: user.id },
      update: {
        bio,
        expertise: JSON.stringify(expertise),
        experience,
        qualifications,
        achievements: achievements ? JSON.stringify(achievements) : null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        teachingStyle,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        bio,
        expertise: JSON.stringify(expertise),
        experience,
        qualifications,
        achievements: achievements ? JSON.stringify(achievements) : null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        teachingStyle
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Instructor profile updated successfully',
      profile: updatedProfile
    })

  } catch (error) {
    console.error('Update instructor profile error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a student and wants to become an instructor
    const currentUser = await db.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!currentUser || currentUser.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Only students can apply to become instructors' }, { status: 403 })
    }

    const body = await request.json()
    const {
      bio,
      expertise,
      experience,
      qualifications,
      achievements,
      socialLinks,
      teachingStyle
    } = body

    // Validate required fields
    if (!bio) {
      return NextResponse.json({ error: 'Bio is required' }, { status: 400 })
    }

    if (!expertise || !Array.isArray(expertise) || expertise.length === 0) {
      return NextResponse.json({ error: 'At least one expertise area is required' }, { status: 400 })
    }

    // Check if instructor profile already exists
    const existingProfile = await db.instructorProfile.findUnique({
      where: { userId: user.id }
    })

    if (existingProfile) {
      return NextResponse.json({ error: 'Instructor profile already exists' }, { status: 400 })
    }

    // Create instructor profile (pending approval)
    const newProfile = await db.instructorProfile.create({
      data: {
        userId: user.id,
        bio,
        expertise: JSON.stringify(expertise),
        experience,
        qualifications,
        achievements: achievements ? JSON.stringify(achievements) : null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        teachingStyle,
        isApproved: false
      }
    })

    // Update user role to instructor (pending approval)
    await db.user.update({
      where: { id: user.id },
      data: { role: 'INSTRUCTOR' }
    })

    return NextResponse.json({
      success: true,
      message: 'Instructor application submitted successfully. Awaiting approval.',
      profile: newProfile
    })

  } catch (error) {
    console.error('Create instructor profile error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}