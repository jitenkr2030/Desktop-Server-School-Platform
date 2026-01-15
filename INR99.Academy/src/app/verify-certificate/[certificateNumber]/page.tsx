"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, CheckCircle, Share, Download, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CertificateData {
  id: string
  certificateNumber: string
  issuedAt: string
  verified: boolean
  verificationUrl: string
  course: {
    title: string
    description: string
    difficulty: string
    instructor: {
      name: string
    }
  }
  user: {
    name: string
    email: string
  }
}

export default function CertificateVerificationPage() {
  const params = useParams()
  const certificateNumber = params.certificateNumber as string
  const [certificate, setCertificate] = useState<CertificateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (certificateNumber) {
      verifyCertificate()
    }
  }, [certificateNumber])

  const verifyCertificate = async () => {
    try {
      const response = await fetch(`/api/certificates/verify/${certificateNumber}`)
      
      if (response.ok) {
        const data = await response.json()
        setCertificate(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Certificate not found')
      }
    } catch (error) {
      setError('Failed to verify certificate')
    } finally {
      setLoading(false)
    }
  }

  const shareCertificate = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Certificate Verification',
          text: `Verify ${certificate?.user.name}'s certificate for ${certificate?.course.title}`,
          url: window.location.href
        })
      } catch (error) {
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied",
      description: "Certificate verification link copied to clipboard"
    })
  }

  const downloadCertificate = () => {
    if (certificate) {
      const certificateData = {
        certificateNumber: certificate.certificateNumber,
        studentName: certificate.user.name,
        courseName: certificate.course.title,
        issueDate: new Date(certificate.issuedAt).toLocaleDateString(),
        verificationUrl: certificate.verificationUrl
      }

      const blob = new Blob([JSON.stringify(certificateData, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificate-${certificate.certificateNumber}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Certificate Downloaded",
        description: "Certificate data has been downloaded successfully"
      })
    }
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    )
  }

  if (error || !certificate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Certificate Not Found</h1>
          <p className="text-gray-600 mb-6">
            The certificate you're looking for could not be found or may be invalid.
          </p>
          <Button
            onClick={() => window.location.href = '/verify-certificate'}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Try Another Certificate
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-2">
            <Award className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">Certificate Verification</h1>
          </div>
          <p className="text-lg text-gray-600">
            This certificate has been verified and is authentic
          </p>
        </div>

        {/* Certificate Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Certificate Card */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-green-700 font-medium">Verified Certificate</span>
                </div>
                <CardTitle className="text-2xl text-green-900">
                  Certificate of Completion
                </CardTitle>
                <CardDescription className="text-green-700">
                  This certifies that the student has successfully completed the course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Course Information */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {certificate.course.title}
                  </h3>
                  <p className="text-gray-600">{certificate.course.description}</p>
                  <Badge className={getDifficultyColor(certificate.course.difficulty)}>
                    {certificate.course.difficulty}
                  </Badge>
                </div>

                {/* Student Information */}
                <div className="border-t border-green-200 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-500">Student Name</label>
                        <p className="font-medium text-gray-900">{certificate.user.name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Student Email</label>
                        <p className="font-medium text-gray-900">{certificate.user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-500">Instructor</label>
                        <p className="font-medium text-gray-900">{certificate.course.instructor.name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Issue Date</label>
                        <p className="font-medium text-gray-900">
                          {new Date(certificate.issuedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certificate Number */}
                <div className="border-t border-green-200 pt-6">
                  <div className="text-center">
                    <label className="text-sm text-gray-500">Certificate Number</label>
                    <p className="font-mono text-sm text-gray-900 bg-gray-100 p-2 rounded">
                      {certificate.certificateNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Certificate Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={shareCertificate}
                  className="w-full"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share Certificate
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadCertificate}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(certificate.verificationUrl, '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Verification Page
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Verification Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-700 font-medium">Verified</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Verified On</span>
                  <span className="text-sm text-gray-900">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Platform</span>
                  <span className="text-sm text-gray-900">INR99.Academy</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>This certificate is digitally verified and can be authenticated at any time.</p>
          <p>For verification inquiries, please contact support@inr99.academy</p>
        </div>
      </div>
    </div>
  )
}