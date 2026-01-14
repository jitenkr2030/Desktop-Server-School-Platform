'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

const steps: OnboardingStep[] = [
  {
    id: 'explore',
    title: 'Explore Courses',
    description: 'Browse through our extensive library of courses designed for your learning needs',
    icon: '📚',
    color: 'bg-blue-500',
  },
  {
    id: 'learn',
    title: 'Learn at Your Pace',
    description: 'Access video lessons, quizzes, and materials anytime, anywhere',
    icon: '🎬',
    color: 'bg-green-500',
  },
  {
    id: 'track',
    title: 'Track Progress',
    description: 'Monitor your learning journey with detailed progress tracking',
    icon: '📊',
    color: 'bg-purple-500',
  },
  {
    id: 'certificate',
    title: 'Earn Certificates',
    description: 'Complete courses and earn certificates to showcase your achievements',
    icon: '🎓',
    color: 'bg-yellow-500',
  },
]

export default function WelcomeOnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [preferences, setPreferences] = useState({
    role: '',
    interests: [] as string[],
    goal: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      // In production, check auth context
      setIsLoggedIn(false)
    }
    checkAuth()
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      completeOnboarding()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeOnboarding = async () => {
    setLoading(true)
    try {
      // Save preferences to backend
      // In production, call API to save user preferences
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  const handleGetStarted = () => {
    router.push('/auth/register')
  }

  const handleLogin = () => {
    router.push('/auth/login')
  }

  // If user is already logged in, show personalized onboarding
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className={`w-16 h-16 ${steps[currentStep].color} rounded-2xl flex items-center justify-center text-3xl mb-6`}>
              {steps[currentStep].icon}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {steps[currentStep].title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {steps[currentStep].description}
            </p>

            {/* Step-specific content */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {['Mathematics', 'Science', 'Programming'].map((subject) => (
                  <button
                    key={subject}
                    className={`p-4 rounded-xl border-2 transition-colors ${
                      preferences.interests.includes(subject)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => {
                      const newInterests = preferences.interests.includes(subject)
                        ? preferences.interests.filter((i) => i !== subject)
                        : [...preferences.interests, subject]
                      setPreferences({ ...preferences, interests: newInterests })
                    }}
                  >
                    <span className="text-2xl mb-2 block">
                      {subject === 'Mathematics' ? '🔢' : subject === 'Science' ? '🔬' : '💻'}
                    </span>
                    <span className="font-medium text-gray-900">{subject}</span>
                  </button>
                ))}
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">Select your learning goal:</p>
                {['Exam Preparation', 'Skill Development', 'Career Advancement', 'Personal Interest'].map((goal) => (
                  <button
                    key={goal}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                      preferences.goal === goal
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setPreferences({ ...preferences, goal })}
                  >
                    <span className="font-medium text-gray-900">{goal}</span>
                  </button>
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Your Preferences</h3>
                <div className="space-y-2">
                  {preferences.interests.length > 0 && (
                    <p className="text-sm">
                      <span className="text-gray-500">Interests:</span>{' '}
                      <span className="font-medium">{preferences.interests.join(', ')}</span>
                    </p>
                  )}
                  {preferences.goal && (
                    <p className="text-sm">
                      <span className="text-gray-500">Goal:</span>{' '}
                      <span className="font-medium">{preferences.goal}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">🎉 You're All Set!</h3>
                <p>Ready to start your learning journey? Let's go!</p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-white/50'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : currentStep === steps.length - 1 ? (
                'Get Started'
              ) : (
                'Next'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If not logged in, show welcome page with login/register options
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">INR99 Academy</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogin}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Sign In
            </button>
            <button
              onClick={handleGetStarted}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              INR99 Academy
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Your journey to knowledge starts here. Learn from expert instructors,
            track your progress, and earn certificates.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
            >
              Start Learning Free
            </button>
            <button
              onClick={handleLogin}
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              I Already Have an Account
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={`w-14 h-14 ${step.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-white mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">10K+</p>
              <p className="text-blue-100">Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">500+</p>
              <p className="text-blue-100">Courses</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">100+</p>
              <p className="text-blue-100">Instructors</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">50K+</p>
              <p className="text-blue-100">Certificates Issued</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Priya Sharma',
                role: 'Class 10 Student',
                quote: 'The courses are amazing! I improved my math scores significantly.',
              },
              {
                name: 'Rahul Verma',
                role: 'College Student',
                quote: 'Best platform for learning programming. The instructors are top-notch.',
              },
              {
                name: 'Anita Patel',
                role: 'Parent',
                quote: 'Great for tracking my child\'s progress. Very helpful parent portal.',
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md">
                <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of students who are already learning on INR99 Academy
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg"
          >
            Get Started for Free
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 INR99 Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
