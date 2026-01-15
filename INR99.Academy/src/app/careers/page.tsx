'use client'

import { useState } from 'react'
import { NewNavigation } from "@/components/new-navigation"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X } from 'lucide-react'

interface Position {
  title: string
  department: string
  location: string
  type: string
  description: string
}

export default function CareersPage() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    experience: '',
    coverLetter: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const positions: Position[] = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Bangalore, India",
      type: "Full-time",
      description: "We're looking for an experienced frontend developer to help build the next generation of our learning platform."
    },
    {
      title: "Backend Engineer",
      department: "Engineering",
      location: "Remote / Bangalore",
      type: "Full-time",
      description: "Join our backend team to build scalable APIs and microservices that power millions of learners."
    },
    {
      title: "Data Scientist",
      department: "Data",
      location: "Bangalore, India",
      type: "Full-time",
      description: "Help us build intelligent learning recommendations and analytics systems."
    },
    {
      title: "Content Creator (Web Development)",
      department: "Content",
      location: "Remote",
      type: "Contract",
      description: "Create engaging web development courses for our global audience."
    },
    {
      title: "Customer Success Manager",
      department: "Operations",
      location: "Bangalore, India",
      type: "Full-time",
      description: "Help our enterprise customers get the most out of their learning programs."
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "Bangalore, India",
      type: "Full-time",
      description: "Drive growth and brand awareness for INR99 Academy."
    }
  ]

  const benefits = [
    { icon: "💰", title: "Competitive Salary", description: "Industry-leading compensation packages" },
    { icon: "🏥", title: "Health Insurance", description: "Comprehensive health coverage for you and family" },
    { icon: "🏖️", title: "Flexible Time Off", description: "Unlimited paid time off policy" },
    { icon: "🏠", title: "Remote Work", description: "Work from anywhere option available" },
    { icon: "📚", title: "Learning Budget", description: "Annual budget for courses and conferences" },
    { icon: "🎉", title: "Team Events", description: "Regular team building and social events" }
  ]

  const handleApplyClick = (position: Position) => {
    setSelectedPosition(position)
    setShowModal(true)
    setSubmitted(false)
    setFormData({
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      experience: '',
      coverLetter: ''
    })
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedPosition(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Create email content
    const subject = `Application for ${selectedPosition?.title}`
    const body = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
LinkedIn: ${formData.linkedin}
Experience: ${formData.experience}

Cover Letter:
${formData.coverLetter}
    `.trim()
    
    // Open email client
    window.open(`mailto:careers@inr99.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    setSubmitted(true)
    setTimeout(() => {
      setShowModal(false)
      setSelectedPosition(null)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Help us transform education and empower millions of learners worldwide.
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Join INR99 Academy?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <span className="text-4xl mb-4 block">{benefit.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Open Positions */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Open Positions</h2>
        <div className="space-y-6 max-w-4xl mx-auto">
          {positions.map((position, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{position.title}</h3>
                  <p className="text-orange-500 font-medium">{position.department}</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">{position.location}</span>
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">{position.type}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{position.description}</p>
              <button 
                onClick={() => handleApplyClick(position)}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-white rounded-xl shadow-lg p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Don't see the right role?</h3>
          <p className="text-gray-600 mb-6">
            We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <a 
            href="mailto:careers@inr99.com" 
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Email Us
          </a>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && selectedPosition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Apply for {selectedPosition.title}</h3>
                <p className="text-gray-500 text-sm">{selectedPosition.department} • {selectedPosition.location}</p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                    <Input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/johndoe"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
                  <Input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 5 years"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter *</label>
                  <Textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Tell us why you're interested in this role and what makes you a great fit..."
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    Submit Application
                  </Button>
                </div>
              </form>
            ) : (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                <p className="text-gray-600">Thank you for applying. We'll review your application and get back to you soon.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
