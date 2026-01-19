import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { decryptPayload, verifyChecksum, generateChecksum } from "@inr99/sync"
import { validateLicense, processHeartbeat } from "@/lib/license-service"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const licenseKey = request.headers.get("X-License-Key")
    const schoolId = request.headers.get("X-School-Id")
    
    if (!licenseKey) {
      return NextResponse.json(
        { error: "LICENSE_REQUIRED", message: "License key is required" },
        { status: 401 }
      )
    }
    
    // Validate license
    const validation = await validateLicense(licenseKey)
    if (!validation.valid) {
      return NextResponse.json(
        { error: "LICENSE_INVALID", message: validation.message },
        { status: 403 }
      )
    }
    
    // Get organization
    const organization = await prisma.organization.findUnique({
      where: { licenseKey }
    })
    
    if (!organization) {
      return NextResponse.json(
        { error: "ORGANIZATION_NOT_FOUND" },
        { status: 404 }
      )
    }
    
    // Parse and decrypt payload
    const body = await request.json()
    const syncSecret = process.env.SYNC_SECRET!
    
    if (!syncSecret) {
      console.error("SYNC_SECRET not configured")
      return NextResponse.json(
        { error: "SERVER_CONFIG_ERROR" },
        { status: 500 }
      )
    }
    
    let payload
    try {
      payload = decryptPayload(body, syncSecret)
    } catch (error) {
      console.error("Failed to decrypt payload:", error)
      return NextResponse.json(
        { error: "DECRYPTION_FAILED", message: "Failed to decrypt sync payload" },
        { status: 400 }
      )
    }
    
    // Verify checksum
    const { checksum, ...payloadData } = payload as any
    if (!verifyChecksum(payloadData, checksum)) {
      return NextResponse.json(
        { error: "CHECKSUM_FAILED", message: "Payload integrity check failed" },
        { status: 400 }
      )
    }
    
    // Process entries
    const results = await processEntries(organization.id, payload.entries)
    
    // Update sync timestamp
    await prisma.organization.update({
      where: { id: organization.id },
      data: { lastSyncAt: new Date() }
    })
    
    return NextResponse.json({
      success: true,
      syncedCount: results.synced,
      failedCount: results.failed,
      errors: results.errors,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Sync ingestion error:", error)
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to process sync data" },
      { status: 500 }
    )
  }
}

async function processEntries(schoolId: string, entries: any[]) {
  let synced = 0
  let failed = 0
  const errors: Array<{ entryId: string; error: string }> = []
  
  for (const entry of entries) {
    try {
      await processEntry(schoolId, entry)
      synced++
    } catch (error) {
      failed++
      errors.push({
        entryId: entry.id,
        error: error instanceof Error ? error.message : "Unknown error"
      })
    }
  }
  
  return { synced, failed, errors }
}

async function processEntry(schoolId: string, entry: any) {
  const { entityType, entityId, operation, data } = entry
  
  // Route to appropriate handler based on entity type
  switch (entityType) {
    case "Student":
      return handleStudentSync(schoolId, operation, entityId, data)
    case "AttendanceRecord":
      return handleAttendanceSync(schoolId, operation, entityId, data)
    case "ExamResult":
      return handleExamResultSync(schoolId, operation, entityId, data)
    case "Homework":
      return handleHomeworkSync(schoolId, operation, entityId, data)
    case "Notice":
      return handleNoticeSync(schoolId, operation, entityId, data)
    default:
      console.log(`Unknown entity type: ${entityType}`)
      // Log for later implementation
      return { success: true, skipped: true }
  }
}

async function handleStudentSync(schoolId: string, operation: string, entityId: string, data: any) {
  // Create or update shadow record in cloud
  await prisma.cloudStudentShadow.upsert({
    where: {
      schoolId_localStudentId: {
        schoolId,
        localStudentId: entityId
      }
    },
    update: {
      firstName: data.firstName || data.user?.firstName,
      lastName: data.lastName || data.user?.lastName,
      admissionNumber: data.admissionNumber,
      currentGrade: data.currentGrade,
      section: data.section,
      lastUpdated: new Date()
    },
    create: {
      schoolId,
      localStudentId: entityId,
      firstName: data.firstName || data.user?.firstName,
      lastName: data.lastName || data.user?.lastName,
      admissionNumber: data.admissionNumber,
      currentGrade: data.currentGrade,
      section: data.section
    }
  })
  
  return { success: true }
}

async function handleAttendanceSync(schoolId: string, operation: string, entityId: string, data: any) {
  // Get the cloud shadow ID for the student
  const studentShadow = await prisma.cloudStudentShadow.findUnique({
    where: { schoolId_localStudentId: { schoolId, localStudentId: data.studentId } }
  })
  
  if (!studentShadow) {
    console.warn(`Student shadow not found for: ${data.studentId}`)
    return { success: false, skipped: true }
  }
  
  await prisma.cloudAttendanceShadow.create({
    data: {
      schoolId,
      studentId: studentShadow.id,
      date: new Date(data.date),
      status: data.status,
      period: data.period,
      subjectId: data.subjectId
    }
  })
  
  // Update aggregated stats
  await updateStudentAttendanceStats(schoolId, studentShadow.id)
  
  return { success: true }
}

async function handleExamResultSync(schoolId: string, operation: string, entityId: string, data: any) {
  const studentShadow = await prisma.cloudStudentShadow.findUnique({
    where: { schoolId_localStudentId: { schoolId, localStudentId: data.studentId } }
  })
  
  if (!studentShadow) {
    console.warn(`Student shadow not found for: ${data.studentId}`)
    return { success: false, skipped: true }
  }
  
  // Calculate percentage
  const percentage = data.marks && data.maxMarks 
    ? (data.marks / data.maxMarks) * 100 
    : null
  
  await prisma.cloudExamResultShadow.create({
    data: {
      schoolId,
      studentId: studentShadow.id,
      examId: data.examId,
      subjectId: data.subjectId || "unknown",
      subjectName: data.subjectName || "Unknown",
      maxMarks: data.maxMarks || 100,
      marks: data.marks,
      grade: data.grade,
      percentage
    }
  })
  
  return { success: true }
}

async function handleHomeworkSync(schoolId: string, operation: string, entityId: string, data: any) {
  // Homework data synced to cloud for parent visibility
  // This would create records that parents can see
  console.log(`Syncing homework: ${entityId}`)
  return { success: true }
}

async function handleNoticeSync(schoolId: string, operation: string, entityId: string, data: any) {
  // Notice data synced to cloud
  // This would create records that parents can see
  console.log(`Syncing notice: ${entityId}`)
  return { success: true }
}

async function updateStudentAttendanceStats(schoolId: string, studentId: string) {
  const records = await prisma.cloudAttendanceShadow.findMany({
    where: { schoolId, studentId }
  })
  
  const totals = records.reduce((acc, record) => {
    if (record.status === "PRESENT") acc.present++
    else if (record.status === "ABSENT") acc.absent++
    else if (record.status === "LEAVE") acc.leave++
    return acc
  }, { present: 0, absent: 0, leave: 0 })
  
  await prisma.cloudStudentShadow.update({
    where: { id: studentId },
    data: {
      totalDays: records.length,
      presentDays: totals.present,
      absentDays: totals.absent,
      leaveDays: totals.leave,
      lastUpdated: new Date()
    }
  })
}
