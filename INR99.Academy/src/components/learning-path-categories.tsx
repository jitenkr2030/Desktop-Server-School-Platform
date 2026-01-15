'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface LearningPath {
  id: string
  title: string
  description: string
  icon: string
  color: string
  courseCount: number
}

interface LearningPathCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  sortOrder: number
  isFeatured: boolean
  learningPaths: LearningPath[]
}

export const LearningPathCategories: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [categories, setCategories] = useState<LearningPathCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchLearningPathCategories()
  }, [])

  // Don't render until mounted to prevent SSR issues
  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const fetchLearningPathCategories = async () => {
    try {
      const response = await fetch('/api/learning-path-categories')
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.success) {
          setCategories(data.learningPathCategories)
        } else {
          // Use fallback data if API response indicates failure
          setCategories(getFallbackCategories())
        }
      } else {
        // Use fallback data if API call fails
        setCategories(getFallbackCategories())
      }
    } catch (error) {
      console.error('Error fetching learning path categories:', error)
      // Use fallback data to prevent crashes
      setCategories(getFallbackCategories())
    } finally {
      setLoading(false)
    }
  }

  const getFallbackCategories = (): LearningPathCategory[] => {
    return [
      {
        id: '1',
        name: 'School Learning',
        slug: 'school-learning',
        description: 'Class 1-12 with all boards',
        icon: '🧒',
        color: 'bg-blue-500',
        sortOrder: 1,
        isFeatured: true,
        learningPaths: [
          { id: '1a', title: 'Primary (1-5)', description: 'Math, EVS, English', icon: '📚', color: 'bg-blue-100', courseCount: 15 },
          { id: '1b', title: 'Middle School (6-8)', description: 'Math, Science, Social', icon: '📖', color: 'bg-blue-100', courseCount: 20 },
          { id: '1c', title: 'Secondary (9-10)', description: 'Math, Science, English', icon: '📝', color: 'bg-blue-100', courseCount: 25 },
          { id: '1d', title: 'Senior Secondary (11-12)', description: 'Science, Commerce, Arts', icon: '🎓', color: 'bg-blue-100', courseCount: 30 }
        ]
      },
      {
        id: '2',
        name: 'College Foundation',
        slug: 'college-foundation',
        description: 'UG degrees and subjects',
        icon: '🎓',
        color: 'bg-green-500',
        sortOrder: 2,
        isFeatured: true,
        learningPaths: [
          { id: '2a', title: 'Commerce', description: 'Accounting, Business', icon: '💼', color: 'bg-green-100', courseCount: 18 },
          { id: '2b', title: 'Computer Science', description: 'Programming, CS fundamentals', icon: '💻', color: 'bg-green-100', courseCount: 22 },
          { id: '2c', title: 'Science', description: 'Physics, Chemistry, Biology', icon: '🔬', color: 'bg-green-100', courseCount: 16 },
          { id: '2d', title: 'Engineering', description: 'Math, Physics basics', icon: '⚙️', color: 'bg-green-100', courseCount: 14 }
        ]
      },
      {
        id: '3',
        name: 'Competitive Exams',
        slug: 'competitive-exams',
        description: 'Government jobs and competitive exam preparation',
        icon: '🏛️',
        color: 'bg-red-500',
        sortOrder: 3,
        isFeatured: true,
        learningPaths: [
          { id: '3a', title: 'UPSC', description: 'Civil Services, NDA, CDS', icon: '📋', color: 'bg-red-100', courseCount: 3 },
          { id: '3b', title: 'SSC', description: 'CGL, CHSL, MTS, GD', icon: '📊', color: 'bg-red-100', courseCount: 4 },
          { id: '3c', title: 'Banking', description: 'SBI, IBPS, RRB', icon: '🏦', color: 'bg-red-100', courseCount: 3 },
          { id: '3d', title: 'Railway & Defense', description: 'RRB, NDA, CDS, AFCAT', icon: '🚂', color: 'bg-red-100', courseCount: 4 },
          { id: '3e', title: 'State Government', description: 'PSC, Police, Patwari, TET', icon: '🏢', color: 'bg-red-100', courseCount: 4 }
        ]
      },
      {
        id: '4',
        name: 'Professional Courses',
        slug: 'professional-courses',
        description: 'CA, CS, CMA, CFA, FRM, Actuarial',
        icon: '📊',
        color: 'bg-purple-500',
        sortOrder: 4,
        isFeatured: true,
        learningPaths: [
          { id: '4a', title: 'Chartered Accountant', description: 'CA Foundation, Intermediate, Final', icon: '📈', color: 'bg-purple-100', courseCount: 3 },
          { id: '4b', title: 'Company Secretary', description: 'CS Executive, Professional', icon: '📋', color: 'bg-purple-100', courseCount: 2 },
          { id: '4c', title: 'CMA', description: 'Cost and Management Accounting', icon: '💰', color: 'bg-purple-100', courseCount: 3 },
          { id: '4d', title: 'CFA', description: 'Chartered Financial Analyst', icon: '📉', color: 'bg-purple-100', courseCount: 3 },
          { id: '4e', title: 'FRM & Actuarial', description: 'Risk Management, Actuarial Science', icon: '🎯', color: 'bg-purple-100', courseCount: 3 }
        ]
      },
      {
        id: '5',
        name: 'Career Skills',
        slug: 'career-skills',
        description: 'Professional development',
        icon: '🧑‍💼',
        color: 'bg-indigo-500',
        sortOrder: 5,
        isFeatured: true,
        learningPaths: [
          { id: '5a', title: 'Professional Skills', description: 'Communication, Leadership', icon: '💪', color: 'bg-indigo-100', courseCount: 12 },
          { id: '5b', title: 'Technical Skills', description: 'Web dev, Data analysis', icon: '⚡', color: 'bg-indigo-100', courseCount: 20 },
          { id: '5c', title: 'Soft Skills', description: 'Emotional intelligence, Problem solving', icon: '🧠', color: 'bg-indigo-100', courseCount: 10 },
          { id: '5d', title: 'Digital Skills', description: 'AI, Automation basics', icon: '🤖', color: 'bg-indigo-100', courseCount: 15 }
        ]
      },
      {
        id: '6',
        name: 'Money & Business',
        slug: 'money-business',
        description: 'Financial literacy',
        icon: '💰',
        color: 'bg-orange-500',
        sortOrder: 6,
        isFeatured: true,
        learningPaths: [
          { id: '6a', title: 'Financial Literacy', description: 'Personal finance, Investment', icon: '📊', color: 'bg-orange-100', courseCount: 14 },
          { id: '6b', title: 'Business Fundamentals', description: 'Planning, Entrepreneurship', icon: '🚀', color: 'bg-orange-100', courseCount: 16 },
          { id: '6c', title: 'Investment & Trading', description: 'Stock market, Crypto', icon: '📈', color: 'bg-orange-100', courseCount: 12 },
          { id: '6d', title: 'E-commerce', description: 'Online business, Digital marketing', icon: '🛒', color: 'bg-orange-100', courseCount: 18 }
        ]
      },
      {
        id: '7',
        name: 'Life Skills',
        slug: 'life-skills',
        description: 'Personal development and well-being',
        icon: '🧠',
        color: 'bg-pink-500',
        sortOrder: 7,
        isFeatured: true,
        learningPaths: [
          { id: '7a', title: 'Productivity', description: 'Time Management, Focus', icon: '⏰', color: 'bg-pink-100', courseCount: 2 },
          { id: '7b', title: 'Wellness', description: 'Stress Management, Mental Health', icon: '🧘', color: 'bg-pink-100', courseCount: 1 },
          { id: '7c', title: 'Communication', description: 'Confidence, Public Speaking', icon: '🎤', color: 'bg-pink-100', courseCount: 2 },
          { id: '7d', title: 'Personal Growth', description: 'Decision Making, Critical Thinking', icon: '🌟', color: 'bg-pink-100', courseCount: 5 }
        ]
      }
    ]
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // If no categories after loading, show fallback
  const displayCategories = categories.length > 0 ? categories : getFallbackCategories()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-4 mb-12">
        <Badge variant="secondary" className="text-sm md:text-base px-4 py-2">
          🎯 Seven Main Learning Paths
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Comprehensive Learning Structure
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          From Class 1 to Career — Our seven main learning paths cover every stage of your educational journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-all duration-200 group">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{category.icon}</div>
                <Badge className={`${category.color} text-white`}>
                  {category.learningPaths.length} paths
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                {category.name}
              </CardTitle>
              <CardDescription className="text-sm">
                {category.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-4">
              {/* Learning Paths List */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Learning Paths:</h4>
                <div className="space-y-1">
                  {category.learningPaths.slice(0, 4).map((path) => (
                    <div key={path.id} className="flex items-center justify-between text-sm text-gray-600">
                      <span className="truncate flex items-center gap-1">
                        <span className="text-xs">{path.icon}</span>
                        {path.title}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {path.courseCount} courses
                      </Badge>
                    </div>
                  ))}
                  {category.learningPaths.length > 4 && (
                    <div className="text-xs text-gray-500">
                      +{category.learningPaths.length - 4} more paths
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Button */}
              <Link href={`/learning-paths/${category.slug}`}>
                <Button className="w-full group-hover:bg-blue-600 transition-colors">
                  Explore {category.name}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Structure Overview */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          ✅ Complete Learning Structure Overview
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* School Learning */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
              🧒 School Learning:
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Primary (Class 1-5): Math, EVS, English, Hindi, GK, Digital basics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Middle School (Class 6-8): Math, Science, Social Science, English, Computer basics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Secondary (Class 9-10): Math, Science, Social Science, English, IT basics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Senior Secondary (Class 11-12): Science, Commerce, and Arts streams</span>
              </div>
            </div>
          </div>

          {/* College Learning */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-600 flex items-center gap-2">
              🎓 College Learning:
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Commerce: Financial Accounting, Cost Accounting, Business Law, Economics, Tax basics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Computer Science: Programming fundamentals, Data structures, Databases, Operating systems</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Science: Physics, Chemistry, Biology, Statistics fundamentals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Engineering: Engineering maths, Basic electrical, Mechanics, Materials science</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Competitive Exams */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-red-600 flex items-center gap-2">
              🏛️ Competitive Exams:
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>UPSC: Civil Services Prelims, Mains, Interview, NDA, CDS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>SSC: CGL, CHSL, MTS, GD Constable examinations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Banking: SBI PO/Clerk, IBPS PO/Clerk, RRB exams</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Railway & Defense: RRB NTPC/ALP/Group D, NDA, CDS, AFCAT</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>State Government: PSC, Police Constable/SI, Patwari, TET</span>
              </div>
            </div>
          </div>

          {/* Professional Courses */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-600 flex items-center gap-2">
              📊 Professional Courses:
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Chartered Accountant: CA Foundation, Intermediate, Final</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Company Secretary: CS Executive, Professional programs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>CMA: Cost and Management Accounting levels</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>CFA: Chartered Financial Analyst Levels I, II, III</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>FRM & Actuarial: Financial Risk Management, Actuarial Science</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Career & Skills */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
              🧑‍💼 Career & Skills:
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span>Professional Development: Resume building, communication skills, time management</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span>Technical Skills: Web development, data analysis, digital marketing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span>Soft Skills: Leadership, emotional intelligence, problem-solving</span>
              </div>
            </div>
          </div>

          {/* Money & Business */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-600 flex items-center gap-2">
              💰 Money & Business:
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Financial Literacy: Personal finance, investment basics, banking services</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Business Fundamentals: Business planning, entrepreneurship, marketing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Investment & Trading: Stock market, mutual funds, cryptocurrency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Life Skills */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-pink-600 flex items-center gap-2">
            🧠 Life Skills:
          </h4>
          <div className="space-y-2 text-sm text-gray-700 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span>Productivity: Time Management Mastery, Productivity Systems & Habits</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span>Wellness: Stress Management & Resilience, Mental Clarity & Focus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span>Communication: Confidence Building & Public Speaking, Communication Skills Masterclass</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span>Personal Growth: Decision Making & Problem Solving, Emotional Intelligence, Goal Setting, Critical Thinking</span>
            </div>
          </div>
        </div>

        {/* 18 Categories Overview */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-purple-600 mb-4">
            📚 21 Comprehensive Learning Categories (Detailed Subjects):
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 text-sm">
            {[
              'School Learning',
              'College Foundation',
              'Competitive Exams',
              'Professional Courses',
              'Career Skills',
              'Money & Business',
              'Life Skills'
            ].map((category, index) => (
              <div key={index} className="flex items-center gap-1 text-gray-700">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                <span className="text-xs">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}