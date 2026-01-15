"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Award, Search, CheckCircle, XCircle, ExternalLink } from "lucide-react"
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

export default function VerifyCertificatePage() {
  const [certificateNumber, setCertificateNumber] = useState('')
  const [certificate, setCertificate] = useState<CertificateData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleVerify = async () => {
    if (!certificateNumber.trim()) {
      setError('Please enter a certificate number')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/certificates/verify/${certificateNumber.trim()}`)
      
      if (response.ok) {
        const data = await response.json()
        setCertificate(data)
        toast({
          title: "Certificate Verified",
          description: "Certificate found and verified successfully"
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Certificate not found')
        setCertificate(null)
      }
    } catch (error) {
      setError('Failed to verify certificate')
      setCertificate(null)
      toast({
        title: "Error",
        description: "Failed to verify certificate",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-2">
            <Award className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">Verify Certificate</h1>
          </div>
          <p className="text-lg text-gray-600">
            Enter the certificate number to verify its authenticity
          </p>
        </div>

        {/* Verification Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Certificate Verification</CardTitle>
            <CardDescription>
              Enter the certificate number to verify its authenticity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter certificate number (e.g., INR99-...)"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={handleVerify}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Certificate Result */}
        {certificate && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge className={getDifficultyColor(certificate.course.difficulty)}>
                  {certificate.course.difficulty}
                </Badge>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700 font-medium">
                    Verified Certificate
                  </span>
                </div>
              </div>
              <CardTitle className="text-xl text-green-900">
                {certificate.course.title}
              </CardTitle>
              <CardDescription className="text-green-700">
                {certificate.course.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500">Student Name:</span>
                    <div className="font-medium">{certificate.user.name}</div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Student Email:</span>
                    <div className="font-medium">{certificate.user.email}</div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Instructor:</span>
                    <div className="font-medium">{certificate.course.instructor.name}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500">Certificate Number:</span>
                    <div className="font-mono text-xs">{certificate.certificateNumber}</div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Issue Date:</span>
                    <div className="font-medium">
                      {new Date(certificate.issuedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Status:</span>
                    <div className="font-medium text-green-700">Verified</div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-green-200">
                <Button
                  variant="outline"
                  onClick={() => window.open(certificate.verificationUrl, '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Verification Page
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Verify a Certificate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</div>
              <div>
                <p className="font-medium">Locate the Certificate Number</p>
                <p className="text-sm text-gray-600">Find the unique certificate number on the certificate document</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</div>
              <div>
                <p className="font-medium">Enter the Number</p>
                <p className="text-sm text-gray-600">Type the certificate number in the verification field above</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</div>
              <div>
                <p className="font-medium">Verify Authenticity</p>
                <p className="text-sm text-gray-600">Click verify to confirm the certificate's authenticity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}