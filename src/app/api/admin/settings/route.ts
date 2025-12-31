import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Try to get existing settings, or create default if none exist
    let settings = await prisma.platformSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (!settings) {
      // Create default settings
      settings = await prisma.platformSettings.create({
        data: {
          siteName: "INR99 Academy",
          siteDescription: "Online Learning Platform",
          siteUrl: "https://inr99.com",
          defaultCurrency: "INR",
          platformFee: 10,
          taxRate: 0,
          maxUploadSize: 100,
          supportEmail: "support@inr99.com"
        }
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    
    // Get existing settings or create new one
    const existingSettings = await prisma.platformSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    let settings
    if (existingSettings) {
      // Update existing settings
      settings = await prisma.platformSettings.update({
        where: { id: existingSettings.id },
        data: {
          ...body,
          updatedAt: new Date()
        }
      })
    } else {
      // Create new settings
      settings = await prisma.platformSettings.create({
        data: body
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Settings saved successfully",
      settings 
    })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      case "reset":
        // Delete all existing settings and create fresh defaults
        await prisma.platformSettings.deleteMany()
        
        const newSettings = await prisma.platformSettings.create({
          data: {
            siteName: "INR99 Academy",
            siteDescription: "Online Learning Platform",
            siteUrl: "https://inr99.com",
            defaultCurrency: "INR",
            platformFee: 10,
            taxRate: 0,
            maxUploadSize: 100,
            supportEmail: "support@inr99.com"
          }
        })
        
        return NextResponse.json({ 
          success: true, 
          message: "Settings reset to defaults",
          settings: newSettings 
        })
      
      case "backup":
        const allSettings = await prisma.platformSettings.findMany({
          orderBy: { createdAt: 'desc' },
          take: 1
        })
        
        return NextResponse.json({ 
          success: true, 
          message: "Settings backup retrieved",
          backup: allSettings[0] || null
        })
      
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error performing action:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
