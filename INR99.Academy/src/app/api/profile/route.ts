import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile with settings
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user.id}`, {
      headers: {
        'Authorization': request.headers.get('authorization') || ''
      }
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    const userData = await response.json()

    // Get profile settings
    const settingsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/settings`, {
      headers: {
        'Authorization': request.headers.get('authorization') || ''
      }
    })

    const settings = settingsResponse.ok ? await settingsResponse.json() : null

    return NextResponse.json({
      success: true,
      profile: {
        ...userData.user,
        settings: settings?.settings || null
      }
    })

  } catch (error) {
    console.error('Get profile error:', error)
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

    const body = await request.json()
    const { name, email, bio, location, website, avatar } = body

    // Validate input
    if (name && typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Update user profile
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (bio !== undefined) updateData.bio = bio
    if (location !== undefined) updateData.location = location
    if (website !== undefined) updateData.website = website
    if (avatar !== undefined) updateData.avatar = avatar
    updateData.updatedAt = new Date()

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || ''
      },
      body: JSON.stringify(updateData)
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    const updatedUser = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}