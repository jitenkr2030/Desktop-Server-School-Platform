"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  ArrowRight,
  LucideIcon
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
  }>
  courses?: Array<{ id: string }>
  categoryStats?: {
    courseCount: number
    studentCount: number
    totalDuration: number
    avgRating?: number
    revenue: number
  }
}

interface SubCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  category: {
    id: string
    name: string
    slug: string
  }
  courses?: Array<{ id: string }>
  subCategoryStats?: {
    courseCount: number
    studentCount: number
    totalDuration: number
    avgRating?: number
    revenue: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'courses' | 'students'>('name')
  const [filterBy, setFilterBy] = useState<'all' | 'featured'>('all')
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?includeStats=true&includeSubcategories=true')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      })
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

  const filteredAndSortedCategories = categories
    .filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterBy === 'all' || category.isFeatured
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'courses':
          return (b.categoryStats?.courseCount || 0) - (a.categoryStats?.courseCount || 0)
        case 'students':
          return (b.categoryStats?.studentCount || 0) - (a.categoryStats?.studentCount || 0)
        default:
          return a.name.localeCompare(b.name)
      }
    })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Explore Categories</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover courses across 18+ comprehensive categories designed for Indian learners
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search categories..."
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
                <SelectItem value="courses">Courses</SelectItem>
                <SelectItem value="students">Students</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="w-[120px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
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

        {/* Featured Categories */}
        {filterBy === 'all' && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-orange-500" />
              Featured Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories
                .filter(cat => cat.isFeatured)
                .slice(0, 4)
                .map((category) => {
                  const IconComponent = getIconComponent(category.icon)
                  return (
                    <Link key={category.id} href={`/categories/${category.slug}`}>
                      <Card className="hover:shadow-lg transition-all cursor-pointer border-orange-200">
                        <CardHeader className="text-center pb-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                            category.color || 'bg-orange-100'
                          }`}>
                            <IconComponent className={`h-6 w-6 ${
                              category.color === 'bg-green-100' ? 'text-green-600' :
                              category.color === 'bg-blue-100' ? 'text-blue-600' :
                              category.color === 'bg-purple-100' ? 'text-purple-600' :
                              'text-orange-600'
                            }`} />
                          </div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {category.categoryStats?.courseCount || 0} courses
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  )
                })}
            </div>
          </div>
        )}

        {/* Categories Grid/List */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredAndSortedCategories.map((category) => {
            const IconComponent = getIconComponent(category.icon)
            
            if (viewMode === 'grid') {
              return (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          category.color || 'bg-orange-100'
                        }`}>
                          <IconComponent className={`h-6 w-6 ${
                            category.color === 'bg-green-100' ? 'text-green-600' :
                            category.color === 'bg-blue-100' ? 'text-blue-600' :
                            category.color === 'bg-purple-100' ? 'text-purple-600' :
                            'text-orange-600'
                          }`} />
                        </div>
                        {category.isFeatured && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3 text-gray-500" />
                            <span>{formatNumber(category.categoryStats?.courseCount || 0)} courses</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-gray-500" />
                            <span>{formatNumber(category.categoryStats?.studentCount || 0)} students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span>{formatDuration(category.categoryStats?.totalDuration || 0)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-gray-500" />
                            <span>{category.categoryStats?.avgRating?.toFixed(1) || '0.0'} ⭐</span>
                          </div>
                        </div>

                        {/* Subcategories Preview */}
                        {category.subcategories && category.subcategories.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Popular subcategories:</p>
                            <div className="flex flex-wrap gap-1">
                              {category.subcategories.slice(0, 3).map((sub) => (
                                <Badge key={sub.id} variant="outline" className="text-xs">
                                  {sub.name}
                                </Badge>
                              ))}
                              {category.subcategories.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{category.subcategories.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <Button className="w-full mt-4">
                          Explore Category
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            } else {
              return (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                          category.color || 'bg-orange-100'
                        }`}>
                          <IconComponent className={`h-8 w-8 ${
                            category.color === 'bg-green-100' ? 'text-green-600' :
                            category.color === 'bg-blue-100' ? 'text-blue-600' :
                            category.color === 'bg-purple-100' ? 'text-purple-600' :
                            'text-orange-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{category.name}</h3>
                            {category.isFeatured && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                            {category.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{formatNumber(category.categoryStats?.courseCount || 0)} courses</span>
                            <span>{formatNumber(category.categoryStats?.studentCount || 0)} students</span>
                            <span>{formatDuration(category.categoryStats?.totalDuration || 0)}</span>
                            <span>{category.categoryStats?.avgRating?.toFixed(1) || '0.0'} ⭐</span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            }
          })}
        </div>

        {/* No Results */}
        {filteredAndSortedCategories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterBy !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No categories are available at the moment.'
              }
            </p>
            {(searchTerm || filterBy !== 'all') && (
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setFilterBy('all')
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
  )
}