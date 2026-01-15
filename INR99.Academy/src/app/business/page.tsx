'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Users, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Building,
  Calculator,
  PiggyBank,
  DollarSign,
  BarChart3,
  Briefcase,
  Target,
  Award,
  Lightbulb,
  Rocket,
  Shield,
  CreditCard,
  Banknote,
  PieChart,
  TrendingDown,
  ArrowUpRight,
  Percent,
  FileText,
  Scale
} from 'lucide-react'
import Link from 'next/link'
import { courses, type Course } from '@/lib/course-data'

// Get business-related courses from static data
const getBusinessCourses = (): Course[] => {
  return courses.filter(course => 
    course.isActive && (
      course.category === 'business' || 
      course.category === 'finance' ||
      course.category === 'ecommerce'
    )
  )
}

export default function MoneyBusinessPage() {
  const [loading] = useState(false)
  
  const businessCourses = useMemo(() => getBusinessCourses(), [])

  // Calculate stats from courses
  const totalStudents = useMemo(() => 
    businessCourses.reduce((sum, c) => sum + c.enrollmentCount, 0),
    [businessCourses]
  )
  
  const totalLessons = useMemo(() =>
    businessCourses.reduce((sum, c) => sum + c.lessonCount, 0),
    [businessCourses]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-green-600 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              💰 Money & Business
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Master Your Financial Future
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
              Personal finance, investment strategies, business fundamentals, and entrepreneurial skills.
              Build wealth and create opportunities with practical, India-focused financial education.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <PiggyBank className="h-4 w-4" />
                <span>Financial literacy</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <TrendingUp className="h-4 w-4" />
                <span>Investment basics</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <Building className="h-4 w-4" />
                <span>Business fundamentals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Courses Section */}
      {businessCourses.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Available Courses
            </h2>
            <p className="text-gray-600">
              Start learning with our business and finance courses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">
                      {course.category === 'business' ? 'Business' : 
                       course.category === 'finance' ? 'Finance' : 'E-commerce'}
                    </Badge>
                    <Badge className={
                      course.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {course.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">
                    {course.title}
                  </CardTitle>
                  <CardDescription>
                    {course.tagline}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>📚 {course.lessonCount} lessons</span>
                    <span>⏱️ {Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-500">By {course.instructor.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      {course.price === 0 ? 'FREE' : `₹${course.price}`}
                    </span>
                    <Link href={`/courses/${course.id}`}>
                      <Button size="sm">
                        Start Learning
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Main Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Money & Business Learning Paths
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive financial education and business skill development
          </p>
        </div>

        {/* Key Learning Areas */}
        <Tabs defaultValue="personal-finance" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="personal-finance">Personal Finance</TabsTrigger>
            <TabsTrigger value="investing">Investing</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
          </TabsList>

          <TabsContent value="personal-finance" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <PiggyBank className="h-5 w-5" />, title: "Budgeting", desc: "Create and manage personal budgets", color: "bg-green-100" },
                { icon: <CreditCard className="h-5 w-5" />, title: "Debt Management", desc: "Understand and control debt", color: "bg-red-100" },
                { icon: <Shield className="h-5 w-5" />, title: "Insurance", desc: "Protect your financial future", color: "bg-blue-100" },
                { icon: <Banknote className="h-5 w-5" />, title: "Savings", desc: "Build emergency funds", color: "bg-yellow-100" },
                { icon: <Percent className="h-5 w-5" />, title: "Tax Planning", desc: "Optimize your tax strategy", color: "bg-purple-100" },
                { icon: <FileText className="h-5 w-5" />, title: "Financial Goals", desc: "Set and achieve goals", color: "bg-pink-100" },
                { icon: <TrendingDown className="h-5 w-5" />, title: "Expense Tracking", desc: "Monitor spending habits", color: "bg-orange-100" },
                { icon: <PieChart className="h-5 w-5" />, title: "Net Worth", desc: "Calculate and grow net worth", color: "bg-indigo-100" }
              ].map((item, index) => (
                <Card key={index} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${item.color}`}>
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/courses?category=finance">
                <Button size="lg">
                  Explore Personal Finance Courses
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="investing" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <BarChart3 className="h-5 w-5" />, title: "Stocks", desc: "Learn stock market basics", color: "bg-blue-100" },
                { icon: <ArrowUpRight className="h-5 w-5" />, title: "Mutual Funds", desc: "Understand fund investments", color: "bg-green-100" },
                { icon: <Building className="h-5 w-5" />, title: "Real Estate", desc: "Property investment basics", color: "bg-orange-100" },
                { icon: <TrendingUp className="h-5 w-5" />, title: "SIPs", desc: "Systematic investment plans", color: "bg-purple-100" },
                { icon: <DollarSign className="h-5 w-5" />, title: "Bonds", desc: "Fixed income securities", color: "bg-yellow-100" },
                { icon: <Calculator className="h-5 w-5" />, title: "Risk Management", desc: "Assess investment risks", color: "bg-red-100" },
                { icon: <Award className="h-5 w-5" />, title: "Portfolio", desc: "Build diverse portfolios", color: "bg-indigo-100" },
                { icon: <Target className="h-5 w-5" />, title: "Goals", desc: "Goal-based investing", color: "bg-pink-100" }
              ].map((item, index) => (
                <Card key={index} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${item.color}`}>
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/courses?category=finance">
                <Button size="lg">
                  Explore Investing Courses
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <Briefcase className="h-5 w-5" />, title: "Business Planning", desc: "Create business plans", color: "bg-blue-100" },
                { icon: <Scale className="h-5 w-5" />, title: "Legal Structure", desc: "Business entity types", color: "bg-purple-100" },
                { icon: <FileText className="h-5 w-5" />, title: "Accounting", desc: "Financial statements", color: "bg-green-100" },
                { icon: <TrendingUp className="h-5 w-5" />, title: "Marketing", desc: "Business promotion", color: "bg-orange-100" },
                { icon: <Users className="h-5 w-5" />, title: "Sales", desc: "Revenue generation", color: "bg-red-100" },
                { icon: <Lightbulb className="h-5 w-5" />, title: "Innovation", desc: "Business innovation", color: "bg-yellow-100" },
                { icon: <Rocket className="h-5 w-5" />, title: "Growth", desc: "Scale your business", color: "bg-indigo-100" },
                { icon: <Shield className="h-5 w-5" />, title: "Compliance", desc: "Legal requirements", color: "bg-pink-100" }
              ].map((item, index) => (
                <Card key={index} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${item.color}`}>
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/courses?category=business">
                <Button size="lg">
                  Explore Business Courses
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Financial Education Matters
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real impact of financial literacy on your life
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600 mb-2">{businessCourses.length}+</div>
                <h3 className="text-lg font-semibold mb-2">Financial Courses</h3>
                <p className="text-gray-600 text-sm">
                  Comprehensive courses covering all aspects of finance and business
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{totalLessons}+</div>
                <h3 className="text-lg font-semibold mb-2">Video Lessons</h3>
                <p className="text-gray-600 text-sm">
                  Detailed lessons on finance, investing, and business topics
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">{(totalStudents / 1000).toFixed(0)}K+</div>
                <h3 className="text-lg font-semibold mb-2">Students Learning</h3>
                <p className="text-gray-600 text-sm">
                  Join thousands building their financial knowledge
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Important Disclaimer */}
      <section className="bg-yellow-50 border-l-4 border-yellow-400 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4">
            <div className="text-yellow-600 mt-1">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Educational Purpose Only</h3>
              <p className="text-yellow-700">
                This platform provides financial education and business knowledge for learning purposes. 
                It is not financial advice, investment recommendation, or business consulting service. 
                Always consult with qualified professionals for personal financial decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              Ready to Master Your Finances?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of Indians building wealth and business knowledge with INR99.Academy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subscription">
                <Button size="lg" variant="secondary" className="px-8 py-4">
                  Start Learning at ₹99/month
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4">
                  Explore All Topics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
