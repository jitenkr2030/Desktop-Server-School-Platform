import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const instructors = await prisma.instructor.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        bio: true,
        avatar: true,
        expertise: true,
        createdAt: true,
        _count: {
          select: { courses: true }
        }
      }
    })

    return NextResponse.json({ instructors })
  } catch (error) {
    console.error("Error fetching instructors:", error)
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, bio, avatar, expertise } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const instructor = await prisma.instructor.create({
      data: {
        name,
        bio: bio || null,
        avatar: avatar || null,
        expertise: expertise || null
      }
    })

    return NextResponse.json({ instructor })
  } catch (error) {
    console.error("Error creating instructor:", error)
    return NextResponse.json({ error: "Failed to create instructor" }, { status: 500 })
  }
}
