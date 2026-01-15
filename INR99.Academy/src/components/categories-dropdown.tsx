"use client"

import { useState, useEffect } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, BookOpen, Star } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  color?: string
  isFeatured: boolean
  subcategories?: Array<{
    id: string
    name: string
    slug: string
  }>
}

export function CategoriesDropdown() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?featured=true&includeSubcategories=true')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.slice(0, 8)) // Limit to 8 categories for dropdown
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Button variant="ghost" className="text-gray-600 hover:text-orange-500 transition-colors">
        <div className="animate-pulse">Categories</div>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          Categories
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 max-h-96 overflow-y-auto">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm">All Categories</span>
            <Link href="/categories">
              <Button variant="ghost" size="sm" className="text-xs text-orange-600 hover:text-orange-700">
                View All
              </Button>
            </Link>
          </div>
          <DropdownMenuSeparator />
          
          {categories.map((category) => (
            <div key={category.id}>
              <DropdownMenuItem asChild className="p-0">
                <Link 
                  href={`/categories/${category.slug}`}
                  className="flex items-center justify-between w-full px-2 py-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      category.color || 'bg-orange-100'
                    }`}>
                      <BookOpen className={`h-3 w-3 ${
                        category.color === 'bg-green-100' ? 'text-green-600' :
                        category.color === 'bg-blue-100' ? 'text-blue-600' :
                        category.color === 'bg-purple-100' ? 'text-purple-600' :
                        'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{category.name}</span>
                        {category.isFeatured && (
                          <Star className="h-3 w-3 text-orange-500" />
                        )}
                      </div>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {category.subcategories.length} subcategories
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </Link>
              </DropdownMenuItem>
              
              {/* Show first 3 subcategories */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="ml-6 mb-1">
                  {category.subcategories.slice(0, 3).map((subcategory) => (
                    <DropdownMenuItem key={subcategory.id} asChild className="p-0">
                      <Link 
                        href={`/categories/${category.slug}#${subcategory.slug}`}
                        className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-50 rounded text-xs text-gray-600 hover:text-gray-800 cursor-pointer"
                      >
                        <div className="w-4 h-4 rounded bg-gray-200 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        </div>
                        {subcategory.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  {category.subcategories.length > 3 && (
                    <DropdownMenuItem asChild className="p-0">
                      <Link 
                        href={`/categories/${category.slug}`}
                        className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-50 rounded text-xs text-orange-600 hover:text-orange-700 cursor-pointer"
                      >
                        <span>+{category.subcategories.length - 3} more</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </div>
              )}
              
              <DropdownMenuSeparator className="my-1" />
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}