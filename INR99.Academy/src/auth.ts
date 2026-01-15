import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import { compare } from "bcryptjs"

// User roles for RBAC
export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPER_ADMIN'

// Demo user accounts - no database dependency
const demoUsers: Record<string, { id: string; name: string; role: UserRole; password: string }> = {
  'student1@inr99.com': { id: 'student1', name: 'Demo Student 1', role: 'STUDENT', password: 'demo123' },
  'student2@inr99.com': { id: 'student2', name: 'Demo Student 2', role: 'STUDENT', password: 'demo123' },
  'student3@inr99.com': { id: 'student3', name: 'Demo Student 3', role: 'STUDENT', password: 'demo123' },
  'instructor1@inr99.com': { id: 'instructor1', name: 'Demo Instructor 1', role: 'INSTRUCTOR', password: 'demo123' },
  'instructor2@inr99.com': { id: 'instructor2', name: 'Demo Instructor 2', role: 'INSTRUCTOR', password: 'demo123' },
  'admin1@inr99.com': { id: 'admin1', name: 'Demo Admin 1', role: 'ADMIN', password: 'demo123' },
  'superadmin1@inr99.com': { id: 'superadmin1', name: 'Super Admin', role: 'SUPER_ADMIN', password: 'demo123' },
}

// Rate limiting configuration
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Use JWT strategy
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Base path for API routes
  basePath: "/api/auth",

  // Configure providers
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email", 
          placeholder: "your@email.com" 
        },
        password: { 
          label: "Password", 
          type: "password" 
        },
      },
      async authorize(credentials, request) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter both email and password")
          }

          const email = credentials.email as string
          const password = credentials.password as string

          // Get client IP for rate limiting
          const forwardedFor = request.headers.get("x-forwarded-for")
          const ip = forwardedFor?.split(",")[0].trim() || "127.0.0.1"
          
          // Check rate limit
          const now = Date.now()
          const record = rateLimitMap.get(ip)
          
          if (record && now < record.resetAt && record.count >= 5) {
            throw new Error("Too many login attempts. Please try again later.")
          }
          
          if (record && now < record.resetAt) {
            record.count++
          } else {
            rateLimitMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
          }

          // First check if it's a demo user
          const demoUser = demoUsers[email]
          if (demoUser) {
            if (password !== demoUser.password) {
              throw new Error("Invalid email or password")
            }
            // Return demo user object
            return {
              id: demoUser.id,
              name: demoUser.name,
              email: email,
              role: demoUser.role,
            }
          }

          // If not a demo user, check database for real registered users
          const dbUser = await db.user.findUnique({
            where: { email },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              role: true,
              isActive: true,
            }
          })

          if (!dbUser) {
            throw new Error("Invalid email or password")
          }

          if (!dbUser.isActive) {
            throw new Error("Account is disabled. Please contact support.")
          }

          // Verify password
          const isValidPassword = await compare(password, dbUser.password)
          if (!isValidPassword) {
            throw new Error("Invalid email or password")
          }

          // Return user object (excluding password)
          return {
            id: dbUser.id,
            name: dbUser.name || email.split('@')[0],
            email: dbUser.email,
            role: dbUser.role as UserRole,
          }

        } catch (error: any) {
          console.error("Auth error:", error)
          throw error
        }
      },
    }),
  ],

  // Callbacks
  callbacks: {
    // JWT callback
    async jwt({ token, user, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    
    // Session callback
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as UserRole
      }
      return session
    },

    // Authorized callback for middleware
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isOnLogin = nextUrl.pathname === "/auth/login"
      
      // If on login page and logged in, redirect to dashboard
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      
      if (isOnDashboard || isOnAdmin) {
        if (isLoggedIn) return true
        return false // Redirect to login
      }
      
      return true
    },
  },

  // Pages
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  // Trust host
  trustHost: true,
  debug: true, // Enable debug mode for troubleshooting
})

// Export authOptions for server-side usage
export const authOptions = {
  // Use JWT strategy
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Base path for API routes
  basePath: "/api/auth",

  // Configure providers
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email", 
          placeholder: "your@email.com" 
        },
        password: { 
          label: "Password", 
          type: "password" 
        },
      },
      async authorize(credentials, request) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter both email and password")
          }

          const email = credentials.email as string
          const password = credentials.password as string

          // Get client IP for rate limiting
          const forwardedFor = request.headers.get("x-forwarded-for")
          const ip = forwardedFor?.split(",")[0].trim() || "127.0.0.1"
          
          // Check rate limit
          const now = Date.now()
          const record = rateLimitMap.get(ip)
          
          if (record && now < record.resetAt && record.count >= 5) {
            throw new Error("Too many login attempts. Please try again later.")
          }
          
          if (record && now < record.resetAt) {
            record.count++
          } else {
            rateLimitMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
          }

          // First check if it's a demo user
          const demoUser = demoUsers[email]
          if (demoUser) {
            if (password !== demoUser.password) {
              throw new Error("Invalid email or password")
            }
            // Return demo user object
            return {
              id: demoUser.id,
              name: demoUser.name,
              email: email,
              role: demoUser.role,
            }
          }

          // If not a demo user, check database for real registered users
          const dbUser = await db.user.findUnique({
            where: { email },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              role: true,
              isActive: true,
            }
          })

          if (!dbUser) {
            throw new Error("Invalid email or password")
          }

          if (!dbUser.isActive) {
            throw new Error("Account is disabled. Please contact support.")
          }

          // Verify password
          const isValidPassword = await compare(password, dbUser.password)
          if (!isValidPassword) {
            throw new Error("Invalid email or password")
          }

          // Return user object (excluding password)
          return {
            id: dbUser.id,
            name: dbUser.name || email.split('@')[0],
            email: dbUser.email,
            role: dbUser.role as UserRole,
          }

        } catch (error: any) {
          console.error("Auth error:", error)
          throw error
        }
      },
    }),
  ],

  // Callbacks
  callbacks: {
    // JWT callback
    async jwt({ token, user, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    
    // Session callback
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as UserRole
      }
      return session
    },

    // Authorized callback for middleware
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isOnLogin = nextUrl.pathname === "/auth/login"
      
      // If on login page and logged in, redirect to dashboard
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      
      if (isOnDashboard || isOnAdmin) {
        if (isLoggedIn) return true
        return false // Redirect to login
      }
      
      return true
    },
  },

  // Pages
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  // Trust host
  trustHost: true,
  debug: true, // Enable debug mode for troubleshooting
}