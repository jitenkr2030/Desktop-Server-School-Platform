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
  GraduationCap,
  School,
  Beaker,
  Calculator,
  Globe,
  Palette,
  Music,
  Database
} from 'lucide-react'
import Link from 'next/link'
import { courses, type Course } from '@/lib/course-data'

interface SchoolClass {
  id: string
  name: string
  level: string
  subjects: string[]
  courses: Course[]
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'PRIMARY': return <GraduationCap className="h-5 w-5" />
    case 'MIDDLE': return <School className="h-5 w-5" />
    case 'SECONDARY': return <Beaker className="h-5 w-5" />
    case 'SENIOR_SECONDARY': return <Calculator className="h-5 w-5" />
    default: return <BookOpen className="h-5 w-5" />
  }
}

const getSubjectIcon = (subjectName: string) => {
  const name = subjectName.toLowerCase()
  if (name.includes('math') || name.includes('calc')) return <Calculator className="h-5 w-5" />
  if (name.includes('science') || name.includes('physics') || name.includes('chemistry') || name.includes('biology')) return <Beaker className="h-5 w-5" />
  if (name.includes('english') || name.includes('language') || name.includes('hindi')) return <Globe className="h-5 w-5" />
  if (name.includes('art') || name.includes('draw')) return <Palette className="h-5 w-5" />
  if (name.includes('music')) return <Music className="h-5 w-5" />
  if (name.includes('computer') || name.includes('digital')) return <Database className="h-5 w-5" />
  return <BookOpen className="h-5 w-5" />
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'PRIMARY': return 'border-blue-200 bg-blue-50'
    case 'MIDDLE': return 'border-green-200 bg-green-50'
    case 'SECONDARY': return 'border-orange-200 bg-orange-50'
    case 'SENIOR_SECONDARY': return 'border-purple-200 bg-purple-50'
    default: return 'border-gray-200 bg-gray-50'
  }
}

const getLevelDescription = (level: string) => {
  switch (level) {
    case 'PRIMARY': return 'Class 1-5: Building strong foundations'
    case 'MIDDLE': return 'Class 6-8: Expanding knowledge horizons'
    case 'SECONDARY': return 'Class 9-10: Preparing for higher education'
    case 'SENIOR_SECONDARY': return 'Class 11-12: Specialized learning streams'
    default: return 'Comprehensive learning experience'
  }
}

// Get school courses from static data
const getSchoolCourses = (): Course[] => {
  return courses.filter(course => 
    course.isActive && course.vertical === 'school'
  )
}

// Organize courses by class level based on subcategory
const organizeClassesByLevel = (): Record<string, SchoolClass[]> => {
  const schoolCourses = getSchoolCourses()
  
  const organized: Record<string, SchoolClass[]> = {
    PRIMARY: [],
    MIDDLE: [],
    SECONDARY: [],
    SENIOR_SECONDARY: []
  }

  // For now, we'll create class structures based on available courses
  // In a real app, courses would have class level metadata
  
  // Create sample class entries based on available data
  const classMapping: Record<string, { level: string; subjects: string[] }> = {
    'class6': { level: 'MIDDLE', subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science'] },
    'class7': { level: 'MIDDLE', subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science'] },
    'class8': { level: 'MIDDLE', subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science'] },
    'class9': { level: 'SECONDARY', subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Computer Science'] },
    'class10': { level: 'SECONDARY', subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Computer Science'] },
    'class11-science': { level: 'SENIOR_SECONDARY', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'] },
    'class11-commerce': { level: 'SENIOR_SECONDARY', subjects: ['Accounts', 'Business Studies', 'Economics', 'Mathematics'] },
    'class11-arts': { level: 'SENIOR_SECONDARY', subjects: ['History', 'Political Science', 'Economics', 'English'] },
    'class12-science': { level: 'SENIOR_SECONDARY', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'] },
    'class12-commerce': { level: 'SENIOR_SECONDARY', subjects: ['Accounts', 'Business Studies', 'Economics', 'Mathematics'] },
    'class12-arts': { level: 'SENIOR_SECONDARY', subjects: ['History', 'Political Science', 'Economics', 'English'] }
  }

  // Create class entries
  Object.entries(classMapping).forEach(([classId, info]) => {
    const classNum = parseInt(classId.replace('class', '').split('-')[0])
    
    organized[info.level].push({
      id: classId,
      name: classId.includes('-') ? classId.split('-')[1].charAt(0).toUpperCase() + classId.split('-')[1].slice(0) + ' - ' + classNum : `Class ${classNum}`,
      level: info.level,
      subjects: info.subjects,
      courses: [] // Will be populated from static data
    })
  })

  return organized
}

export default function SchoolLearningPage() {
  const [loading] = useState(false)
  
  const groupedClasses = useMemo(() => organizeClassesByLevel(), [])
  const schoolCourses = useMemo(() => getSchoolCourses(), [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              🧒 School Learning (Class 1-12)
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Concept Clarity for Every Student
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
              Building strong foundations with concept-focused learning, not exam coaching. 
              CBSE, ICSE, and State Boards supported with animated explanations and practical examples.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <BookOpen className="h-4 w-4" />
                <span>Concept-focused</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <Clock className="h-4 w-4" />
                <span>5-10 min videos</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <Users className="h-4 w-4" />
                <span>All boards supported</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Courses Section */}
      {schoolCourses.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Available Courses
            </h2>
            <p className="text-gray-600">
              Start learning with our school courses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schoolCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">
                      {course.subcategory}
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
                    <span className="text-lg font-bold text-orange-600">
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

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="primary" className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Class Level
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select your class level to explore subjects and start learning with concept clarity
            </p>
          </div>

          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="primary" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Primary
            </TabsTrigger>
            <TabsTrigger value="middle" className="flex items-center gap-2">
              <School className="h-4 w-4" />
              Middle
            </TabsTrigger>
            <TabsTrigger value="secondary" className="flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              Secondary
            </TabsTrigger>
            <TabsTrigger value="senior" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Senior Secondary
            </TabsTrigger>
          </TabsList>

          {/* Primary Level (Class 1-5) */}
          <TabsContent value="primary" className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                {getLevelIcon('PRIMARY')}
                <h3 className="text-2xl font-bold text-gray-900">Primary Level</h3>
              </div>
              <p className="text-gray-600">{getLevelDescription('PRIMARY')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : groupedClasses.PRIMARY.length > 0 ? (
                groupedClasses.PRIMARY.map((cls) => (
                  <Card key={cls.id} className={`hover:shadow-lg transition-shadow ${getLevelColor('PRIMARY')}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-xl">{cls.name}</span>
                        <Badge variant="outline">{cls.subjects.length} subjects</Badge>
                      </CardTitle>
                      <CardDescription>
                        Foundation building with interactive learning
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        {cls.subjects.slice(0, 4).map((subject) => (
                          <div key={subject} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                            {getSubjectIcon(subject)}
                            <span className="text-sm font-medium truncate">{subject}</span>
                          </div>
                        ))}
                      </div>
                      {cls.subjects.length > 4 && (
                        <p className="text-sm text-gray-500">
                          +{cls.subjects.length - 4} more subjects
                        </p>
                      )}
                      <Link href={`/courses?category=school`}>
                        <Button className="w-full mt-4">
                          Browse Classes
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="text-4xl mb-4">📚</div>
                      <h3 className="text-lg font-semibold mb-2">Primary Level Coming Soon</h3>
                      <p className="text-gray-600">
                        We're preparing comprehensive courses for primary school students. 
                        Check back soon or explore other levels.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Middle Level (Class 6-8) */}
          <TabsContent value="middle" className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                {getLevelIcon('MIDDLE')}
                <h3 className="text-2xl font-bold text-gray-900">Middle Level</h3>
              </div>
              <p className="text-gray-600">{getLevelDescription('MIDDLE')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                [...Array(3)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : groupedClasses.MIDDLE.length > 0 ? (
                groupedClasses.MIDDLE.map((cls) => (
                  <Card key={cls.id} className={`hover:shadow-lg transition-shadow ${getLevelColor('MIDDLE')}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-xl">{cls.name}</span>
                        <Badge variant="outline">{cls.subjects.length} subjects</Badge>
                      </CardTitle>
                      <CardDescription>
                        Expanding knowledge with conceptual understanding
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        {cls.subjects.slice(0, 4).map((subject) => (
                          <div key={subject} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                            {getSubjectIcon(subject)}
                            <span className="text-sm font-medium truncate">{subject}</span>
                          </div>
                        ))}
                      </div>
                      {cls.subjects.length > 4 && (
                        <p className="text-sm text-gray-500">
                          +{cls.subjects.length - 4} more subjects
                        </p>
                      )}
                      <Link href={`/courses?category=school`}>
                        <Button className="w-full mt-4">
                          Browse Classes
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <div className="text-4xl mb-4">📖</div>
                      <h3 className="text-lg font-semibold mb-2">Middle School Content Coming Soon</h3>
                      <p className="text-gray-600">
                        Our middle school courses are being developed. 
                        Subscribe to get notified when they're available.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Secondary Level (Class 9-10) */}
          <TabsContent value="secondary" className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                {getLevelIcon('SECONDARY')}
                <h3 className="text-2xl font-bold text-gray-900">Secondary Level</h3>
              </div>
              <p className="text-gray-600">{getLevelDescription('SECONDARY')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                [...Array(2)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : groupedClasses.SECONDARY.length > 0 ? (
                groupedClasses.SECONDARY.map((cls) => (
                  <Card key={cls.id} className={`hover:shadow-lg transition-shadow ${getLevelColor('SECONDARY')}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-xl">{cls.name}</span>
                        <Badge variant="outline">{cls.subjects.length} subjects</Badge>
                      </CardTitle>
                      <CardDescription>
                        Preparing for higher education with strong concepts
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        {cls.subjects.slice(0, 6).map((subject) => (
                          <div key={subject} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                            {getSubjectIcon(subject)}
                            <span className="text-sm font-medium truncate">{subject}</span>
                          </div>
                        ))}
                      </div>
                      {cls.subjects.length > 6 && (
                        <p className="text-sm text-gray-500">
                          +{cls.subjects.length - 6} more subjects
                        </p>
                      )}
                      <Link href={`/courses?category=school`}>
                        <Button className="w-full mt-4">
                          Browse Classes
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="pt-6">
                      <div className="text-4xl mb-4">🎯</div>
                      <h3 className="text-lg font-semibold mb-2">Secondary School Content</h3>
                      <p className="text-gray-600">
                        Explore our available courses for Class 9-10 above, or check back soon for more subjects.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Senior Secondary Level (Class 11-12) */}
          <TabsContent value="senior" className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                {getLevelIcon('SENIOR_SECONDARY')}
                <h3 className="text-2xl font-bold text-gray-900">Senior Secondary Level</h3>
              </div>
              <p className="text-gray-600">{getLevelDescription('SENIOR_SECONDARY')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Science Stream */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-blue-600" />
                    Science Stream
                  </CardTitle>
                  <CardDescription>
                    Physics, Chemistry, Mathematics, Biology
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {['Physics', 'Chemistry', 'Mathematics', 'Biology'].map((subject) => (
                      <div key={subject} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                        {getSubjectIcon(subject)}
                        <span className="text-sm font-medium">{subject}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={`/courses?category=school`}>
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                      Science Courses
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Commerce Stream */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    Commerce Stream
                  </CardTitle>
                  <CardDescription>
                    Accounts, Business Studies, Economics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {['Accounts', 'Business Studies', 'Economics', 'Mathematics'].map((subject) => (
                      <div key={subject} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                        {getSubjectIcon(subject)}
                        <span className="text-sm font-medium">{subject}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={`/courses?category=business`}>
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                      Commerce Courses
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Arts Stream */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    Arts Stream
                  </CardTitle>
                  <CardDescription>
                    History, Political Science, Geography
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {['History', 'Political Science', 'Geography', 'English'].map((subject) => (
                      <div key={subject} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                        {getSubjectIcon(subject)}
                        <span className="text-sm font-medium">{subject}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={`/courses?category=general`}>
                    <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                      Arts Courses
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Our School Learning Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Designed for concept mastery, not just exam preparation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Concept First</h3>
                <p className="text-gray-600">
                  We focus on understanding concepts deeply, not memorizing answers for exams
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Micro-Lessons</h3>
                <p className="text-gray-600">
                  5-10 minute animated videos that explain complex topics simply
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">All Boards Supported</h3>
                <p className="text-gray-600">
                  CBSE, ICSE, and State Boards with concept-focused curriculum alignment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              Ready to Build Strong Foundations?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of students learning with clarity and confidence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subscription">
                <Button size="lg" variant="secondary" className="px-8 py-4">
                  Start Learning at ₹99/month
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4">
                  View All Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
