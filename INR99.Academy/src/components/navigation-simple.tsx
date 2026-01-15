"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { BookOpen, Mail } from "lucide-react"
import Link from "next/link"

export function NavigationSimple() {
  const [mounted, setMounted] = useState(false)

  // Don't render anything that depends on session until mounted
  // This prevents SSR issues with useSession
  if (!mounted) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-orange-500 text-white p-2 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">INR99.Academy</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/courses" className="text-gray-600 hover:text-orange-500 transition-colors">
              Courses
            </Link>
            <Link href="/learning-paths" className="text-gray-600 hover:text-orange-500 transition-colors">
              Learning Paths
            </Link>
            <Link href="/community" className="text-gray-600 hover:text-orange-500 transition-colors">
              Community
            </Link>
            <Link href="/subscription" className="text-gray-600 hover:text-orange-500 transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-orange-500 transition-colors">
              About
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Mail className="h-4 w-4 mr-2" />
                Login / Signup
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
