"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/DashboardLayout'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, Share, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Certificate {
  id: string
  certificateNumber: string
  issuedAt: string
  verified: boolean
  verificationUrl: string
  course: {
    id: string
    title: string
    description: string
    difficulty: string
    thumbnail?: string
    instructor: {
      name: string
    }
  }
}

export default function StudentCertificates() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<string | null>(null)

  useEffect(() => {
    fetchCertificates()
  }, [session])

  const fetchCertificates = async () => {
    if (!session?.user) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/certificates')
      const data = await response.json()

      if (data.success) {
        setCertificates(data.certificates || [])
      }
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCertificate = async (courseId: string) => {
    setGenerating(courseId)
    try {
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      })

      const data = await response.json()

      if (data.success) {
        fetchCertificates()
      } else {
        alert(data.error || 'Failed to generate certificate')
      }
    } catch (error) {
      console.error('Error generating certificate:', error)
      alert('Failed to generate certificate')
    } finally {
      setGenerating(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const userName = session?.user?.name || 'Guest'
  const userEmail = session?.user?.email || 'guest@example.com'

  if (loading) {
    return (
      <DashboardLayout userRole="student" userInfo={{ name: userName, email: userEmail }}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="student" userInfo={{ name: userName, email: userEmail }}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🎓 My Certificates
        </h1>

        {/* Certificate Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {certificates.length}
              </div>
              <div className="text-gray-600">
                Certificates Earned
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {certificates.filter(c => c.verified).length}
              </div>
              <div className="text-gray-600">
                Verified Certificates
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {certificates.filter(c => c.verified).length > 0 ? '100%' : '0%'}
              </div>
              <div className="text-gray-600">
                Verification Rate
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates List */}
        {certificates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">📜</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No certificates yet
              </h3>
              <p className="text-gray-600 mb-6">
                Complete your courses to earn certificates and showcase your achievements.
              </p>
              <Link href="/courses">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Browse Courses
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {certificates.map((cert) => (
              <Card key={cert.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Certificate Icon/Preview */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-4xl shadow-lg">
                        🏆
                      </div>
                    </div>

                    {/* Certificate Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            Certificate of Completion
                          </h3>
                          <p className="text-gray-600">{cert.course.title}</p>
                        </div>
                        <Badge className={cert.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {cert.verified ? '✓ Verified' : 'Pending Verification'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Course:</span>
                          <span className="font-medium">{cert.course.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Instructor:</span>
                          <span className="font-medium">{cert.course.instructor.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Date:</span>
                          <span className="font-medium">{formatDate(cert.issuedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Certificate ID:</span>
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {cert.certificateNumber}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Link href={`/verify-certificate/${cert.certificateNumber}`}>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Verify Online
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        <Card className="mt-8 bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-orange-900 mb-2">
              How to earn certificates
            </h3>
            <ul className="text-sm text-orange-800 space-y-2">
              <li>✓ Complete all lessons in a course</li>
              <li>✓ Pass all assessments with a score of 70% or higher</li>
              <li>✓ Click "Generate Certificate" after completing a course</li>
              <li>✓ Your certificate will be verified and available for download</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
