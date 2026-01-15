"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BookOpen, ArrowLeft, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface StudentCountValidation {
  valid: boolean
  tier: string
  message: string
  eligible: boolean
}

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    institutionName: '',
    studentCount: ''
  })
  const [validation, setValidation] = useState<StudentCountValidation | null>(null)
  const [showTierInfo, setShowTierInfo] = useState(false)

  const validateStudentCount = (count: string): StudentCountValidation => {
    const num = parseInt(count) || 0
    
    if (num >= 5000) {
      return {
        valid: true,
        tier: 'Enterprise',
        message: 'Eligible for Enterprise tier with dedicated support',
        eligible: true
      }
    }
    
    if (num >= 1500) {
      return {
        valid: true,
        tier: 'Scale',
        message: 'Eligible for Scale tier - Full white-label access',
        eligible: true
      }
    }
    
    if (num >= 500) {
      return {
        valid: true,
        tier: 'Growth',
        message: 'Eligible for Growth tier - Standard features',
        eligible: true
      }
    }
    
    return {
      valid: true,
      tier: 'Foundation',
      message: `Foundation tier - ${num > 0 ? 'Upgrade available at 500+ students' : 'Minimum 1,500 students for Scale tier features'}`,
      eligible: false
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'studentCount') {
      setValidation(validateStudentCount(value))
      setShowTierInfo(value.length > 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    // Validate student count
    const studentNum = parseInt(formData.studentCount) || 0
    if (studentNum < 1) {
      toast.error('Please enter your institution\'s student count')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          institutionName: formData.institutionName,
          studentCount: studentNum
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Account created successfully! Please sign in.')
        router.push('/auth/login')
      } else {
        toast.error(data.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getTierBadge = (tier: string) => {
    const badges: Record<string, { bg: string; text: string; icon: string }> = {
      Enterprise: { bg: 'bg-purple-100 border-purple-300', text: 'text-purple-800', icon: '👑' },
      Scale: { bg: 'bg-green-100 border-green-300', text: 'text-green-800', icon: '✓' },
      Growth: { bg: 'bg-blue-100 border-blue-300', text: 'text-blue-800', icon: '↑' },
      Foundation: { bg: 'bg-gray-100 border-gray-300', text: 'text-gray-800', icon: '•' },
    }
    return badges[tier] || badges.Foundation
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <ToastContainer position="top-center" />
      
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-orange-600 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-green-500 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Register your institution on INR99 Academy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institutionName">Institution Name</Label>
                <Input
                  id="institutionName"
                  name="institutionName"
                  type="text"
                  placeholder="Enter your institution name"
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              {/* Student Count Field */}
              <div className="space-y-2">
                <Label htmlFor="studentCount">
                  Total Student Count <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="studentCount"
                  name="studentCount"
                  type="number"
                  min="1"
                  placeholder="e.g., 2500"
                  value={formData.studentCount}
                  onChange={(e) => handleInputChange('studentCount', e.target.value)}
                  required
                  className="h-11"
                />
                <p className="text-xs text-gray-500">
                  This determines your tier and available features
                </p>
                
                {/* Tier Preview */}
                {showTierInfo && validation && (
                  <div className={`mt-2 p-3 rounded-lg border ${getTierBadge(validation.tier).bg}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTierBadge(validation.tier).icon}</span>
                      <div>
                        <p className={`text-sm font-medium ${getTierBadge(validation.tier).text}`}>
                          {validation.tier} Tier
                        </p>
                        <p className="text-xs text-gray-600">{validation.message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Password Requirements */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">Password requirements:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-3 w-3 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} />
                  <span>At least 8 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-3 w-3 ${formData.password === formData.confirmPassword && formData.confirmPassword ? 'text-green-500' : 'text-gray-400'}`} />
                  <span>Passwords match</span>
                </div>
              </div>
            </div>

            {/* Tier Information */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">Tier Information:</p>
                  <p>Institutions with 1,500+ students qualify for Scale tier with full white-label features. Smaller institutions start with Foundation tier and can upgrade as they grow.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/auth/login" className="font-semibold text-orange-600 hover:text-orange-700">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
