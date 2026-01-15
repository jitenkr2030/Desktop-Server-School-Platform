import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create profile settings
    let settings = await db.profileSettings.findUnique({
      where: { userId: user.id }
    })

    if (!settings) {
      // Create default settings if they don't exist
      settings = await db.profileSettings.create({
        data: { userId: user.id }
      })
    }

    return NextResponse.json({
      success: true,
      settings
    })

  } catch (error) {
    console.error('Get profile settings error:', error)
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
    const {
      emailNotifications,
      smsNotifications,
      pushNotifications,
      courseUpdates,
      communityUpdates,
      profileVisibility,
      showProgress,
      showCertificates,
      showInLeaderboard,
      preferredLanguage,
      learningMode,
      reminderFrequency,
      fontSize,
      highContrast,
      reducedMotion
    } = body

    // Update profile settings
    const updatedSettings = await db.profileSettings.upsert({
      where: { userId: user.id },
      update: {
        emailNotifications,
        smsNotifications,
        pushNotifications,
        courseUpdates,
        communityUpdates,
        profileVisibility,
        showProgress,
        showCertificates,
        showInLeaderboard,
        preferredLanguage,
        learningMode,
        reminderFrequency,
        fontSize,
        highContrast,
        reducedMotion,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        emailNotifications: emailNotifications ?? true,
        smsNotifications: smsNotifications ?? false,
        pushNotifications: pushNotifications ?? true,
        courseUpdates: courseUpdates ?? true,
        communityUpdates: communityUpdates ?? true,
        profileVisibility: profileVisibility ?? 'PUBLIC',
        showProgress: showProgress ?? true,
        showCertificates: showCertificates ?? true,
        showInLeaderboard: showInLeaderboard ?? true,
        preferredLanguage: preferredLanguage ?? 'en',
        learningMode: learningMode ?? 'BALANCED',
        reminderFrequency: reminderFrequency ?? 'DAILY',
        fontSize: fontSize ?? 'MEDIUM',
        highContrast: highContrast ?? false,
        reducedMotion: reducedMotion ?? false
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: updatedSettings
    })

  } catch (error) {
    console.error('Update profile settings error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}