"use client"

import { useState, useRef } from 'react'
import { NewNavigation } from "@/components/new-navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, Upload, X, FileText } from "lucide-react"

interface FormData {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  firstName?: string[]
  lastName?: string[]
  email?: string[]
  subject?: string[]
  message?: string[]
  file?: string[]
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const subjects = [
    'General Inquiry',
    'Course Support',
    'Payment Issue',
    'Technical Problem',
    'Partnership Opportunity',
    'Instructor Application',
    'Feedback & Suggestions',
    'Other',
  ]

  // Allowed file types for upload
  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg',
  ]

  const maxFileSize = 10 * 1024 * 1024 // 10MB

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    if (formData.firstName.trim().length < 2) {
      newErrors.firstName = ['First name must be at least 2 characters']
      isValid = false
    }

    if (formData.lastName.trim().length < 2) {
      newErrors.lastName = ['Last name must be at least 2 characters']
      isValid = false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = ['Please enter a valid email address']
      isValid = false
    }

    if (formData.subject.trim().length < 5) {
      newErrors.subject = ['Please select or enter a subject']
      isValid = false
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = ['Message must be at least 10 characters']
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const validateFile = (file: File): string | null => {
    if (!allowedFileTypes.includes(file.type)) {
      return 'Invalid file type. Please upload PDF, DOC, DOCX, JPEG, or PNG files.'
    }
    if (file.size > maxFileSize) {
      return 'File size exceeds 10MB limit. Please choose a smaller file.'
    }
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileError(null)

    if (file) {
      const error = validateFile(file)
      if (error) {
        setFileError(error)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }
      setUploadedFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setFileError(null)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      const error = validateFile(file)
      if (error) {
        setFileError(error)
        return
      }
      setUploadedFile(file)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setFileError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('idle')
    setErrorMessage('')

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('firstName', formData.firstName)
      formDataToSend.append('lastName', formData.lastName)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('subject', formData.subject)
      formDataToSend.append('message', formData.message)
      
      if (uploadedFile) {
        formDataToSend.append('file', uploadedFile)
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formDataToSend,
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus('success')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: '',
        })
        setUploadedFile(null)
        setFileError(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setSubmitStatus('error')
        setErrorMessage(data.message || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Something went wrong. Please try again later.')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            {/* Success Message */}
            {submitStatus === 'success' && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Thank you for your message!</strong>
                  <p className="mt-1">We've received your inquiry and will get back to you within 24-48 hours.</p>
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Something went wrong</strong>
                  <p className="mt-1">{errorMessage}</p>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                      errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="John"
                    disabled={isSubmitting}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName[0]}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                      errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                    disabled={isSubmitting}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName[0]}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                )}
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject[0]}</p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea 
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none ${
                    errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="How can we help you?"
                  disabled={isSubmitting}
                />
                <div className="flex justify-between mt-1">
                  {errors.message ? (
                    <p className="text-sm text-red-600">{errors.message[0]}</p>
                  ) : (
                    <span></span>
                  )}
                  <span className={`text-sm ${formData.message.length > 2000 ? 'text-red-600' : 'text-gray-500'}`}>
                    {formData.message.length}/2000
                  </span>
                </div>
              </div>

              {/* File Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach Document (Optional)
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Upload your resume, CV, or other documents (PDF, DOC, DOCX, JPEG, PNG - Max 10MB)
                </p>
                
                {/* File Upload Area */}
                {!uploadedFile ? (
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      fileError 
                        ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                        : 'border-gray-300 hover:border-orange-500 hover:bg-orange-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <div className="flex flex-col items-center">
                      <Upload className={`h-12 w-12 mb-4 ${fileError ? 'text-red-400' : 'text-gray-400'}`} />
                      <p className="text-gray-600 font-medium mb-1">
                        Drag and drop your file here, or click to browse
                      </p>
                      <p className="text-gray-400 text-sm">
                        Supports: PDF, DOC, DOCX, JPEG, PNG (Max 10MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  // Uploaded File Display
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-xs">
                            {uploadedFile.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(uploadedFile.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        disabled={isSubmitting}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* File Error Message */}
                {fileError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {fileError}
                  </p>
                )}
              </div>

              <Button 
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">support@inr.academy</p>
                    <p className="text-gray-500 text-sm">We reply within 24-48 hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">WhatsApp Only</h3>
                    <p className="text-gray-600">+91 8700189551</p>
                    <p className="text-gray-500 text-sm">Mon - Sat, 9 AM - 6 PM</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💬</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">WhatsApp Chat</h3>
                    <p className="text-gray-600">Available 24/7</p>
                    <p className="text-gray-500 text-sm">Quick answers to common questions</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">
                      INR99 Academy<br />
                      Street No-2  Main<br />
                      Sagar Pur, New Delhi - 110046<br />
                      New Delhi, India
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors">
                    <span>📘</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors">
                    <span>🐦</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors">
                    <span>📸</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors">
                    <span>💼</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">INR99.Academy</h2>
          <p className="text-lg opacity-90">
            Empowering learners worldwide with affordable, high-quality education.
          </p>
          <p className="mt-4 text-sm opacity-75">
            © 2026 INR99 Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
