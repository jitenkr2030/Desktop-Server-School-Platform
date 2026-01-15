"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  X, 
  Tag,
  TrendingUp,
  BookOpen,
  Star,
  Clock,
  MessageCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DiscussionFiltersProps {
  tags: string[]
  searchTerm: string
  selectedCourse: string
  selectedDifficulty: string
  selectedTag: string
  selectedSort: string
  onSearchChange: (value: string) => void
  onCourseChange: (value: string) => void
  onDifficultyChange: (value: string) => void
  onTagChange: (value: string) => void
  onSortChange: (value: string) => void
  onClearFilters: () => void
  courseOptions?: Array<{ id: string; title: string }>
  className?: string
}

export function DiscussionFilters({
  tags,
  searchTerm,
  selectedCourse,
  selectedDifficulty,
  selectedTag,
  selectedSort,
  onSearchChange,
  onCourseChange,
  onDifficultyChange,
  onTagChange,
  onSortChange,
  onClearFilters,
  courseOptions = [],
  className
}: DiscussionFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const difficultyLevels = [
    { value: 'Beginner', label: 'Beginner', icon: '🌱' },
    { value: 'Intermediate', label: 'Intermediate', icon: '📚' },
    { value: 'Advanced', label: 'Advanced', icon: '🎯' }
  ]

  const sortOptions = [
    { value: 'latest', label: 'Latest', icon: Clock },
    { value: 'popular', label: 'Most Popular', icon: TrendingUp },
    { value: 'most_replies', label: 'Most Replies', icon: MessageCircle },
    { value: 'pinned', label: 'Pinned First', icon: Star }
  ]

  const hasActiveFilters = searchTerm || selectedCourse !== 'all' || 
    selectedDifficulty !== 'all' || selectedTag !== 'all' || selectedSort !== 'latest'

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search discussions, topics, or keywords..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Toggle and Quick Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="h-8"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showAdvanced ? 'Hide' : 'Show'} Filters
        </Button>

        <div className="flex items-center gap-2">
          <Select value={selectedSort} onValueChange={onSortChange}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Filters */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant={selectedSort === 'popular' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange('popular')}
            className="h-8"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Trending
          </Button>
          
          <Button
            variant={selectedDifficulty === 'Beginner' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onDifficultyChange('Beginner')}
            className="h-8"
          >
            🌱 Beginner
          </Button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Course Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Course</label>
              <Select value={selectedCourse} onValueChange={onCourseChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courseOptions.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {course.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty Level</label>
              <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center gap-2">
                        <span>{level.icon}</span>
                        {level.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Tag</label>
              <Select value={selectedTag} onValueChange={onTagChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        {tag}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: "{searchTerm}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onSearchChange('')}
              />
            </Badge>
          )}
          
          {selectedCourse !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              <BookOpen className="h-3 w-3" />
              Course
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onCourseChange('all')}
              />
            </Badge>
          )}
          
          {selectedDifficulty !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {difficultyLevels.find(l => l.value === selectedDifficulty)?.icon}
              {selectedDifficulty}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onDifficultyChange('all')}
              />
            </Badge>
          )}
          
          {selectedTag !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              <Tag className="h-3 w-3" />
              {selectedTag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onTagChange('all')}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Popular Tags */}
      {!showAdvanced && tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Popular tags:</span>
          {tags.slice(0, 8).map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => onTagChange(selectedTag === tag ? 'all' : tag)}
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
          {tags.length > 8 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(true)}
              className="h-6 text-xs"
            >
              +{tags.length - 8} more
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Quick filter chips for mobile
interface QuickFilterChipsProps {
  tags: string[]
  selectedTag: string
  onTagChange: (value: string) => void
  className?: string
}

export function QuickFilterChips({ 
  tags, 
  selectedTag, 
  onTagChange, 
  className 
}: QuickFilterChipsProps) {
  const popularTags = tags.slice(0, 6)

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {popularTags.map((tag) => (
        <Button
          key={tag}
          variant={selectedTag === tag ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTagChange(selectedTag === tag ? 'all' : tag)}
          className="h-7 text-xs"
        >
          <Tag className="h-3 w-3 mr-1" />
          {tag}
        </Button>
      ))}
    </div>
  )
}