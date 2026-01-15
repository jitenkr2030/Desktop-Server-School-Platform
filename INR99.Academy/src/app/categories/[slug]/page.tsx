"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BookOpen, 
  Search, 
  Grid, 
  List, 
  Filter, 
  Star,
  TrendingUp,
  Users,
  Clock,
  ArrowLeft,
  ArrowRight,
  LucideIcon,
  User,
  PlayCircle,
  CheckCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  isFeatured: boolean
  subcategories?: Array<{
    id: string
    name: string
    slug: string
    icon?: string
    color?: string
    description?: string
    courses?: Array<{
      id: string
      title: string
      difficulty: string
      duration: number
      thumbnail?: string
    }>
    subCategoryStats?: {
      courseCount: number
      studentCount: number
      totalDuration: number
      avgRating?: number
      revenue: number
    }
  }>
  courses?: Array<{
    id: string
    title: string
    description: string
    difficulty: string
    duration: number
    thumbnail?: string
    instructor: {
      id: string
      name: string
      avatar?: string
    }
    progress?: Array<{ id: string }>
    _count: {
      lessons: number
      assessments: number
    }
  }>
  categoryStats?: {
    courseCount: number
    studentCount: number
    totalDuration: number
    avgRating?: number
    revenue: number
  }
}

export default function CategoryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const categorySlug = params.slug as string
  
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'duration' | 'rating'>('name')
  const [filterBy, setFilterBy] = useState<'all' | 'subcategories'>('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const { toast } = useToast()

  useEffect(() => {
    fetchCategory()
  }, [categorySlug])

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${categorySlug}`)
      if (response.ok) {
        const data = await response.json()
        setCategory(data)
      } else {
        toast({
          title: "Error",
          description: "Category not found",
          variant: "destructive"
        })
        router.push('/categories')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch category",
        variant: "destructive"
      })
      router.push('/categories')
    } finally {
      setLoading(false)
    }
  }

  const getIconComponent = (iconName?: string): LucideIcon => {
    switch (iconName) {
      case 'BookOpen': return BookOpen
      case 'TrendingUp': return TrendingUp
      case 'Users': return Users
      case 'Clock': return Clock
      case 'Star': return Star
      default: return BookOpen
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredAndSortedCourses = category?.courses
    ?.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSubcategory = !selectedSubcategory || 
                                  category.subcategories?.some(sub => 
                                    sub.id === selectedSubcategory && 
                                    sub.courses?.some(c => c.id === course.id)
                                  )
      return matchesSearch && matchesSubcategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          const difficultyOrder = { 'BEGINNER': 1, 'INTERMEDIATE': 2, 'ADVANCED': 3 }
          return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
        case 'duration':
          return a.duration - b.duration
        case 'rating':
          return (b._count.assessments || 0) - (a._count.assessments || 0)
        default:
          return a.title.localeCompare(b.title)
      }
    }) || []

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h1>
          <Button
            onClick={() => router.push('/categories')}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Back to Categories
          </Button>
        </div>
      </div>
    )
  }

  const IconComponent = getIconComponent(category.icon)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => router.push('/categories')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
            {category.isFeatured && (
              <Badge className="bg-orange-100 text-orange-800">
                <Star className="h-3 w-3 mr-1" />
                Featured Category
              </Badge>
            )}
          </div>
          
          <div className="flex items-start gap-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 ${
              category.color || 'bg-orange-100'
            }`}>
              <IconComponent className={`h-10 w-10 ${
                category.color === 'bg-green-100' ? 'text-green-600' :
                category.color === 'bg-blue-100' ? 'text-blue-600' :
                category.color === 'bg-purple-100' ? 'text-purple-600' :
                'text-orange-600'
              }`} />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{category.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{category.description}</p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{formatNumber(category.categoryStats?.courseCount || 0)} courses</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{formatNumber(category.categoryStats?.studentCount || 0)} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{formatDuration(category.categoryStats?.totalDuration || 0)} content</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{category.categoryStats?.avgRating?.toFixed(1) || '0.0'} average rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subcategories */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Subcategories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.subcategories.map((subcategory) => {
                const SubIconComponent = getIconComponent(subcategory.icon)
                return (
                  <Card 
                    key={subcategory.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedSubcategory === subcategory.id ? 'ring-2 ring-orange-500' : ''
                    }`}
                    onClick={() => setSelectedSubcategory(
                      selectedSubcategory === subcategory.id ? '' : subcategory.id
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          subcategory.color || 'bg-orange-100'
                        }`}>
                          <SubIconComponent className={`h-5 w-5 ${
                            subcategory.color === 'bg-green-100' ? 'text-green-600' :
                            subcategory.color === 'bg-blue-100' ? 'text-blue-600' :
                            subcategory.color === 'bg-purple-100' ? 'text-purple-600' :
                            'text-orange-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{subcategory.name}</h3>
                          <p className="text-sm text-gray-600">
                            {subcategory.subCategoryStats?.courseCount || 0} courses
                          </p>
                        </div>
                        {selectedSubcategory === subcategory.id && (
                          <CheckCircle className="h-5 w-5 text-orange-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {selectedSubcategory 
                ? `${category.subcategories?.find(s => s.id === selectedSubcategory)?.name} Courses`
                : 'All Courses'
              }
              <span className="text-gray-500 text-lg ml-2">
                ({filteredAndSortedCourses.length})
              </span>
            </h2>
            {selectedSubcategory && (
              <Button
                variant="outline"
                onClick={() => setSelectedSubcategory('')}
              >
                Clear Filter
              </Button>
            )}
          </div>

          {filteredAndSortedCourses.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredAndSortedCourses.map((course) => {
                if (viewMode === 'grid') {
                  return (
                    <Link key={course.id} href={`/courses/${course.id}`}>
                      <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                        <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                          {course.thumbnail ? (
                            <img 
                              src={course.thumbnail} 
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-green-100">
                              <BookOpen className="h-16 w-16 text-orange-500" />
                            </div>
                          )}
                        </div>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getDifficultyColor(course.difficulty)}>
                              {course.difficulty}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{formatDuration(course.duration)}</span>
                            </div>
                          </div>
                          <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {course.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                                <AvatarFallback>
                                  {course.instructor.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">{course.instructor.name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <PlayCircle className="h-3 w-3" />
                              <span>{course._count.lessons} lessons</span>
                            </div>
                          </div>
                          <Button className="w-full">
                            Start Learning
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                } else {
                  return (
                    <Link key={course.id} href={`/courses/${course.id}`}>
                      <Card className="hover:shadow-lg transition-all cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {course.thumbnail ? (
                                <img 
                                  src={course.thumbnail} 
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-green-100">
                                  <BookOpen className="h-8 w-8 text-orange-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge className={getDifficultyColor(course.difficulty)}>
                                      {course.difficulty}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                      <Clock className="h-3 w-3" />
                                      <span>{formatDuration(course.duration)}</span>
                                    </div>
                                  </div>
                                  <h3 className="font-semibold text-lg line-clamp-1">{course.title}</h3>
                                  <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                                    <AvatarFallback>
                                      {course.instructor.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-gray-600">{course.instructor.name}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500">
                                  <span>{course._count.lessons} lessons</span>
                                  <span>{course._count.assessments} assessments</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                }
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedSubcategory
                  ? 'Try adjusting your search or filters'
                  : 'No courses are available in this category at the moment.'
                }
              </p>
              {(searchTerm || selectedSubcategory) && (
                <Button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedSubcategory('')
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}