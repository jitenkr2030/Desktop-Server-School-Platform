"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPER_ADMIN'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  mobile?: string
  location?: string
  bio?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users - same as your old working version
const demoUsers: Record<string, { id: string; name: string; role: UserRole; password: string }> = {
  'student1@inr99.com': { id: 'student1', name: 'Demo Student 1', role: 'STUDENT', password: 'demo123' },
  'student2@inr99.com': { id: 'student2', name: 'Demo Student 2', role: 'STUDENT', password: 'demo123' },
  'student3@inr99.com': { id: 'student3', name: 'Demo Student 3', role: 'STUDENT', password: 'demo123' },
  'instructor1@inr99.com': { id: 'instructor1', name: 'Demo Instructor 1', role: 'INSTRUCTOR', password: 'demo123' },
  'instructor2@inr99.com': { id: 'instructor2', name: 'Demo Instructor 2', role: 'INSTRUCTOR', password: 'demo123' },
  'admin1@inr99.com': { id: 'admin1', name: 'Demo Admin 1', role: 'ADMIN', password: 'demo123' },
  'superadmin1@inr99.com': { id: 'superadmin1', name: 'Super Admin', role: 'SUPER_ADMIN', password: 'demo123' },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('inr99_user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('inr99_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const demoUser = demoUsers[email]
    
    if (!demoUser) {
      return { success: false, error: 'Invalid email or password' }
    }

    if (password !== demoUser.password) {
      return { success: false, error: 'Invalid email or password' }
    }

    const user: User = {
      id: demoUser.id,
      name: demoUser.name,
      email: email,
      role: demoUser.role,
    }

    setUser(user)
    localStorage.setItem('inr99_user', JSON.stringify(user))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('inr99_user')
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}