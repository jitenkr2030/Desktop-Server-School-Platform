'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Star, 
  CheckCircle,
  ArrowRight,
  IndianRupee
} from 'lucide-react'

export const HeroSection: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState<{
    learningPaths: number
  } | null>(null)

  useEffect(() => {
    setMounted(true)
    fetchStats()
  }, [])

  // Don't render until mounted to prevent SSR issues
  if (!mounted) {
    return (
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300"></div>
          </div>
        </div>
      </div>
    )
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()

      if (data.success) {
        setStats({
          learningPaths: data.stats.learningPaths
        })
      }
    } catch (error) {
      console.error('Fetch stats error:', error)
      // Set fallback stats to prevent undefined errors
      setStats({
        learningPaths: 14 // fallback value
      })
    }
  }

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-yellow-300/20 text-yellow-300 border-yellow-300/30">
                  🚀 Learning Utility Model
                </Badge>
                <Badge variant="secondary" className="bg-green-300/20 text-green-300 border-green-300/30">
                  🎥 New: Live Learning
                </Badge>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                From Class 1 to Career — 
                <span className="text-yellow-300 block"> Learning for Every Indian</span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                A learning utility, just like UPI — for every Indian student
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                <span className="text-lg">Concept clarity, not exam coaching</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                <span className="text-lg">Foundation strengthening for long-term success</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                <span className="text-lg">School + College + Skills in one platform</span>
              </div>
            </div>

            {/* Pricing Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="h-6 w-6 text-yellow-300" />
                      <span className="text-3xl font-bold">99</span>
                      <span className="text-blue-100">/month</span>
                    </div>
                    <p className="text-sm text-blue-200 mt-1">Everything included</p>
                  </div>
                  <Badge className="bg-yellow-300 text-blue-900 border-yellow-300">
                    BEST VALUE
                  </Badge>
                </div>
                <Link href="/auth/login">
                  <Button size="lg" className="w-full bg-yellow-300 text-blue-900 hover:bg-yellow-400">
                    Start Learning Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">1-12</div>
                <div className="text-sm text-blue-100">School Classes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">
                  {stats ? `${stats.learningPaths}+` : '14+'}
                </div>
                <div className="text-sm text-blue-100">Learning Paths</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">₹99</div>
                <div className="text-sm text-blue-100">Monthly</div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Elements */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <BookOpen className="h-8 w-8 text-yellow-300 mb-3" />
                <h3 className="font-semibold mb-2">School Learning</h3>
                <p className="text-sm text-blue-100">Class 1-12 with all boards</p>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <GraduationCap className="h-8 w-8 text-yellow-300 mb-3" />
                <h3 className="font-semibold mb-2">College Foundation</h3>
                <p className="text-sm text-blue-100">UG degrees and subjects</p>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <Users className="h-8 w-8 text-yellow-300 mb-3" />
                <h3 className="font-semibold mb-2">Career Skills</h3>
                <p className="text-sm text-blue-100">Professional development</p>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <Star className="h-8 w-8 text-yellow-300 mb-3" />
                <h3 className="font-semibold mb-2">Money & Business</h3>
                <p className="text-sm text-blue-100">Financial literacy</p>
              </Card>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-yellow-300 text-blue-900 px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
              Trusted by 50,000+ Students
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}