'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Eligibility threshold constant
const ELIGIBILITY_THRESHOLD = 1500

export default function InstitutionSignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null)
  const [checkingSubdomain, setCheckingSubdomain] = useState(false)
  const [eligible, setEligible] = useState<boolean | null>(null)

  const [formData, setFormData] = useState({
    institutionName: '',
    institutionType: 'school',
    email: '',
    phone: '',
    adminName: '',
    adminPassword: '',
    confirmPassword: '',
    subdomain: '',
    studentCount: '',
  })

  // Check subdomain availability
  useEffect(() => {
    if (formData.subdomain.length >= 3) {
      checkSubdomain()
    } else {
      setSubdomainAvailable(null)
    }
  }, [formData.subdomain])

  // Check eligibility based on student count
  useEffect(() => {
    const count = parseInt(formData.studentCount)
    if (formData.studentCount && !isNaN(count) && count > 0) {
      setEligible(count >= ELIGIBILITY_THRESHOLD)
    } else {
      setEligible(null)
    }
  }, [formData.studentCount])

  const checkSubdomain = async () => {
    setCheckingSubdomain(true)
    setSubdomainAvailable(null)

    try {
      const response = await fetch(`/api/subdomains/check?name=${formData.subdomain}`)
      const data = await response.json()

      if (response.ok) {
        setSubdomainAvailable(data.available)
      } else {
        setSubdomainAvailable(false)
      }
    } catch (err) {
      setSubdomainAvailable(false)
    } finally {
      setCheckingSubdomain(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Auto-convert subdomain to lowercase
    if (name === 'subdomain') {
      setFormData((prev) => ({
        ...prev,
        subdomain: value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      }))
    }
  }

  const validateStep1 = () => {
    if (!formData.institutionName || formData.institutionName.length < 3) {
      return 'Institution name must be at least 3 characters'
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address'
    }
    if (!formData.phone || formData.phone.length < 10) {
      return 'Please enter a valid phone number'
    }
    // Validate student count
    const studentCount = parseInt(formData.studentCount)
    if (!formData.studentCount || isNaN(studentCount) || studentCount < 10) {
      return 'Please enter a valid number of students (minimum 10)'
    }
    return null
  }

  const validateStep2 = () => {
    if (!formData.subdomain || formData.subdomain.length < 3) {
      return 'Subdomain must be at least 3 characters'
    }
    if (subdomainAvailable !== true) {
      return 'Please choose an available subdomain'
    }
    return null
  }

  const validateStep3 = () => {
    if (!formData.adminName || formData.adminName.length < 2) {
      return 'Admin name must be at least 2 characters'
    }
    if (!formData.adminPassword || formData.adminPassword.length < 8) {
      return 'Password must be at least 8 characters'
    }
    if (formData.adminPassword !== formData.confirmPassword) {
      return 'Passwords do not match'
    }
    return null
  }

  const handleNext = () => {
    let error = null

    if (step === 1) {
      error = validateStep1()
    } else if (step === 2) {
      error = validateStep2()
    }

    if (error) {
      setError(error)
      return
    }

    setError('')
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const error = validateStep3()
    if (error) {
      setError(error)
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/tenants/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institutionName: formData.institutionName,
          email: formData.email,
          phone: formData.phone,
          subdomain: formData.subdomain,
          adminName: formData.adminName,
          adminPassword: formData.adminPassword,
          studentCount: parseInt(formData.studentCount),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Redirect to success page or login
      router.push(
        `/auth/login?registered=true&email=${encodeURIComponent(formData.email)}`
      )
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900">INR99 Academy</h1>
          </Link>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            Create Your Institution Platform
          </h2>
          <p className="mt-2 text-gray-600">
            Get a fully branded learning platform for your school or college - <span className="font-semibold text-green-600">100% FREE</span>
          </p>
        </div>

        {/* Schools/Colleges Statement */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 mb-8">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-green-800">🏫 Schools / Colleges</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Pay NOTHING</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Get full platform access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Get ready-made content</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Get live sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Get course builder</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Get branding/subdomain</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Get student dashboards</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700 font-semibold">Zero financial burden</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['Institution Details', 'Subdomain', 'Admin Account'].map((label, index) => (
              <div key={label} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step > index + 1
                      ? 'bg-green-500 text-white'
                      : step === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > index + 1 ? '✓' : index + 1}
                </div>
                <span className="mt-2 text-sm text-gray-600 hidden sm:block">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 relative">
            <div className="absolute top-0 left-5 right-5 h-1 bg-gray-200 -z-10"></div>
            <div
              className="absolute top-0 left-5 h-1 bg-blue-600 -z-10 transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          {/* Step 1: Institution Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Name *
                </label>
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Delhi Public School"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Type *
                </label>
                <select
                  name="institutionType"
                  value={formData.institutionType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="school">School</option>
                  <option value="college">College</option>
                  <option value="university">University</option>
                  <option value="coaching">Coaching Institute</option>
                  <option value="corporate">Corporate Training</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Students *
                </label>
                <input
                  type="number"
                  name="studentCount"
                  value={formData.studentCount}
                  onChange={handleChange}
                  min="10"
                  max="100000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 2000"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter the total number of students enrolled in your institution
                </p>
                
                {/* Eligibility Indicator */}
                {formData.studentCount && (
                  <div className="mt-3 flex items-center p-3 rounded-lg">
                    {eligible === true ? (
                      <div className="flex items-center text-green-700 bg-green-50 w-full p-3 rounded-lg">
                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">
                          ✓ Your institution qualifies for free white-label access!
                        </span>
                      </div>
                    ) : eligible === false ? (
                      <div className="flex items-center text-amber-700 bg-amber-50 w-full p-3 rounded-lg">
                        <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="font-medium">
                          Institutions with 1500+ students qualify for free white-label access
                        </span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="admin@institution.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
          )}

          {/* Step 2: Subdomain */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Choose Your Subdomain
                </h3>
                <p className="text-gray-600">
                  Your institution will be accessible at:
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subdomain *
                </label>
                <div className="flex rounded-lg shadow-sm">
                  <input
                    type="text"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleChange}
                    maxLength={63}
                    className="flex-1 px-4 py-3 border border-r-0 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="yourschool"
                  />
                  <span className="inline-flex items-center px-4 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-lg">
                    .inr99.academy
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Use lowercase letters, numbers, and hyphens only
                </p>

                {/* Subdomain Status */}
                {formData.subdomain.length >= 3 && (
                  <div className="mt-3 flex items-center">
                    {checkingSubdomain ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-blue-600 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span className="text-gray-600">Checking availability...</span>
                      </>
                    ) : subdomainAvailable === true ? (
                      <>
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-green-600">
                          {formData.subdomain}.inr99.academy is available!
                        </span>
                      </>
                    ) : subdomainAvailable === false ? (
                      <>
                        <svg
                          className="h-5 w-5 text-red-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <span className="text-red-600">
                          This subdomain is not available
                        </span>
                      </>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Your platform will look like:</p>
                <div className="inline-flex items-center bg-white border rounded-lg px-4 py-2">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">I</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formData.subdomain || 'yourschool'}.inr99.academy
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Admin Account */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Create Admin Account
                </h3>
                <p className="text-gray-600">
                  This account will manage your institution
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Name *
                </label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your password"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                    🏫 School Plan - Completely FREE
                  </span>
                </div>
                <h4 className="font-medium text-green-900 mb-2">
                  What your institution gets (at ZERO cost):
                </h4>
                <ul className="text-sm text-green-800 space-y-2">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Custom branded platform</strong> with your logo, colors, and subdomain</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Full platform access</strong> - All courses, live sessions, and assessments</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Ready-made content</strong> - 1-12, college courses, competitive exam prep</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Live learning sessions</strong> with expert instructors</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Course builder tools</strong> - Create your own courses and content</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Student & parent dashboards</strong> - Track progress and engagement</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Zero financial burden</strong> - Your institution pays NOTHING</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-sm font-medium text-green-900">
                    💡 <strong>How it works:</strong> Students pay ₹99/month <em>directly to INR99 Academy</em>. 
                    Your school simply facilitates access for them.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating Free Account...
                  </>
                ) : (
                  'Create Free Account'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
