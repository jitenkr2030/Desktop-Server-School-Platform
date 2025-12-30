import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { z } from "zod"

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = userSchema.parse(body)

    // Check if user with email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { user: null, message: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash the password
    const hashedPassword = await hash(password, 12)

    // Create new user
    const newUser = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "STUDENT",
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      { user: userWithoutPassword, message: "User created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    
    if (error instanceof z.ZodError) {
      // Zod v5+ uses .issues instead of .errors
      const issues = (error as any).issues || error.errors || []
      const firstIssue = issues[0]
      const errorMessage = firstIssue?.message || 'Validation error'
      return NextResponse.json(
        { user: null, message: errorMessage },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { user: null, message: "Something went wrong during registration" },
      { status: 500 }
    )
  }
}
