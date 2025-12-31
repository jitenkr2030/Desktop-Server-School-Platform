"use client"

import { useState, useEffect, useRef } from 'react'

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  totalDiscussions: number
  totalSubscriptions: number
  activeSubscriptions: number
  totalCertificates: number
  totalPayments: number
  totalRevenue: number
  monthlyRevenue: number
}

interface DashboardData {
  stats: AdminStats
  userGrowth: any[]
  courseStats: any[]
}

interface User {
  id: string
  name: string | null
  email: string
  role: string
  isActive: boolean
  createdAt: Date
  subscriptions: any[]
  _count: {
    progress: number
    certificates: number
    discussions: number
  }
}

interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface Course {
  id: string
  title: string
  description: string
  difficulty: string
  duration: number
  isActive: boolean
  thumbnail: string | null
  createdAt: Date
  instructor: {
    id: string
    name: string
  }
  learningPath: {
    id: string
    title: string
  } | null
  _count: {
    lessons: number
    progress: number
    assessments: number
    discussions: number
  }
}

interface CoursesResponse {
  courses: Course[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface Instructor {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  subcategories: any[]
  courses: any[]
}

interface CategoriesResponse {
  categories: Category[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface Discussion {
  id: string
  title: string
  content: string
  isPinned: boolean
  isActive: boolean
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string
  }
  course: {
    id: string
    title: string
  } | null
  _count: {
    replies: number
  }
}

interface DiscussionsResponse {
  discussions: Discussion[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    totalCourses: number
    activeCourses: number
    totalDiscussions: number
    totalSubscriptions: number
    activeSubscriptions: number
    totalCertificates: number
    totalPayments: number
    totalRevenue: number
  }
  revenueChart: { date: string; revenue: number; subscriptions: number; certificates: number }[]
  usersChart: { month: string; count: number }[]
  coursesByDifficulty: { difficulty: string; count: number }[]
  coursesByCategory: { name: string; count: number }[]
  topCourses: { courseId: string; title: string; enrollments: number }[]
  instructors: { id: string; name: string; courseCount: number }[]
  subscriptionStats: { status: string; count: number }[]
  recentDiscussions: Discussion[]
  dailyActiveUsers: { lastLogin: Date; name: string | null; email: string }[]
}

interface PlatformSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  logoUrl: string
  faviconUrl: string
  maintenanceMode: boolean
  allowRegistration: boolean
  allowGuestCheckout: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  defaultCurrency: string
  platformFee: number
  taxRate: number
  maxUploadSize: number
  allowedFileTypes: string[]
  defaultCourseDuration: number
  certificateExpiry: number
  maxStudentsPerCourse: number
  passwordMinLength: number
  sessionTimeout: number
  twoFactorRequired: boolean
  metaKeywords: string
  metaDescription: string
  facebookUrl: string
  twitterUrl: string
  instagramUrl: string
  youtubeUrl: string
  linkedinUrl: string
  supportEmail: string
  contactPhone: string
  address: string
  googleAnalyticsId: string
  facebookPixelId: string
}

interface FinancialOverview {
  totalRevenue: number
  totalPayments: number
  averageOrderValue: number
  refundAmount: number
  netRevenue: number
}

interface FinancialData {
  overview: FinancialOverview
  revenueChart: { date: string; revenue: number; orders: number; refunds: number }[]
  paymentMethods: { method: string; count: number; amount: number; percentage: number }[]
  topCourses: { courseId: string; title: string; revenue: number; sales: number }[]
  recentTransactions: {
    id: string
    amount: number
    currency: string
    status: string
    paymentMethod: string
    createdAt: Date
    user: { name: string | null; email: string }
    course: { title: string } | null
  }[]
  period: number
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('admin')
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  
  // Users management state
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersPagination, setUsersPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Courses management state
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesLoading, setCoursesLoading] = useState(false)
  const [coursesPagination, setCoursesPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [courseSearchTerm, setCourseSearchTerm] = useState('')
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    difficulty: 'BEGINNER',
    duration: 60,
    instructorId: '',
    thumbnail: ''
  })

  // Categories management state
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categorySearchTerm, setCategorySearchTerm] = useState('')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#3b82f6',
    isFeatured: false
  })

  // Discussions management state
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [discussionsLoading, setDiscussionsLoading] = useState(false)
  const [discussionsPagination, setDiscussionsPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [discussionSearchTerm, setDiscussionSearchTerm] = useState('')
  const [editingDiscussion, setEditingDiscussion] = useState<Discussion | null>(null)
  const [showDiscussionModal, setShowDiscussionModal] = useState(false)

  // Analytics state
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('30')

  // Settings state
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editedSettings, setEditedSettings] = useState<PlatformSettings | null>(null)

  // Financial state
  const [financial, setFinancial] = useState<FinancialData | null>(null)
  const [financialLoading, setFinancialLoading] = useState(false)
  const [financialPeriod, setFinancialPeriod] = useState('30')

  useEffect(() => {
    setMounted(true)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const statsResponse = await fetch('/api/admin/stats')
      
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data: DashboardData = await statsResponse.json()
      setStats(data.stats)

      const userResponse = await fetch('/api/auth/session')
      if (userResponse.ok) {
        const session = await userResponse.json()
        if (session?.user) {
          setUser({
            name: session.user.name || 'Admin',
            email: session.user.email || 'admin@inr99.com',
            role: session.user.role || 'ADMIN'
          })
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true)
      const response = await fetch(`/api/admin/analytics?days=${selectedPeriod}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data: AnalyticsData = await response.json()
      setAnalytics(data)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Failed to load analytics')
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const fetchUsers = async (page = 1, search = '') => {
    try {
      setUsersLoading(true)
      const response = await fetch(`/api/admin/users?page=${page}&limit=10&search=${encodeURIComponent(search)}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data: UsersResponse = await response.json()
      setUsers(data.users)
      setUsersPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users')
    } finally {
      setUsersLoading(false)
    }
  }

  const fetchCourses = async (page = 1, search = '') => {
    try {
      setCoursesLoading(true)
      const response = await fetch(`/api/admin/courses?page=${page}&limit=10&search=${encodeURIComponent(search)}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }

      const data: CoursesResponse = await response.json()
      setCourses(data.courses)
      setCoursesPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching courses:', err)
      setError('Failed to load courses')
    } finally {
      setCoursesLoading(false)
    }
  }

  const fetchCategories = async (page = 1, search = '') => {
    try {
      setCategoriesLoading(true)
      const response = await fetch(`/api/admin/categories?page=${page}&limit=50&search=${encodeURIComponent(search)}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      const data: CategoriesResponse = await response.json()
      setCategories(data.categories)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Failed to load categories')
    } finally {
      setCategoriesLoading(false)
    }
  }

  const fetchDiscussions = async (page = 1, search = '') => {
    try {
      setDiscussionsLoading(true)
      const response = await fetch(`/api/admin/discussions?page=${page}&limit=10&search=${encodeURIComponent(search)}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch discussions')
      }

      const data: DiscussionsResponse = await response.json()
      setDiscussions(data.discussions)
      setDiscussionsPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching discussions:', err)
      setError('Failed to load discussions')
    } finally {
      setDiscussionsLoading(false)
    }
  }

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/instructors')
      if (response.ok) {
        const data = await response.json()
        setInstructors(data.instructors || [])
      }
    } catch (err) {
      console.error('Error fetching instructors:', err)
    }
  }

  useEffect(() => {
    if (tab === 'users') {
      fetchUsers(usersPagination.page, searchTerm)
    }
  }, [tab])

  useEffect(() => {
    if (tab === 'courses') {
      fetchCourses(coursesPagination.page, courseSearchTerm)
      fetchInstructors()
    }
  }, [tab])

  useEffect(() => {
    if (tab === 'categories') {
      fetchCategories(1, categorySearchTerm)
    }
  }, [tab])

  useEffect(() => {
    if (tab === 'discussions') {
      fetchDiscussions(discussionsPagination.page, discussionSearchTerm)
    }
  }, [tab])

  useEffect(() => {
    if (tab === 'analytics') {
      fetchAnalytics()
    }
  }, [tab, selectedPeriod])

  useEffect(() => {
    if (tab === 'settings') {
      fetchSettings()
    }
  }, [tab])

  useEffect(() => {
    if (tab === 'financial') {
      fetchFinancial()
    }
  }, [tab, financialPeriod])

  const fetchSettings = async () => {
    try {
      setSettingsLoading(true)
      const response = await fetch('/api/admin/settings')
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }

      const data = await response.json()
      setSettings(data.settings)
      setEditedSettings(data.settings)
    } catch (err) {
      console.error('Error fetching settings:', err)
      setError('Failed to load settings')
    } finally {
      setSettingsLoading(false)
    }
  }

  const fetchFinancial = async () => {
    try {
      setFinancialLoading(true)
      const response = await fetch(`/api/admin/financial?period=${financialPeriod}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch financial data')
      }

      const data: FinancialData = await response.json()
      setFinancial(data)
    } catch (err) {
      console.error('Error fetching financial data:', err)
      setError('Failed to load financial data')
    } finally {
      setFinancialLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!editedSettings) return
    
    try {
      setSettingsSaving(true)
      setSettingsMessage(null)
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedSettings)
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      const data = await response.json()
      setSettings(data.settings)
      setSettingsMessage({ type: 'success', text: 'Settings saved successfully!' })
      
      setTimeout(() => setSettingsMessage(null), 3000)
    } catch (err) {
      console.error('Error saving settings:', err)
      setSettingsMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleResetSettings = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      return
    }
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      })

      if (!response.ok) {
        throw new Error('Failed to reset settings')
      }

      const data = await response.json()
      setSettings(data.settings)
      setEditedSettings(data.settings)
      setSettingsMessage({ type: 'success', text: 'Settings reset to defaults!' })
      
      setTimeout(() => setSettingsMessage(null), 3000)
    } catch (err) {
      console.error('Error resetting settings:', err)
      setSettingsMessage({ type: 'error', text: 'Failed to reset settings' })
    }
  }

  const handleExportFinancial = async (format: 'csv') => {
    try {
      const response = await fetch(`/api/admin/financial?period=${financialPeriod}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export', exportFormat: format })
      })

      if (!response.ok) {
        throw new Error('Failed to export financial data')
      }

      if (format === 'csv') {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `financial-report-${Date.now()}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (err) {
      console.error('Error exporting financial data:', err)
      alert('Failed to export financial data')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(1, searchTerm)
  }

  const handleCourseSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCourses(1, courseSearchTerm)
  }

  const handleCategorySearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCategories(1, categorySearchTerm)
  }

  const handleDiscussionSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchDiscussions(1, discussionSearchTerm)
  }

  const handlePageChange = (newPage: number, type: 'users' | 'courses' | 'discussions') => {
    if (type === 'users') {
      fetchUsers(newPage, searchTerm)
    } else if (type === 'courses') {
      fetchCourses(newPage, courseSearchTerm)
    } else {
      fetchDiscussions(newPage, discussionSearchTerm)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user })
    setShowEditModal(true)
  }

  const handleSaveUser = async () => {
    if (!editingUser) return
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser.id,
          name: editingUser.name,
          isActive: editingUser.isActive
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      fetchUsers(usersPagination.page, searchTerm)
      setShowEditModal(false)
      setEditingUser(null)
    } catch (err) {
      console.error('Error updating user:', err)
      alert('Failed to update user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      fetchUsers(usersPagination.page, searchTerm)
    } catch (err) {
      console.error('Error deleting user:', err)
      alert('Failed to delete user')
    }
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse({ ...course })
    setShowCourseModal(true)
  }

  const handleSaveCourse = async () => {
    if (!editingCourse) return
    
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: editingCourse.id,
          title: editingCourse.title,
          description: editingCourse.description,
          difficulty: editingCourse.difficulty,
          duration: editingCourse.duration,
          isActive: editingCourse.isActive
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update course')
      }

      fetchCourses(coursesPagination.page, courseSearchTerm)
      setShowCourseModal(false)
      setEditingCourse(null)
    } catch (err) {
      console.error('Error updating course:', err)
      alert('Failed to update course')
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/courses?courseId=${courseId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete course')
      }

      fetchCourses(coursesPagination.page, courseSearchTerm)
    } catch (err) {
      console.error('Error deleting course:', err)
      alert('Failed to delete course')
    }
  }

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description || !newCourse.instructorId) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      })

      if (!response.ok) {
        throw new Error('Failed to create course')
      }

      fetchCourses(1, courseSearchTerm)
      setShowCreateModal(false)
      setNewCourse({
        title: '',
        description: '',
        difficulty: 'BEGINNER',
        duration: 60,
        instructorId: '',
        thumbnail: ''
      })
    } catch (err) {
      console.error('Error creating course:', err)
      alert('Failed to create course')
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory({ ...category })
    setShowCategoryModal(true)
  }

  const handleSaveCategory = async () => {
    if (!editingCategory) return
    
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCategory.id,
          name: editingCategory.name,
          description: editingCategory.description,
          icon: editingCategory.icon,
          color: editingCategory.color,
          isActive: editingCategory.isActive,
          isFeatured: editingCategory.isFeatured,
          sortOrder: editingCategory.sortOrder
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update category')
      }

      fetchCategories(1, categorySearchTerm)
      setShowCategoryModal(false)
      setEditingCategory(null)
    } catch (err) {
      console.error('Error updating category:', err)
      alert('Failed to update category')
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      alert('Category name is required')
      return
    }

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to create category')
      }

      fetchCategories(1, categorySearchTerm)
      setShowCreateCategoryModal(false)
      setNewCategory({
        name: '',
        description: '',
        icon: '',
        color: '#3b82f6',
        isFeatured: false
      })
    } catch (err: any) {
      console.error('Error creating category:', err)
      alert(err.message || 'Failed to create category')
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to delete category')
      }

      fetchCategories(1, categorySearchTerm)
    } catch (err: any) {
      console.error('Error deleting category:', err)
      alert(err.message || 'Failed to delete category')
    }
  }

  const handleEditDiscussion = (discussion: Discussion) => {
    setEditingDiscussion({ ...discussion })
    setShowDiscussionModal(true)
  }

  const handleSaveDiscussion = async () => {
    if (!editingDiscussion) return
    
    try {
      const response = await fetch('/api/admin/discussions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discussionId: editingDiscussion.id,
          isActive: editingDiscussion.isActive,
          isPinned: editingDiscussion.isPinned
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update discussion')
      }

      fetchDiscussions(discussionsPagination.page, discussionSearchTerm)
      setShowDiscussionModal(false)
      setEditingDiscussion(null)
    } catch (err) {
      console.error('Error updating discussion:', err)
      alert('Failed to update discussion')
    }
  }

  const handleDeleteDiscussion = async (discussionId: string) => {
    if (!confirm('Are you sure you want to delete this discussion? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/discussions?discussionId=${discussionId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete discussion')
      }

      fetchDiscussions(discussionsPagination.page, discussionSearchTerm)
    } catch (err) {
      console.error('Error deleting discussion:', err)
      alert('Failed to delete discussion')
    }
  }

  // Simple Bar Chart Component
  const BarChart = ({ data, height = 200 }: { data: { label: string; value: number; color?: string }[]; height?: number }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1)
    
    return (
      <div style={{ height, display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '1rem' }}>
        {data.map((item, index) => (
          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '100%', 
              height: `${(item.value / maxValue) * 150}px`, 
              background: item.color || '#dc2626',
              borderRadius: '4px 4px 0 0',
              minHeight: '4px'
            }}></div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', textAlign: 'center' }}>
              {item.label.length > 10 ? item.label.substring(0, 10) + '...' : item.label}
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  // Simple Line Chart Component
  const LineChart = ({ data, height = 200, color = '#dc2626' }: { data: { label: string; value: number }[]; height?: number; color?: string }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1)
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * 100
      const y = 100 - ((d.value / maxValue) * 80)
      return `${x},${y}`
    }).join(' ')

    return (
      <div style={{ height, position: 'relative', padding: '1rem' }}>
        <svg width="100%" height="150" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={points}
          />
          {data.map((d, i) => {
            const x = (i / (data.length - 1 || 1)) * 100
            const y = 100 - ((d.value / maxValue) * 80)
            return (
              <circle key={i} cx={x} cy={y} r="3" fill={color} />
            )
          })}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{data[0]?.label}</span>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{data[data.length - 1]?.label}</span>
        </div>
      </div>
    )
  }

  // Donut Chart Component
  const DonutChart = ({ data, size = 150 }: { data: { label: string; value: number; color: string }[]; size?: number }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0)
    const colors = ['#dc2626', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
    let cumulativePercent = 0

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          {data.map((item, index) => {
            const percent = (item.value / total) * 100
            const startAngle = cumulativePercent * 3.6
            const endAngle = startAngle + percent * 3.6
            cumulativePercent += percent

            const startRad = (startAngle - 90) * Math.PI / 180
            const endRad = (endAngle - 90) * Math.PI / 180

            const x1 = 50 + 40 * Math.cos(startRad)
            const y1 = 50 + 40 * Math.sin(startRad)
            const x2 = 50 + 40 * Math.cos(endRad)
            const y2 = 50 + 40 * Math.sin(endRad)

            const largeArc = percent > 50 ? 1 : 0

            return (
              <path
                key={index}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={item.color || colors[index % colors.length]}
              />
            )
          })}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {data.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: item.color || colors[index % colors.length] }}></div>
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>{item.label}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #dc2626', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'analytics', label: '📈 Analytics' },
    { id: 'financial', label: '💰 Financial' },
    { id: 'courses', label: '📚 Courses' },
    { id: 'categories', label: '📁 Categories' },
    { id: 'discussions', label: '💬 Discussions' },
    { id: 'users', label: '👥 Users' },
    { id: 'settings', label: '⚙️ Settings' }
  ]

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
  const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const handleTabClick = (tabId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setTab(tabId)
  }

  // Loading state
  if (loading && (tab === 'dashboard' || tab === 'settings')) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>A</div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>Loading...</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Fetching data</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {tabs.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={(e) => handleTabClick(t.id, e)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      background: tab === t.id ? '#dc2626' : '#f3f4f6',
                      color: tab === t.id ? 'white' : '#374151',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <a href="/" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'white', color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                🚪 Logout
              </a>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ height: '20px', background: '#e5e7eb', borderRadius: '4px', width: '60%', marginBottom: '0.5rem' }}></div>
                <div style={{ height: '32px', background: '#e5e7eb', borderRadius: '4px', width: '40%' }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && (tab === 'dashboard' || tab === 'settings')) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>A</div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>Demo Admin</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>admin1@inr99.com</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {tabs.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={(e) => handleTabClick(t.id, e)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      background: tab === t.id ? '#dc2626' : '#f3f4f6',
                      color: tab === t.id ? 'white' : '#374151',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <a href="/" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'white', color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                🚪 Logout
              </a>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#991b1b', marginBottom: '0.5rem' }}>Error Loading Data</h2>
            <p style={{ color: '#7f1d1d', marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={fetchDashboardData}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#dc2626',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      {/* Navigation Bar */}
      <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>A</div>
              <div>
                <div style={{ fontWeight: '600', color: '#1f2937' }}>{user?.name || 'Demo Admin 1'}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user?.email || 'admin1@inr99.com'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={(e) => handleTabClick(t.id, e)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    background: tab === t.id ? '#dc2626' : '#f3f4f6',
                    color: tab === t.id ? 'white' : '#374151',
                    transition: 'all 0.2s'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <a href="/" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'white', color: '#374151', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
              🚪 Logout
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {tab === 'dashboard' && stats && (
          <div>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Welcome back, Admin!</h1>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Monitor your platform performance and manage users</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: '👥' },
                { label: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: '✅' },
                { label: 'Total Courses', value: stats.totalCourses.toLocaleString(), icon: '📚' },
                { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: '💰' }
              ].map(stat => (
                <div key={stat.label} style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{stat.label}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.25rem' }}>{stat.value}</p>
                    </div>
                    <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'analytics' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>📈 Analytics Dashboard</h2>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem'
                }}
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>

            {analyticsLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading analytics...</div>
            ) : analytics ? (
              <>
                {/* Overview Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    { label: 'Total Users', value: analytics.overview.totalUsers.toLocaleString(), icon: '👥' },
                    { label: 'Active Courses', value: analytics.overview.activeCourses.toLocaleString(), icon: '📚' },
                    { label: 'Active Subscriptions', value: analytics.overview.activeSubscriptions.toLocaleString(), icon: '🎓' },
                    { label: 'Total Revenue', value: formatCurrency(analytics.overview.totalRevenue), icon: '💰' },
                    { label: 'Certificates', value: analytics.overview.totalCertificates.toLocaleString(), icon: '🏆' },
                    { label: 'Discussions', value: analytics.overview.totalDiscussions.toLocaleString(), icon: '💬' }
                  ].map(stat => (
                    <div key={stat.label} style={{ background: 'white', borderRadius: '0.5rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <span style={{ fontSize: '1.25rem' }}>{stat.icon}</span>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>{stat.label}</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {/* Revenue Chart */}
                  <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Revenue Trend</h3>
                    {analytics.revenueChart.length > 0 ? (
                      <LineChart 
                        data={analytics.revenueChart.slice(-14).map(d => ({ label: d.date.slice(5), value: d.revenue }))}
                        color="#10b981"
                      />
                    ) : (
                      <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>No revenue data</div>
                    )}
                  </div>

                  {/* User Growth Chart */}
                  <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>User Growth</h3>
                    {analytics.usersChart.length > 0 ? (
                      <BarChart data={analytics.usersChart.slice(-6).map(d => ({ label: d.month.slice(2), value: d.count, color: '#3b82f6' }))} />
                    ) : (
                      <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>No user data</div>
                    )}
                  </div>
                </div>

                {/* Distribution Charts */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {/* Courses by Difficulty */}
                  <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Courses by Difficulty</h3>
                    <BarChart 
                      data={analytics.coursesByDifficulty.map(d => ({ 
                        label: d.difficulty.charAt(0) + d.difficulty.slice(1).toLowerCase(), 
                        value: d.count,
                        color: d.difficulty === 'BEGINNER' ? '#10b981' : d.difficulty === 'INTERMEDIATE' ? '#f59e0b' : '#ef4444'
                      }))} 
                      height={150}
                    />
                  </div>

                  {/* Top Courses */}
                  <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Top Courses by Enrollment</h3>
                    {analytics.topCourses.length > 0 ? (
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {analytics.topCourses.slice(0, 5).map((course, index) => (
                          <div key={course.courseId} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#dc2626', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600' }}>
                              {index + 1}
                            </span>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>{course.title}</p>
                              <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '3px', marginTop: '4px' }}>
                                <div style={{ height: '100%', width: `${(course.enrollments / analytics.topCourses[0].enrollments) * 100}%`, background: '#dc2626', borderRadius: '3px' }}></div>
                              </div>
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>{course.enrollments}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>No course data</div>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Recent Discussions</h3>
                  {analytics.recentDiscussions.length > 0 ? (
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {analytics.recentDiscussions.slice(0, 5).map((discussion) => (
                        <div key={discussion.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                          <div>
                            <p style={{ fontWeight: '500', color: '#1f2937' }}>{discussion.title}</p>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{discussion.user?.name || 'Unknown'} • {discussion.course?.title || 'General'}</p>
                          </div>
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{discussion._count.replies} replies</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>No recent discussions</div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>No analytics data available</div>
            )}
          </div>
        )}

        {tab === 'financial' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>💰 Financial Reports</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  value={financialPeriod}
                  onChange={(e) => setFinancialPeriod(e.target.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
                <button
                  onClick={() => handleExportFinancial('csv')}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#10b981',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  📥 Export CSV
                </button>
              </div>
            </div>

            {financialLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading financial data...</div>
            ) : financial ? (
              <>
                {/* Financial Overview */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    { label: 'Total Revenue', value: formatCurrency(financial.overview.totalRevenue), icon: '💰', color: '#10b981' },
                    { label: 'Total Orders', value: financial.overview.totalPayments.toLocaleString(), icon: '📦', color: '#3b82f6' },
                    { label: 'Avg Order Value', value: formatCurrency(financial.overview.averageOrderValue), icon: '📊', color: '#8b5cf6' },
                    { label: 'Net Revenue', value: formatCurrency(financial.overview.netRevenue), icon: '✅', color: '#059669' }
                  ].map(stat => (
                    <div key={stat.label} style={{ background: 'white', borderRadius: '0.5rem', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>{stat.label}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color, marginTop: '0.25rem' }}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {/* Revenue Chart */}
                  <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Revenue Over Time</h3>
                    {financial.revenueChart.length > 0 ? (
                      <LineChart
                        data={financial.revenueChart.slice(-14).map(d => ({ label: d.date.slice(5), value: d.revenue }))}
                        color="#10b981"
                      />
                    ) : (
                      <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>No revenue data</div>
                    )}
                  </div>

                  {/* Payment Methods */}
                  <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Payment Methods</h3>
                    {financial.paymentMethods.length > 0 ? (
                      <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {financial.paymentMethods.map((method, index) => (
                          <div key={method.method}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                              <span style={{ fontSize: '0.875rem', color: '#374151', textTransform: 'capitalize' }}>{method.method}</span>
                              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>{formatCurrency(method.amount)}</span>
                            </div>
                            <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px' }}>
                              <div style={{ height: '100%', width: `${method.percentage}%`, background: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5], borderRadius: '4px' }}></div>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.125rem' }}>{method.count} transactions • {method.percentage.toFixed(1)}%</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>No payment data</div>
                    )}
                  </div>
                </div>

                {/* Top Courses & Transactions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {/* Top Courses by Revenue */}
                  <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Top Courses by Revenue</h3>
                    {financial.topCourses.length > 0 ? (
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {financial.topCourses.slice(0, 5).map((course, index) => (
                          <div key={course.courseId} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#dc2626', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600' }}>
                              {index + 1}
                            </span>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>{course.title}</p>
                              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{course.sales} sales</p>
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#10b981' }}>{formatCurrency(course.revenue)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>No course revenue data</div>
                    )}
                  </div>

                  {/* Recent Transactions */}
                  <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Recent Transactions</h3>
                    {financial.recentTransactions.length > 0 ? (
                      <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto' }}>
                        {financial.recentTransactions.map((transaction) => (
                          <div key={transaction.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                            <div>
                              <p style={{ fontWeight: '500', color: '#1f2937', fontSize: '0.875rem' }}>{transaction.user.name || transaction.user.email}</p>
                              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{transaction.course?.title || 'N/A'}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ fontWeight: '600', color: '#10b981', fontSize: '0.875rem' }}>{formatCurrency(transaction.amount)}</p>
                              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{formatDate(transaction.createdAt)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>No recent transactions</div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>No financial data available</div>
            )}
          </div>
        )}

        {tab === 'courses' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>📚 All Courses</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#dc2626',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ➕ Add New Course
              </button>
            </div>
            
            <form onSubmit={handleCourseSearch} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Search courses..."
                value={courseSearchTerm}
                onChange={(e) => setCourseSearchTerm(e.target.value)}
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
              />
              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#dc2626', color: 'white', borderRadius: '0.5rem', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Search</button>
            </form>

            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 1fr 1fr 1fr 1.5fr', gap: '1rem', padding: '1rem', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>
                <div>Course</div>
                <div>Instructor</div>
                <div>Difficulty</div>
                <div>Duration</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {coursesLoading && <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading courses...</div>}

              {!coursesLoading && courses.map((course) => (
                <div key={course.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 1fr 1fr 1fr 1.5fr', gap: '1rem', padding: '1rem', borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{course.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{course._count.lessons} lessons • {course._count.progress} students</p>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{course.instructor?.name || 'N/A'}</div>
                  <div>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', background: course.difficulty === 'BEGINNER' ? '#dcfce7' : course.difficulty === 'INTERMEDIATE' ? '#fef3c7' : '#fee2e2', color: course.difficulty === 'BEGINNER' ? '#166534' : course.difficulty === 'INTERMEDIATE' ? '#854d0e' : '#991b1b' }}>
                      {course.difficulty}
                    </span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{formatDuration(course.duration)}</div>
                  <div>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', background: course.isActive ? '#dcfce7' : '#fef3c7', color: course.isActive ? '#166534' : '#854d0e' }}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEditCourse(course)} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500', background: 'white' }}>Edit</button>
                    <button onClick={() => handleDeleteCourse(course.id)} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #fecaca', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500', background: '#fef2f2', color: '#991b1b' }}>Delete</button>
                  </div>
                </div>
              ))}

              {!coursesLoading && courses.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No courses found</div>}

              {!coursesLoading && coursesPagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Page {coursesPagination.page} of {coursesPagination.totalPages}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handlePageChange(coursesPagination.page - 1, 'courses')} disabled={coursesPagination.page === 1} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: coursesPagination.page === 1 ? 'not-allowed' : 'pointer', background: coursesPagination.page === 1 ? '#f3f4f6' : 'white' }}>Previous</button>
                    <button onClick={() => handlePageChange(coursesPagination.page + 1, 'courses')} disabled={coursesPagination.page === coursesPagination.totalPages} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: coursesPagination.page === coursesPagination.totalPages ? 'not-allowed' : 'pointer', background: coursesPagination.page === coursesPagination.totalPages ? '#f3f4f6' : 'white' }}>Next</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'categories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>📁 Categories</h2>
              <button
                onClick={() => setShowCreateCategoryModal(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#dc2626',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ➕ Add New Category
              </button>
            </div>

            <form onSubmit={handleCategorySearch} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Search categories..."
                value={categorySearchTerm}
                onChange={(e) => setCategorySearchTerm(e.target.value)}
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
              />
              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#dc2626', color: 'white', borderRadius: '0.5rem', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Search</button>
            </form>

            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              {categoriesLoading && <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading categories...</div>}
              
              {!categoriesLoading && categories.map((category) => (
                <div key={category.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', background: category.color || '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                      {category.icon || '📁'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontWeight: '600', color: '#1f2937' }}>{category.name}</h3>
                        {category.isFeatured && <span style={{ padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: '600', background: '#fef3c7', color: '#854d0e' }}>FEATURED</span>}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{category.description || 'No description'}</p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>{category.courses.length} courses • {category.subcategories.length} subcategories</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', background: category.isActive ? '#dcfce7' : '#fef3c7', color: category.isActive ? '#166534' : '#854d0e' }}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditCategory(category)} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500', background: 'white' }}>Edit</button>
                      <button onClick={() => handleDeleteCategory(category.id)} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #fecaca', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500', background: '#fef2f2', color: '#991b1b' }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}

              {!categoriesLoading && categories.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No categories found</div>}
            </div>
          </div>
        )}

        {tab === 'discussions' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>💬 Discussions Moderation</h2>
            
            <form onSubmit={handleDiscussionSearch} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Search discussions..."
                value={discussionSearchTerm}
                onChange={(e) => setDiscussionSearchTerm(e.target.value)}
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
              />
              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#dc2626', color: 'white', borderRadius: '0.5rem', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Search</button>
            </form>

            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1fr 1fr 1.5fr', gap: '1rem', padding: '1rem', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>
                <div>Title</div>
                <div>User / Course</div>
                <div>Replies</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {discussionsLoading && <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading discussions...</div>}

              {!discussionsLoading && discussions.map((discussion) => (
                <div key={discussion.id} style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1fr 1fr 1.5fr', gap: '1rem', padding: '1rem', borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontWeight: '600', color: '#1f2937' }}>{discussion.title}</h3>
                      {discussion.isPinned && <span style={{ padding: '0.125rem 0.375rem', borderRadius: '9999px', fontSize: '0.625rem', fontWeight: '600', background: '#dbeafe', color: '#1e40af' }}>PINNED</span>}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>{discussion.content.substring(0, 80)}...</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#374151' }}>{discussion.user?.name || 'Unknown'}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{discussion.course?.title || 'General Discussion'}</p>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{discussion._count.replies}</div>
                  <div>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', background: discussion.isActive ? '#dcfce7' : '#fee2e2', color: discussion.isActive ? '#166534' : '#991b1b' }}>
                      {discussion.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEditDiscussion(discussion)} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500', background: 'white' }}>Edit</button>
                    <button onClick={() => handleDeleteDiscussion(discussion.id)} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #fecaca', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500', background: '#fef2f2', color: '#991b1b' }}>Delete</button>
                  </div>
                </div>
              ))}

              {!discussionsLoading && discussions.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No discussions found</div>}

              {!discussionsLoading && discussionsPagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Page {discussionsPagination.page} of {discussionsPagination.totalPages}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handlePageChange(discussionsPagination.page - 1, 'discussions')} disabled={discussionsPagination.page === 1} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: discussionsPagination.page === 1 ? 'not-allowed' : 'pointer', background: discussionsPagination.page === 1 ? '#f3f4f6' : 'white' }}>Previous</button>
                    <button onClick={() => handlePageChange(discussionsPagination.page + 1, 'discussions')} disabled={discussionsPagination.page === discussionsPagination.totalPages} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: discussionsPagination.page === discussionsPagination.totalPages ? 'not-allowed' : 'pointer', background: discussionsPagination.page === discussionsPagination.totalPages ? '#f3f4f6' : 'white' }}>Next</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>👥 All Users</h2>
            
            <form onSubmit={handleSearch} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
              />
              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#dc2626', color: 'white', borderRadius: '0.5rem', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Search</button>
            </form>

            <div style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr 1.5fr', gap: '1rem', padding: '1rem', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontWeight: '600', fontSize: '0.875rem', color: '#374151' }}>
                <div>Name</div>
                <div>Email</div>
                <div>Role</div>
                <div>Status</div>
                <div>Joined</div>
                <div>Actions</div>
              </div>

              {usersLoading && <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading users...</div>}

              {!usersLoading && users.map((userItem) => (
                <div key={userItem.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr 1.5fr', gap: '1rem', padding: '1rem', borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '0.875rem' }}>
                      {(userItem.name || userItem.email).charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>{userItem.name || 'N/A'}</span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{userItem.email}</div>
                  <div>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', background: userItem.role === 'ADMIN' || userItem.role === 'SUPER_ADMIN' ? '#fee2e2' : '#dcfce7', color: userItem.role === 'ADMIN' || userItem.role === 'SUPER_ADMIN' ? '#991b1b' : '#166534' }}>
                      {userItem.role}
                    </span>
                  </div>
                  <div>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', background: userItem.isActive ? '#dcfce7' : '#fef3c7', color: userItem.isActive ? '#166534' : '#854d0e' }}>
                      {userItem.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{formatDate(userItem.createdAt)}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEditUser(userItem)} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500', background: 'white' }}>Edit</button>
                    <button onClick={() => handleDeleteUser(userItem.id)} style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #fecaca', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500', background: '#fef2f2', color: '#991b1b' }}>Delete</button>
                  </div>
                </div>
              ))}

              {!usersLoading && users.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No users found</div>}

              {!usersLoading && usersPagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Page {usersPagination.page} of {usersPagination.totalPages}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handlePageChange(usersPagination.page - 1, 'users')} disabled={usersPagination.page === 1} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: usersPagination.page === 1 ? 'not-allowed' : 'pointer', background: usersPagination.page === 1 ? '#f3f4f6' : 'white' }}>Previous</button>
                    <button onClick={() => handlePageChange(usersPagination.page + 1, 'users')} disabled={usersPagination.page === usersPagination.totalPages} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: usersPagination.page === usersPagination.totalPages ? 'not-allowed' : 'pointer', background: usersPagination.page === usersPagination.totalPages ? '#f3f4f6' : 'white' }}>Next</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div>
            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>⚙️ Platform Settings</h1>
                  <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Configure your platform settings and preferences</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handleResetSettings}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'white',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    🔄 Reset Defaults
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    disabled={settingsSaving || !editedSettings}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: settingsSaving ? '#9ca3af' : '#dc2626',
                      color: 'white',
                      borderRadius: '0.5rem',
                      border: 'none',
                      fontWeight: '600',
                      cursor: settingsSaving ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    {settingsSaving ? 'Saving...' : '💾 Save Changes'}
                  </button>
                </div>
              </div>
              
              {settingsMessage && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '0.5rem',
                  background: settingsMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: settingsMessage.type === 'success' ? '#166534' : '#991b1b',
                  fontSize: '0.875rem'
                }}>
                  {settingsMessage.text}
                </div>
              )}
            </div>

            {settingsLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading settings...</div>
            ) : editedSettings ? (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* General Settings */}
                <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>🏢 General Settings</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Site Name</label>
                      <input 
                        type="text" 
                        value={editedSettings.siteName} 
                        onChange={(e) => setEditedSettings({ ...editedSettings, siteName: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Site URL</label>
                      <input 
                        type="url" 
                        value={editedSettings.siteUrl} 
                        onChange={(e) => setEditedSettings({ ...editedSettings, siteUrl: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Site Description</label>
                      <textarea 
                        value={editedSettings.siteDescription} 
                        onChange={(e) => setEditedSettings({ ...editedSettings, siteDescription: e.target.value })}
                        rows={2}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem', resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Feature Flags */}
                <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>🔧 Feature Flags</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {[
                      { key: 'maintenanceMode', label: 'Maintenance Mode', description: 'Site under maintenance' },
                      { key: 'allowRegistration', label: 'Allow Registration', description: 'New users can register' },
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Send email notifications' },
                      { key: 'pushNotifications', label: 'Push Notifications', description: 'Enable push notifications' }
                    ].map(item => (
                      <label key={item.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={editedSettings[item.key as keyof PlatformSettings] as boolean}
                          onChange={(e) => setEditedSettings({ ...editedSettings, [item.key]: e.target.checked })}
                          style={{ marginTop: '0.125rem' }}
                        />
                        <div>
                          <span style={{ fontWeight: '500', color: '#1f2937', display: 'block' }}>{item.label}</span>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Business Settings */}
                <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>💰 Business Settings</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Default Currency</label>
                      <select 
                        value={editedSettings.defaultCurrency}
                        onChange={(e) => setEditedSettings({ ...editedSettings, defaultCurrency: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      >
                        <option value="INR">INR (Indian Rupee)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Platform Fee (%)</label>
                      <input 
                        type="number" 
                        value={editedSettings.platformFee}
                        onChange={(e) => setEditedSettings({ ...editedSettings, platformFee: parseFloat(e.target.value) })}
                        min="0"
                        max="100"
                        step="0.1"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Tax Rate (%)</label>
                      <input 
                        type="number" 
                        value={editedSettings.taxRate}
                        onChange={(e) => setEditedSettings({ ...editedSettings, taxRate: parseFloat(e.target.value) })}
                        min="0"
                        max="100"
                        step="0.1"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Max Upload Size (MB)</label>
                      <input 
                        type="number" 
                        value={editedSettings.maxUploadSize}
                        onChange={(e) => setEditedSettings({ ...editedSettings, maxUploadSize: parseInt(e.target.value) })}
                        min="1"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>🔒 Security Settings</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Min Password Length</label>
                      <input 
                        type="number" 
                        value={editedSettings.passwordMinLength}
                        onChange={(e) => setEditedSettings({ ...editedSettings, passwordMinLength: parseInt(e.target.value) })}
                        min="6"
                        max="32"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Session Timeout (hours)</label>
                      <input 
                        type="number" 
                        value={editedSettings.sessionTimeout}
                        onChange={(e) => setEditedSettings({ ...editedSettings, sessionTimeout: parseInt(e.target.value) })}
                        min="1"
                        max="168"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={editedSettings.twoFactorRequired}
                          onChange={(e) => setEditedSettings({ ...editedSettings, twoFactorRequired: e.target.checked })}
                        />
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Require 2FA</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Contact & Social */}
                <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>📞 Contact & Social</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Support Email</label>
                      <input 
                        type="email" 
                        value={editedSettings.supportEmail}
                        onChange={(e) => setEditedSettings({ ...editedSettings, supportEmail: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Contact Phone</label>
                      <input 
                        type="text" 
                        value={editedSettings.contactPhone}
                        onChange={(e) => setEditedSettings({ ...editedSettings, contactPhone: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Facebook URL</label>
                      <input 
                        type="url" 
                        value={editedSettings.facebookUrl}
                        onChange={(e) => setEditedSettings({ ...editedSettings, facebookUrl: e.target.value })}
                        placeholder="https://facebook.com/..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Twitter URL</label>
                      <input 
                        type="url" 
                        value={editedSettings.twitterUrl}
                        onChange={(e) => setEditedSettings({ ...editedSettings, twitterUrl: e.target.value })}
                        placeholder="https://twitter.com/..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>YouTube URL</label>
                      <input 
                        type="url" 
                        value={editedSettings.youtubeUrl}
                        onChange={(e) => setEditedSettings({ ...editedSettings, youtubeUrl: e.target.value })}
                        placeholder="https://youtube.com/..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>LinkedIn URL</label>
                      <input 
                        type="url" 
                        value={editedSettings.linkedinUrl}
                        onChange={(e) => setEditedSettings({ ...editedSettings, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Analytics */}
                <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>📊 Analytics</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Google Analytics ID</label>
                      <input 
                        type="text" 
                        value={editedSettings.googleAnalyticsId}
                        onChange={(e) => setEditedSettings({ ...editedSettings, googleAnalyticsId: e.target.value })}
                        placeholder="G-XXXXXXXXXX"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Facebook Pixel ID</label>
                      <input 
                        type="text" 
                        value={editedSettings.facebookPixelId}
                        onChange={(e) => setEditedSettings({ ...editedSettings, facebookPixelId: e.target.value })}
                        placeholder="XXXXXXXXXXXXXX"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Failed to load settings</div>
            )}
          </div>
        )}

      </div>

      {/* Modals - Edit User, Edit Course, Edit Category, Edit Discussion, Create Course, Create Category */}
      {showEditModal && editingUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '500px', width: '90%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Edit User</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Name</label>
                <input type="text" value={editingUser.name || ''} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Email</label>
                <input type="email" value={editingUser.email} disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem', background: '#f3f4f6' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Status</label>
                <select value={editingUser.isActive ? 'active' : 'inactive'} onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.value === 'active' })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowEditModal(false); setEditingUser(null) }} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: '600', background: 'white' }}>Cancel</button>
              <button onClick={handleSaveUser} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600', background: '#dc2626', color: 'white' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {showCourseModal && editingCourse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '600px', width: '90%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Edit Course</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Title</label>
                <input type="text" value={editingCourse.title} onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Description</label>
                <textarea value={editingCourse.description} onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })} rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Difficulty</label>
                  <select value={editingCourse.difficulty} onChange={(e) => setEditingCourse({ ...editingCourse, difficulty: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Duration (min)</label>
                  <input type="number" value={editingCourse.duration} onChange={(e) => setEditingCourse({ ...editingCourse, duration: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Status</label>
                <select value={editingCourse.isActive ? 'active' : 'inactive'} onChange={(e) => setEditingCourse({ ...editingCourse, isActive: e.target.value === 'active' })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowCourseModal(false); setEditingCourse(null) }} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: '600', background: 'white' }}>Cancel</button>
              <button onClick={handleSaveCourse} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600', background: '#dc2626', color: 'white' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && editingCategory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '500px', width: '90%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Edit Category</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Name</label>
                <input type="text" value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Description</label>
                <textarea value={editingCategory.description || ''} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Icon (emoji)</label>
                  <input type="text" value={editingCategory.icon || ''} onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Color</label>
                  <input type="color" value={editingCategory.color || '#3b82f6'} onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })} style={{ width: '100%', height: '42px', borderRadius: '0.5rem', border: '1px solid #d1d5db' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={editingCategory.isActive} onChange={(e) => setEditingCategory({ ...editingCategory, isActive: e.target.checked })} />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>Active</span>
                  </label>
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={editingCategory.isFeatured} onChange={(e) => setEditingCategory({ ...editingCategory, isFeatured: e.target.checked })} />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>Featured</span>
                  </label>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowCategoryModal(false); setEditingCategory(null) }} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: '600', background: 'white' }}>Cancel</button>
              <button onClick={handleSaveCategory} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600', background: '#dc2626', color: 'white' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {showDiscussionModal && editingDiscussion && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '500px', width: '90%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Edit Discussion</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Title</label>
                <input type="text" value={editingDiscussion.title} disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem', background: '#f3f4f6' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Content Preview</label>
                <div style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', background: '#f9fafb', maxHeight: 100, overflow: 'auto' }}>{editingDiscussion.content.substring(0, 200)}...</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={editingDiscussion.isActive} onChange={(e) => setEditingDiscussion({ ...editingDiscussion, isActive: e.target.checked })} />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>Visible</span>
                  </label>
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={editingDiscussion.isPinned} onChange={(e) => setEditingDiscussion({ ...editingDiscussion, isPinned: e.target.checked })} />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>Pinned</span>
                  </label>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowDiscussionModal(false); setEditingDiscussion(null) }} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: '600', background: 'white' }}>Cancel</button>
              <button onClick={handleSaveDiscussion} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600', background: '#dc2626', color: 'white' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '600px', width: '90%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Create New Course</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Title *</label>
                <input type="text" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="Enter course title" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Description *</label>
                <textarea value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} rows={3} placeholder="Enter course description" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Difficulty</label>
                  <select value={newCourse.difficulty} onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Duration (min) *</label>
                  <input type="number" value={newCourse.duration} onChange={(e) => setNewCourse({ ...newCourse, duration: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Instructor *</label>
                  <select value={newCourse.instructorId} onChange={(e) => setNewCourse({ ...newCourse, instructorId: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}>
                    <option value="">Select instructor</option>
                    {instructors.map((instructor) => (<option key={instructor.id} value={instructor.id}>{instructor.name}</option>))}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowCreateModal(false); setNewCourse({ title: '', description: '', difficulty: 'BEGINNER', duration: 60, instructorId: '', thumbnail: '' }) }} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: '600', background: 'white' }}>Cancel</button>
              <button onClick={handleCreateCourse} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600', background: '#dc2626', color: 'white' }}>Create Course</button>
            </div>
          </div>
        </div>
      )}

      {showCreateCategoryModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '500px', width: '90%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Create New Category</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Name *</label>
                <input type="text" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} placeholder="Category name" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Description</label>
                <textarea value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} rows={2} placeholder="Category description" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Icon (emoji)</label>
                  <input type="text" value={newCategory.icon} onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })} placeholder="📁" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Color</label>
                  <input type="color" value={newCategory.color} onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })} style={{ width: '100%', height: '42px', borderRadius: '0.5rem', border: '1px solid #d1d5db' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={newCategory.isFeatured} onChange={(e) => setNewCategory({ ...newCategory, isFeatured: e.target.checked })} />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>Featured Category</span>
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowCreateCategoryModal(false); setNewCategory({ name: '', description: '', icon: '', color: '#3b82f6', isFeatured: false }) }} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: '600', background: 'white' }}>Cancel</button>
              <button onClick={handleCreateCategory} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600', background: '#dc2626', color: 'white' }}>Create Category</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
