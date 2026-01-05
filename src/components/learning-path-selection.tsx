'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, GraduationCap, Briefcase, TrendingUp, ArrowRight, Building2, Award } from 'lucide-react'

interface LearningPathCardProps {
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  badge?: string
  color: string
  href: string
}

const LearningPathCard: React.FC<LearningPathCardProps> = ({
  title,
  description,
  icon,
  features,
  badge,
  color,
  href
}) => {
  return (
    <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 ${color}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${color.replace('border-', 'bg-').replace('200', '100')}`}>
              {icon}
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{title}</CardTitle>
              {badge && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  {badge}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <CardDescription className="text-base mt-3">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
        <Button className="w-full" size="lg">
          Start Learning
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

export const LearningPathSelection: React.FC = () => {
  const learningPaths = [
    {
      title: "🧒 School Learning",
      description: "Class 1-12 concept clarity and foundation building",
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      features: [
        "CBSE, ICSE & State Boards",
        "Concept-focused learning",
        "Animated explanations",
        "Chapter-wise structure"
      ],
      badge: "Popular",
      color: "border-blue-200",
      href: "/school"
    },
    {
      title: "🎓 College Learning",
      description: "UG foundation courses for all degrees",
      icon: <GraduationCap className="h-6 w-6 text-green-600" />,
      features: [
        "BA/BSc/BCom Foundations",
        "Engineering Basics",
        "Commerce & Management",
        "Subject-wise learning"
      ],
      color: "border-green-200",
      href: "/college"
    },
    {
      title: "🏛️ Competitive Exams",
      description: "Government jobs and exam preparation",
      icon: <Building2 className="h-6 w-6 text-red-600" />,
      features: [
        "UPSC, SSC, Banking",
        "Railway, Defense",
        "State PSC, Police, TET"
      ],
      badge: "18 Courses",
      color: "border-red-200",
      href: "/competitive-exams"
    },
    {
      title: "📊 Professional Courses",
      description: "CA, CS, CMA, CFA, FRM, Actuarial",
      icon: <Award className="h-6 w-6 text-purple-600" />,
      features: [
        "Chartered Accountant",
        "Company Secretary",
        "CFA & FRM",
        "Actuarial Science"
      ],
      badge: "14 Courses",
      color: "border-purple-200",
      href: "/professional-courses"
    },
    {
      title: "🧑‍💼 Career & Skills",
      description: "Professional development and career growth",
      icon: <Briefcase className="h-6 w-6 text-indigo-600" />,
      features: [
        "Resume & Interview Skills",
        "Remote Work & Freelancing",
        "Leadership & Management",
        "Workplace Readiness"
      ],
      color: "border-indigo-200",
      href: "/career"
    },
    {
      title: "💰 Money & Business",
      description: "Financial literacy and business fundamentals",
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
      features: [
        "Personal Finance",
        "Investment Basics",
        "Business Fundamentals",
        "Entrepreneurship"
      ],
      color: "border-orange-200",
      href: "/business"
    },
    {
      title: "🧠 Life Skills",
      description: "Personal development and well-being",
      icon: <span className="text-2xl">🌟</span>,
      features: [
        "Time Management",
        "Stress Management",
        "Communication Skills",
        "Critical Thinking"
      ],
      badge: "10 Courses",
      color: "border-pink-200",
      href: "/life-skills"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Choose Your Learning Path
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Everything you need to learn, all in one place. From Class 1 to Career — 
          learning for every Indian, at ₹99/month.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {learningPaths.map((path, index) => (
          <LearningPathCard key={index} {...path} />
        ))}
      </div>
      
      <div className="text-center mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          One Subscription = Everything
        </h3>
        <p className="text-gray-600 mb-4">
          Access all learning paths, courses, and features with just one subscription
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span>✓ No per-course pricing</span>
          <span>✓ No hidden fees</span>
          <span>✓ Cancel anytime</span>
        </div>
      </div>
    </div>
  )
}
