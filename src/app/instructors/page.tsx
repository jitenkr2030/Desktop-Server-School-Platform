'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { NewNavigation } from '@/components/new-navigation'
import { getPublicInstructors } from '@/app/actions/course-builder'

interface PublicInstructor {
  id: string
  name: string
  avatar?: string | null
  bio: string
  expertise: string
  experience?: string | null
  qualifications?: string | null
  rating: number
  totalStudents: number
  totalCourses: number
}

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<PublicInstructor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function loadInstructors() {
      try {
        const data = await getPublicInstructors()
        setInstructors(data)
      } catch (error) {
        console.error('Failed to load instructors:', error)
      } finally {
        setLoading(false)
      }
    }
    loadInstructors()
  }, [])

  // Fallback mock data if no real instructors
  const mockInstructors = [
    {
      id: 'demo-1',
      name: 'Dr. Sarah Johnson',
      avatar: null,
      bio: 'PhD from MIT with 15+ years of experience in software development and AI research.',
      expertise: 'Computer Science, AI & Machine Learning',
      experience: '15+ years',
      qualifications: 'PhD, MIT',
      rating: 4.9,
      totalStudents: 2500,
      totalCourses: 8
    },
    {
      id: 'demo-2',
      name: 'Prof. Michael Chen',
      avatar: null,
      bio: 'Former Google data scientist with expertise in machine learning and big data analytics.',
      expertise: 'Data Science & Analytics',
      experience: '12+ years',
      qualifications: 'M.Tech, IIT Delhi',
      rating: 4.8,
      totalStudents: 1850,
      totalCourses: 6
    },
    {
      id: 'demo-3',
      name: 'Emily Rodriguez',
      avatar: null,
      bio: 'Senior frontend developer with 10+ years experience building scalable web applications.',
      expertise: 'Web Development & React',
      experience: '10+ years',
      qualifications: 'B.Tech, NIT',
      rating: 4.7,
      totalStudents: 3200,
      totalCourses: 12
    },
    {
      id: 'demo-4',
      name: 'James Wilson',
      avatar: null,
      bio: 'Certified ethical hacker and security consultant with experience at Fortune 500 companies.',
      expertise: 'Cybersecurity & Ethical Hacking',
      experience: '8+ years',
      qualifications: 'CISSP, CEH',
      rating: 4.9,
      totalStudents: 1500,
      totalCourses: 5
    },
    {
      id: 'demo-5',
      name: 'Dr. Lisa Park',
      avatar: null,
      bio: 'AWS certified solutions architect with extensive experience in cloud infrastructure.',
      expertise: 'Cloud Computing & AWS',
      experience: '10+ years',
      qualifications: 'AWS Solutions Architect',
      rating: 4.8,
      totalStudents: 2100,
      totalCourses: 7
    },
    {
      id: 'demo-6',
      name: 'Robert Martinez',
      avatar: null,
      bio: 'iOS and Android developer who has built apps with millions of downloads.',
      expertise: 'Mobile Development & React Native',
      experience: '9+ years',
      qualifications: 'B.Tech, VIT',
      rating: 4.6,
      totalStudents: 2800,
      totalCourses: 9
    }
  ]

  const displayInstructors = instructors.length > 0 ? instructors : mockInstructors

  const filteredInstructors = displayInstructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.expertise.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getRandomColor = (name: string) => {
    const colors = [
      'from-orange-400 to-red-500',
      'from-blue-400 to-indigo-500',
      'from-green-400 to-emerald-500',
      'from-purple-400 to-violet-500',
      'from-pink-400 to-rose-500',
      'from-yellow-400 to-amber-500'
    ]
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  // Pricing Plans Data
  const pricingPlans = [
    {
      name: 'Free',
      price: '₹0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        'Create up to 1 course',
        '0 live sessions',
        'Basic analytics',
        'Community support'
      ],
      cta: 'Current Plan',
      popular: false
    },
    {
      name: 'Basic',
      price: '₹499',
      period: '/month',
      description: 'For growing instructors',
      features: [
        'Create up to 5 courses',
        '5 live sessions/month',
        'Advanced analytics',
        'Email support',
        'Custom branding'
      ],
      cta: 'Upgrade',
      popular: false
    },
    {
      name: 'Pro',
      price: '₹999',
      period: '/month',
      description: 'For professional educators',
      features: [
        'Unlimited courses',
        'Unlimited live sessions',
        'Priority support',
        'White-label options',
        'API access',
        'Dedicated manager'
      ],
      cta: 'Go Pro',
      popular: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Expert Instructors</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Learn from industry experts and experienced educators who are passionate about sharing their knowledge.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search by name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600">{displayInstructors.length}</div>
              <div className="text-gray-600">Active Instructors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {displayInstructors.reduce((acc, i) => acc + i.totalStudents, 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Total Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {displayInstructors.reduce((acc, i) => acc + i.totalCourses, 0)}
              </div>
              <div className="text-gray-600">Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {(displayInstructors.reduce((acc, i) => acc + i.rating, 0) / displayInstructors.length).toFixed(1)}★
              </div>
              <div className="text-gray-600">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading instructors...</p>
          </div>
        ) : filteredInstructors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No instructors found</h3>
            <p className="text-gray-600">Try searching for a different name or subject</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInstructors.map((instructor) => (
              <div
                key={instructor.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Avatar */}
                <div className={`h-32 bg-gradient-to-br ${getRandomColor(instructor.name)} flex items-center justify-center`}>
                  {instructor.avatar ? (
                    <img
                      src={instructor.avatar}
                      alt={instructor.name}
                      className="w-24 h-24 rounded-full border-4 border-white object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {getInitials(instructor.name)}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{instructor.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <span>★</span>
                      <span className="text-gray-700 font-medium">{instructor.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-orange-600 font-medium text-sm mb-3">
                    {instructor.expertise}
                  </p>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {instructor.bio}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-gray-600">
                      <span>👥</span>
                      <span className="text-sm">{instructor.totalStudents.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <span>📚</span>
                      <span className="text-sm">{instructor.totalCourses} courses</span>
                    </div>
                  </div>

                  {/* Experience Badge */}
                  {instructor.experience && (
                    <div className="mt-3">
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        {instructor.experience} experience
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pricing Plans Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Instructor Pricing Plans</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your teaching journey. Upgrade anytime as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-orange-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-orange-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/instructor/pricing"
                    className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        {instructors.length === 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Become an Instructor</h3>
              <p className="text-gray-600 mb-6">
                Share your knowledge with thousands of students across India. 
                Create courses, host live sessions, and earn money teaching what you love.
              </p>
              <Link
                href="/instructor/signup"
                className="inline-flex items-center px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Start Teaching Today
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
