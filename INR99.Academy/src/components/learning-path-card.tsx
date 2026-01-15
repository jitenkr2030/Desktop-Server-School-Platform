"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Star, ArrowRight, GraduationCap, Award, Trophy, Settings, Heart, Zap, Target, TrendingUp, Briefcase } from "lucide-react"
import Link from "next/link"

interface LearningPath {
  id: string
  title: string
  description: string
  icon?: string
  color: string
  courseCount: number
  previewCourses: Array<{
    id: string
    title: string
    difficulty: string
    duration: number
    thumbnail?: string
  }>
}

// Map icon names to Lucide React components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Award,
  Trophy,
  Settings,
  Heart,
  Zap,
  Target,
  TrendingUp,
  Briefcase,
  Star,
}

// Map course IDs to thumbnail paths for courses in learning paths
const getLearningPathCourseThumbnail = (courseId: string, currentThumbnail: string | undefined): string => {
  if (!currentThumbnail || currentThumbnail.startsWith('/assets/') || currentThumbnail.startsWith('/images/')) {
    return currentThumbnail || ''
  }
  
  const thumbnailMap: Record<string, string> = {
    'cr_english_mastery': '/assets/courses/english-communication.svg',
    'cr_indian_constitution': '/assets/courses/indian-constitution.svg',
    'cr_upi': '/assets/courses/cr_upi.svg',
    'cr_digital': '/assets/courses/cr_digital.svg',
    'cr_fraud': '/assets/courses/cr_fraud.svg',
    'cr_bulk': '/assets/courses/cr_bulk.svg',
    'cr_community': '/assets/courses/cr_community.svg',
    'cr_foodwork': '/assets/courses/cr_foodwork.svg',
    'cr_money': '/assets/courses/cr_money.svg',
    'cr_gov': '/assets/courses/cr_gov.svg',
    'cr_english': '/assets/courses/cr_english.svg',
    'python-masterclass': '/assets/courses/python-masterclass.svg',
    'data-science-python': '/assets/courses/data-science-python.svg',
    'web-development-bootcamp': '/assets/courses/web-development-bootcamp.svg',
    'ui-ux-design-masterclass': '/assets/courses/ui-ux-design-masterclass.svg',
    'digital-marketing-complete': '/assets/courses/digital-marketing-complete.svg',
    'personal-finance-mastery': '/assets/courses/personal-finance-mastery.svg',
    'stock-market-fundamentals': '/assets/courses/stock-market-fundamentals.svg',
    'indian-constitution-citizenship': '/assets/courses/indian-constitution-citizenship.svg',
    'excel-mastery': '/assets/courses/excel-mastery.svg',
    'cyber-safety-awareness': '/assets/courses/cyber-safety-awareness.svg',
    'job-prep-complete': '/assets/courses/job-prep-complete.svg',
    'startup-foundation': '/assets/courses/startup-foundation.svg',
    'meditation-mindfulness': '/assets/courses/meditation-mindfulness.svg',
    'bcom-financial-accounting': '/assets/courses/bcom-financial-accounting.svg',
    'class10-mathematics': '/assets/courses/class10-mathematics.svg',
    'english-communication': '/assets/courses/english-communication.svg',
    'mathematics-grade-1': '/assets/courses/mathematics-grade-1.svg',
    'english-grammar-grade-1': '/assets/courses/english-grammar-grade-1.svg',
    'mathematics-grade-6': '/assets/courses/mathematics-grade-6.svg',
    'science-grade-6': '/assets/courses/science-grade-6.svg',
    'mathematics-grade-9': '/assets/courses/mathematics-grade-9.svg',
    'physics-grade-9': '/assets/courses/physics-grade-9.svg',
    'advanced-mathematics-class-11': '/assets/courses/advanced-mathematics-class-11.svg',
    'physics-class-11': '/assets/courses/physics-class-11.svg',
    'engineering-mathematics': '/assets/courses/engineering-mathematics.svg',
    'programming-fundamentals': '/assets/courses/programming-fundamentals.svg',
    'human-anatomy': '/assets/courses/human-anatomy.svg',
    'biochemistry': '/assets/courses/biochemistry.svg',
  }
  
  if (thumbnailMap[courseId]) {
    return thumbnailMap[courseId]
  }
  
  // Try to find a matching thumbnail by partial name match
  const availableThumbnails = Object.values(thumbnailMap)
  for (const thumb of availableThumbnails) {
    const thumbName = thumb.split('/').pop()?.replace('.svg', '')
    if (thumbName && courseId.toLowerCase().includes(thumbName.toLowerCase())) {
      return thumb
    }
  }
  
  return currentThumbnail || ''
}

interface LearningPathCardProps {
  path: LearningPath
}

export function LearningPathCard({ path }: LearningPathCardProps) {
  // Get the icon component from the map, default to BookOpen if not found
  const IconComponent = path.icon && iconMap[path.icon] ? iconMap[path.icon] : BookOpen
  
  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${path.color} flex items-center justify-center`}>
              {path.icon ? (
                <IconComponent className="h-6 w-6 text-white" />
              ) : (
                <BookOpen className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-xl group-hover:text-orange-500 transition-colors">
                {path.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {path.description}
              </CardDescription>
            </div>
          </div>
          <Badge className={`${path.color} text-white`}>
            {path.courseCount} courses
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Preview Courses */}
        {path.previewCourses.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Featured Courses:</h4>
            <div className="space-y-2">
              {path.previewCourses.slice(0, 2).map((course) => (
                <div key={course.id} className="flex items-center gap-2 text-sm text-gray-600">
                  {/* Course Thumbnail */}
                  <div className="w-8 h-8 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {(() => {
                      const thumbnailPath = getLearningPathCourseThumbnail(course.id, course.thumbnail)
                      if (thumbnailPath) {
                        return (
                          <img 
                            src={thumbnailPath} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.parentElement!.innerHTML = '<span class="text-orange-500 text-xs">📚</span>'
                            }}
                          />
                        )
                      }
                      return <span className="text-orange-500 text-xs">📚</span>
                    })()}
                  </div>
                  <span className="truncate">{course.title}</span>
                </div>
              ))}
              {path.courseCount > 2 && (
                <div className="text-xs text-gray-500 ml-10">
                  +{path.courseCount - 2} more courses
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Action Button */}
        <Link href={`/learning-paths/${path.id}`}>
          <Button className="w-full group-hover:bg-orange-500 transition-colors">
            Explore Path
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

interface LearningPathGridProps {
  paths: LearningPath[]
  loading?: boolean
}

export function LearningPathGrid({ paths, loading = false }: LearningPathGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
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
    )
  }

  if (paths.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No learning paths found</h3>
        <p className="text-gray-600">Check back later for new learning paths.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {paths.map((path) => (
        <LearningPathCard key={path.id} path={path} />
      ))}
    </div>
  )
}