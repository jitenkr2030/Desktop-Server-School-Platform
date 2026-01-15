"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Smartphone, Users, BookOpen, Star, IndianRupee, Video, MessageCircle, Zap, Award, Play, ArrowRight } from "lucide-react"
import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { LearningPathCategories } from "@/components/learning-path-categories"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until mounted to prevent SSR issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          {/* Hero Section Placeholder */}
          <div className="h-[600px] bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800"></div>
          
          {/* Other sections placeholders */}
          <div className="h-[400px] bg-gray-50"></div>
          <div className="h-[800px] bg-white"></div>
          <div className="h-[400px] bg-gray-50"></div>
          <div className="h-[600px] bg-gray-900"></div>
        </div>
      </div>
    )
  }

  const utilityFeatures = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: "Concept Clarity Focus",
      description: "We focus on understanding concepts, not exam guarantees or rank promises"
    },
    {
      icon: <IndianRupee className="h-8 w-8 text-green-500" />,
      title: "₹99/Month Utility Model",
      description: "Affordable learning utility like UPI - accessible to every Indian"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Complete Learning Ecosystem",
      description: "School + College + Skills + Career - all in one platform"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-orange-500" />,
      title: "India-First Design",
      description: "Built for Indian students with local context and practical relevance"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Live Learning Spotlight */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2 text-sm">
                🎥 NEW FEATURE
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Learn Live with<br />
                <span className="text-yellow-300">Expert Instructors</span>
              </h2>
              <p className="text-xl text-indigo-100 leading-relaxed">
                Experience real-time interactive learning with live classes, instant Q&A, 
                and direct engagement with industry experts.
              </p>

              {/* Benefits */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Interactive Q&A</h3>
                    <p className="text-indigo-200">Ask questions and get instant answers during live sessions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Real-Time Feedback</h3>
                    <p className="text-indigo-200">Get immediate clarification and guidance from instructors</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Learn with Peers</h3>
                    <p className="text-indigo-200">Join discussion rooms and learn alongside fellow students</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-yellow-300">100+</div>
                  <div className="text-sm text-indigo-200">Weekly Sessions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-300">50+</div>
                  <div className="text-sm text-indigo-200">Expert Instructors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-300">4.9★</div>
                  <div className="text-sm text-indigo-200">Student Rating</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/live-sessions">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-lg">
                    <Play className="w-5 h-5 mr-2" />
                    Browse Live Classes
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-3 text-lg">
                  How It Works
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="relative">
              {/* Main Visual Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                {/* Mock Live Session Interface */}
                <div className="aspect-video bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Video className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-white/80 text-sm">Live Session Preview</p>
                    </div>
                  </div>
                  {/* Live Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                      <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                      LIVE
                    </span>
                  </div>
                  {/* Participants */}
                  <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                      <Users className="w-3 h-3 mr-1" />
                      127 watching
                    </span>
                  </div>
                </div>

                {/* Session Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span className="font-semibold">Advanced Physics Concepts</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      In Progress
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-indigo-200">
                    <span>By Dr. Rajesh Kumar</span>
                    <span>32 min remaining</span>
                  </div>
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">2,500+</div>
                    <div className="text-sm text-gray-500">Students Online</div>
                  </div>
                </div>
              </div>

              {/* Floating Feature Card */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 rounded-xl p-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-semibold text-sm">Live Q&A Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path Categories */}
      <section className="bg-white py-16">
        <LearningPathCategories />
      </section>

      {/* Utility Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary" className="text-sm md:text-base px-4 py-2">
              🧠 Learning Utility Philosophy
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why We're Different
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're not a coaching center. We're a learning utility focused on foundation building.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {utilityFeatures.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Growing Learning Utility Statement */}
      <section className="bg-gradient-to-r from-orange-50 to-yellow-50 py-12 border-y border-orange-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-200">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-4xl">🌱</span>
                <Badge variant="outline" className="text-lg px-4 py-2 border-orange-300 text-orange-700">
                  Our Philosophy
                </Badge>
              </div>
              <blockquote className="text-2xl md:text-3xl font-semibold text-gray-800 italic leading-relaxed">
                "INR99 Academy is a growing learning utility. Content is added continuously based on real user needs."
              </blockquote>
              <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
                Unlike static coaching programs, we evolve based on what learners actually need. 
                Every new course, tutorial, and resource is developed in response to genuine student requests and community feedback.
              </p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live & Growing</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>📝</span>
                  <span>User-Driven Content</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>🎯</span>
                  <span>Community Feedback</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Provide vs What We Avoid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Learning Philosophy
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Clear boundaries that keep us focused on what matters most - your learning
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                What We Provide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                <span className="text-green-700">Concept clarity and foundation strengthening</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                <span className="text-green-700">Revision and deep understanding</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                <span className="text-green-700">Short concept videos (5-10 mins)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                <span className="text-green-700">Animated explanations and simple examples</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                <span className="text-green-700">Chapter-wise structure for systematic learning</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                ✕ What We Avoid
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                <span className="text-red-700">Exam guarantees and rank promises</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                <span className="text-red-700">Board-specific coaching claims</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                <span className="text-red-700">Model papers and predictions</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                <span className="text-red-700">"90% guarantee" marketing claims</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                <span className="text-red-700">University-specific syllabus promises</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              🚀 Join the Learning Revolution
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of learners across India who are building their future with INR99.Academy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/subscription">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                  Start Learning at ₹99/month
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                Explore Learning Paths
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">INR99.Academy</h3>
            <p className="text-gray-400">
              India's Learning Infrastructure - As reliable as UPI
            </p>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              This platform provides conceptual learning and academic support. 
              It is not affiliated with any board, university, or examination authority.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>© 2026 INR99.Academy</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}