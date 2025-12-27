"use client"

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BandwidthToggle } from "@/components/bandwidth-toggle"
import { User, LogOut, Settings, BookOpen, CreditCard, Trophy, Award, MessageCircle, Shield, Mail } from "lucide-react"
import Link from "next/link"
import { CategoriesDropdown } from "@/components/categories-dropdown"

export function Navigation() {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render auth state until mounted to avoid hydration mismatch
  const isLoading = status === 'loading'
  const isAuthenticated = mounted && status === 'authenticated'
  const user = session?.user

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

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

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <CategoriesDropdown />
              <Link href="/courses" className="text-gray-600 hover:text-orange-500 transition-colors">
                Courses
              </Link>
              <Link href="/learning-paths" className="text-gray-600 hover:text-orange-500 transition-colors">
                Learning Paths
              </Link>
              <Link href="/instructors" className="text-gray-600 hover:text-orange-500 transition-colors">
                Instructors
              </Link>
              <Link href="/community" className="text-gray-600 hover:text-orange-500 transition-colors">
                Community
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-orange-500 transition-colors">
                Blog
              </Link>
              <Link href="/subscription" className="text-gray-600 hover:text-orange-500 transition-colors">
                Pricing
              </Link>
              <div className="relative group">
                <button className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-1">
                  More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                    About Us
                  </Link>
                  <Link href="/faq" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                    FAQ
                  </Link>
                  <Link href="/careers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                    Careers
                  </Link>
                  <Link href="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                    Contact
                  </Link>
                  <Link href="/terms" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Bandwidth Toggle */}
              <BandwidthToggle />
              
              {/* Auth Section */}
              {!isLoading && isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                        <AvatarFallback>
                          {user.name 
                            ? user.name.charAt(0).toUpperCase() 
                            : 'U'
                          }
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>My Learning</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/learning-ledger">
                        <Trophy className="mr-2 h-4 w-4" />
                        <span>Learning Ledger</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/certificates">
                        <Award className="mr-2 h-4 w-4" />
                        <span>Certificates</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/community">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        <span>Community</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/subscription">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Subscription</span>
                      </Link>
                    </DropdownMenuItem>
                    {(user as any).id === 'admin' || (user as any).id === 'admin1' || (user as any).role === 'ADMIN' || (user as any).role === 'SUPER_ADMIN' || (user as any).role === 'INSTRUCTOR' || (user as any).id === 'instructor1' || (user as any).id === 'instructor2' ? (
                      <>
                        <DropdownMenuSeparator />
                        {(user as any).role === 'INSTRUCTOR' || (user as any).id === 'instructor1' || (user as any).id === 'instructor2' ? (
                          <DropdownMenuItem asChild>
                            <Link href="/instructor">
                              <BookOpen className="mr-2 h-4 w-4" />
                              <span>Instructor Dashboard</span>
                            </Link>
                          </DropdownMenuItem>
                        ) : null}
                        {(user as any).id === 'admin' || (user as any).id === 'admin1' || (user as any).role === 'ADMIN' || (user as any).role === 'SUPER_ADMIN' ? (
                          <DropdownMenuItem asChild>
                            <Link href="/admin">
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Admin Dashboard</span>
                            </Link>
                          </DropdownMenuItem>
                        ) : null}
                      </>
                    ) : null}
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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