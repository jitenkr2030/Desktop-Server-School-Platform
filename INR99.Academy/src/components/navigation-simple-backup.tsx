"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { BookOpen, Mail } from "lucide-react"
import Link from "next/link"
import { useSession } from 'next-auth/react'

export function NavigationSimple() {
  const [mounted, setMounted] = useState(false)
  
  // Safe session check with proper SSR handling
  const sessionResult = useSession()
  const session = sessionResult?.data
  const status = sessionResult?.status
  const user = session?.user

  // Handle mounting for client-side only features
  if (!mounted && typeof window !== 'undefined') {
    setMounted(true)
  }

  const isAuthenticated = mounted && status === 'authenticated' && user

  return (
    <>
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-orange-500 text-white p-2 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">INR99.Academy</span>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {user?.name || user?.email}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Simple logout - in real app would use signOut
                      window.location.href = '/'
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Mail className="h-4 w-4 mr-2" />
                    Login / Signup
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}