import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Platform settings with all configuration options
const defaultSettings = {
  // General Settings
  siteName: "INR99 Academy",
  siteDescription: "Online Learning Platform",
  siteUrl: "https://inr99.com",
  logoUrl: "",
  faviconUrl: "",
  
  // Feature Flags
  maintenanceMode: false,
  allowRegistration: true,
  allowGuestCheckout: false,
  emailNotifications: true,
  pushNotifications: false,
  
  // Business Settings
  defaultCurrency: "INR",
  platformFee: 10,
  taxRate: 0,
  
  // Upload Settings
  maxUploadSize: 100, // MB
  allowedFileTypes: ["jpg", "jpeg", "png", "gif", "pdf", "mp4", "webm"],
  
  // Course Settings
  defaultCourseDuration: 60, // days
  certificateExpiry: 365, // days
  maxStudentsPerCourse: 1000,
  
  // Security Settings
  passwordMinLength: 8,
  sessionTimeout: 24, // hours
  twoFactorRequired: false,
  
  // SEO Settings
  metaKeywords: "online learning, courses, education",
  metaDescription: "Learn new skills with expert-led courses",
  
  // Social Links
  facebookUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
  
  // Contact Information
  supportEmail: "support@inr99.com",
  contactPhone: "+91 98765 43210",
  address: "",
  
  // Analytics
  googleAnalyticsId: "",
  facebookPixelId: "",
}

// Store settings in memory (in production, use database)
let platformSettings = { ...defaultSettings }

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

    return NextResponse.json({ settings: platformSettings })
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
    
    // Update settings with only provided fields
    platformSettings = {
      ...platformSettings,
      ...body,
    }

    return NextResponse.json({ 
      success: true, 
      message: "Settings saved successfully",
      settings: platformSettings 
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

    // Handle different actions
    switch (action) {
      case "reset":
        platformSettings = { ...defaultSettings }
        return NextResponse.json({ 
          success: true, 
          message: "Settings reset to defaults",
          settings: platformSettings 
        })
      
      case "backup":
        // In production, create backup of settings
        return NextResponse.json({ 
          success: true, 
          message: "Settings backup created",
          backup: platformSettings 
        })
      
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error performing action:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
