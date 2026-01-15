import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db'

interface BulkUploadRequest {
  tenantId: string
  classId?: string
  students: Array<{
    name: string
    email: string
    phone?: string
    rollNumber?: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const body: BulkUploadRequest = await request.json()
    const { tenantId, classId, students } = body

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      )
    }

    if (!students || students.length === 0) {
      return NextResponse.json(
        { error: 'No students provided' },
        { status: 400 }
      )
    }

    if (students.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 students per upload' },
        { status: 400 }
      )
    }

    const db = createClient()

    // Verify tenant
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    // Validate and process students
    const results = {
      total: students.length,
      successful: 0,
      failed: 0,
      errors: [] as Array<{ row: number; email: string; error: string }>,
      created: [] as Array<{ email: string; tempPassword: string }>,
    }

    for (let i = 0; i < students.length; i++) {
      const student = students[i]

      // Validate required fields
      if (!student.name || !student.name.trim()) {
        results.failed++
        results.errors.push({
          row: i + 1,
          email: student.email || 'N/A',
          error: 'Name is required',
        })
        continue
      }

      if (!student.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
        results.failed++
        results.errors.push({
          row: i + 1,
          email: student.email || 'N/A',
          error: 'Invalid email address',
        })
        continue
      }

      try {
        // Check for existing user
        const existingUser = await db.user.findUnique({
          where: { email: student.email },
        })

        if (existingUser) {
          results.failed++
          results.errors.push({
            row: i + 1,
            email: student.email,
            error: 'Email already registered',
          })
          continue
        }

        // Generate temporary password
        const tempPassword = generateTempPassword()

        // Create user
        const user = await db.user.create({
          data: {
            name: student.name.trim(),
            email: student.email.toLowerCase().trim(),
            password: tempPassword, // In production, hash this
            mobileNumber: student.phone,
            role: 'STUDENT',
            isActive: true,
            isVerified: false,
          },
        })

        // Link user to tenant
        if (classId) {
          await db.tenantUser.create({
            data: {
              tenantId,
              userId: user.id,
              email: user.email,
              name: user.name,
              role: 'MEMBER',
              status: 'ACTIVE',
              joinedAt: new Date(),
            },
          })
        }

        results.successful++
        results.created.push({
          email: user.email,
          tempPassword,
        })
      } catch (error: any) {
        results.failed++
        results.errors.push({
          row: i + 1,
          email: student.email,
          error: error.message || 'Failed to create user',
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Successfully created ${results.successful} out of ${results.total} students`,
    })
  } catch (error) {
    console.error('Bulk upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process bulk upload' },
      { status: 500 }
    )
  }
}

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// Handle CSV file upload
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const tenantId = formData.get('tenantId') as string
    const classId = formData.get('classId') as string | undefined

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      )
    }

    // Read CSV file
    const text = await file.text()
    const lines = text.split('\n').filter((line) => line.trim())

    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file must have at least a header row and one data row' },
        { status: 400 }
      )
    }

    // Parse CSV header
    const header = lines[0].split(',').map((cell) => cell.trim().toLowerCase())
    const nameIndex = header.findIndex((h) => h === 'name' || h === 'student name')
    const emailIndex = header.findIndex((h) => h === 'email' || h === 'email address')
    const phoneIndex = header.findIndex((h) => h === 'phone' || h === 'mobile')
    const rollIndex = header.findIndex((h) => h === 'roll' || h === 'roll number' || h === 'roll_no')

    if (nameIndex === -1 || emailIndex === -1) {
      return NextResponse.json(
        { error: 'CSV must have "name" and "email" columns' },
        { status: 400 }
      )
    }

    // Parse student data
    const students = []
    for (let i = 1; i < lines.length; i++) {
      const cells = parseCSVLine(lines[i])
      if (cells.length <= Math.max(nameIndex, emailIndex)) continue

      students.push({
        name: cells[nameIndex]?.trim() || '',
        email: cells[emailIndex]?.trim() || '',
        phone: phoneIndex !== -1 ? cells[phoneIndex]?.trim() : undefined,
        rollNumber: rollIndex !== -1 ? cells[rollIndex]?.trim() : undefined,
      })
    }

    // Process bulk upload
    const db = createClient()

    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    const results = {
      total: students.length,
      successful: 0,
      failed: 0,
      errors: [] as Array<{ row: number; email: string; error: string }>,
      created: [] as Array<{ email: string; name: string; tempPassword: string }>,
    }

    for (let i = 0; i < students.length; i++) {
      const student = students[i]

      if (!student.name || !student.email) {
        results.failed++
        results.errors.push({
          row: i + 2, // +2 because of 0-index and header row
          email: student.email || 'N/A',
          error: 'Missing name or email',
        })
        continue
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
        results.failed++
        results.errors.push({
          row: i + 2,
          email: student.email,
          error: 'Invalid email format',
        })
        continue
      }

      try {
        const existingUser = await db.user.findUnique({
          where: { email: student.email },
        })

        if (existingUser) {
          results.failed++
          results.errors.push({
            row: i + 2,
            email: student.email,
            error: 'Email already exists',
          })
          continue
        }

        const tempPassword = generateTempPassword()
        const user = await db.user.create({
          data: {
            name: student.name,
            email: student.email.toLowerCase(),
            password: tempPassword,
            mobileNumber: student.phone,
            role: 'STUDENT',
            isActive: true,
            isVerified: false,
          },
        })

        if (classId) {
          await db.tenantUser.create({
            data: {
              tenantId,
              userId: user.id,
              email: user.email,
              name: user.name,
              role: 'MEMBER',
              status: 'ACTIVE',
              joinedAt: new Date(),
            },
          })
        }

        results.successful++
        results.created.push({
          email: user.email,
          name: user.name,
          tempPassword,
        })
      } catch (error: any) {
        results.failed++
        results.errors.push({
          row: i + 2,
          email: student.email,
          error: error.message || 'Creation failed',
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Processed ${results.total} students: ${results.successful} created, ${results.failed} failed`,
    })
  } catch (error) {
    console.error('CSV upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process CSV file' },
      { status: 500 }
    )
  }
}

function parseCSVLine(line: string): string[] {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}
