"use client"

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { NewNavigation } from '@/components/new-navigation'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  isFeatured: boolean
  subcategories?: Array<{
    id: string
    name: string
    slug: string
  }>
}

interface Instructor {
  id: string
  name: string
  title: string | null
  avatar: string | null
  expertise: string
}

interface LearningPath {
  id: string
  title: string
  color: string
  icon: string
}

interface Pricing {
  type: string
  price: number
  currency: string
  period: string
  description: string
}

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: number
  instructor: Instructor
  learningPath: LearningPath | null
  lessonCount: number
  assessmentCount: number
  createdAt: string
  pricing: Pricing
  source?: 'database' | 'static'
  vertical?: string
  category?: string
  tags?: string[]
  classId?: string | null
  className?: string | null
  classLevel?: 'PRIMARY' | 'MIDDLE' | 'SECONDARY' | 'SENIOR_SECONDARY' | null
}

interface CoursesResponse {
  success: boolean
  courses: Course[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// List of major Indian universities for filtering
const INDIAN_UNIVERSITIES = [
  { id: 'du', name: 'Delhi University (DU)', state: 'Delhi' },
  { id: 'mdu', name: 'Mumbai University (MU)', state: 'Maharashtra' },
  { id: 'jnu', name: 'Jawaharlal Nehru University (JNU)', state: 'Delhi' },
  { id: 'cu', name: 'Calcutta University (CU)', state: 'West Bengal' },
  { id: 'pu', name: 'Punjab University (PU)', state: 'Punjab' },
  { id: 'osmania', name: 'Osmania University', state: 'Telangana' },
  { id: 'bangalore', name: 'Bangalore University', state: 'Karnataka' },
  { id: 'anna', name: 'Anna University', state: 'Tamil Nadu' },
  { id: 'gu', name: 'Gujarat University', state: 'Gujarat' },
  { id: 'rajasthan', name: 'Rajasthan University', state: 'Rajasthan' },
  { id: 'lucknow', name: 'Lucknow University', state: 'Uttar Pradesh' },
  { id: 'bhu', name: 'Banaras Hindu University (BHU)', state: 'Uttar Pradesh' },
  { id: 'hydrabad', name: 'Hyderabad University', state: 'Telangana' },
  { id: 'aligarh', name: 'Aligarh Muslim University (AMU)', state: 'Uttar Pradesh' },
  { id: 'srm', name: 'SRM University', state: 'Tamil Nadu' },
  { id: 'vit', name: 'VIT University', state: 'Tamil Nadu' },
  { id: 'manipal', name: 'Manipal University', state: 'Karnataka' },
  { id: 'other', name: 'Other University', state: 'Other' },
]

// School learning path IDs for identification
const SCHOOL_LEARNING_PATH_IDS = [
  'primary-school',
  'middle-school',
  'high-school',
  'senior-secondary'
]

// College learning path IDs for identification
const COLLEGE_LEARNING_PATH_IDS = [
  'engineering-foundation',
  'medical-foundation',
  'business-foundation',
  'arts-foundation'
]

// Vertical identifiers for static courses
const SCHOOL_VERTICALS = ['school']
const COLLEGE_VERTICALS = ['college']
const PG_VERTICALS = ['pg']
const PROFESSIONAL_VERTICALS = ['professional']
const EXAMS_VERTICALS = ['exams']
const CITIZEN_VERTICALS = ['citizen']

// Sub-filters for each vertical - matches the new taxonomy structure
const SUB_FILTERS = {
  school: [
    { id: 'all', name: 'All School', icon: '📚' },
    { id: 'primary-school', name: 'Primary (1-5)', icon: '🧒' },
    { id: 'middle-school', name: 'Middle (6-8)', icon: '📖' },
    { id: 'secondary-school', name: 'Secondary (9-10)', icon: '📐' },
    { id: 'senior-secondary', name: 'Senior Secondary (11-12)', icon: '🎯' }
  ],
  college: [
    { id: 'all', name: 'All College', icon: '🎓' },
    { id: 'arts-humanities', name: 'Arts & Humanities', icon: '📚' },
    { id: 'commerce-business', name: 'Commerce & Business', icon: '📊' },
    { id: 'engineering-technology', name: 'Engineering & Technology', icon: '⚙️' },
    { id: 'medical-sciences', name: 'Medical Sciences', icon: '🔬' }
  ],
  pg: [
    { id: 'all', name: 'All PG', icon: '🎓' },
    { id: 'mba', name: 'Management (MBA)', icon: '💼' },
    { id: 'mcom', name: 'Commerce', icon: '📈' },
    { id: 'msc-mca', name: 'Technology & Science', icon: '🔬' },
    { id: 'ma-llm', name: 'Economics & Law', icon: '⚖️' }
  ],
  professional: [
    { id: 'all', name: 'All Professional', icon: '💼' },
    { id: 'technology-programming', name: 'Technology & Programming', icon: '💻' },
    { id: 'business-entrepreneurship', name: 'Business & Entrepreneurship', icon: '📊' },
    { id: 'design-creative', name: 'Design & Creative', icon: '🎨' },
    { id: 'marketing-communication', name: 'Marketing & Communication', icon: '📢' },
    { id: 'workplace-life-skills', name: 'Workplace & Life Skills', icon: '👔' }
  ],
  exams: [
    { id: 'all', name: 'All Exams', icon: '📋' },
    { id: 'professional-certifications', name: 'Professional Certifications', icon: '📜' },
    { id: 'government-exams', name: 'Government & Entrance Exams', icon: '🏛️' }
  ],
  citizen: [
    { id: 'all', name: 'All Citizen', icon: '🧠' },
    { id: 'personal-finance', name: 'Personal Finance Basics', icon: '💰' },
    { id: 'digital-literacy', name: 'Digital Literacy', icon: '💻' },
    { id: 'community-systems', name: 'Community Systems', icon: '👥' }
  ]
}

// Vertical display configuration with icons
const VERTICAL_CONFIG = {
  all: { name: 'All Courses', icon: '', color: '#111827', bg: 'white' },
  school: { name: '🏫 School Education (Class 1-12)', icon: '🏫', color: '#1e40af', bg: '#dbeafe' },
  college: { name: '🎓 College (UG)', icon: '🎓', color: '#92400e', bg: '#fef3c7' },
  pg: { name: '🎓 Post-Graduate (PG)', icon: '🎓', color: '#5b21b6', bg: '#ede9fe' },
  professional: { name: '💼 Professional / Career Skills', icon: '💼', color: '#15803d', bg: '#dcfce7' },
  exams: { name: '📋 Competitive Exams & Certifications', icon: '📋', color: '#b91c1c', bg: '#fee2e2' },
  citizen: { name: '🧠 Citizen & Life Systems', icon: '🧠', color: '#0891b2', bg: '#cffafe' }
}

export default function CoursesPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedUniversity, setSelectedUniversity] = useState('')
  const [activeVertical, setActiveVertical] = useState('all')
  const [activeSubFilter, setActiveSubFilter] = useState('all')
  const [categories, setCategories] = useState<Category[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check URL params for initial filter state
  useEffect(() => {
    const filter = searchParams.get('filter')
    if (['school', 'college', 'pg', 'professional', 'exams', 'citizen'].includes(filter || '')) {
      setActiveVertical(filter || 'all')
    }
  }, [searchParams])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }
    fetchCategories()
  }, [])

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (selectedCategory) params.set('categoryId', selectedCategory)
        if (selectedDifficulty) params.set('difficulty', selectedDifficulty)
        if (activeVertical !== 'all') params.set('vertical', activeVertical)
        params.set('limit', '500')

        const response = await fetch(`/api/courses?${params.toString()}`)
        if (response.ok) {
          const data: CoursesResponse = await response.json()
          setCourses(data.courses)
        } else {
          setError('Failed to load courses')
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err)
        setError('Failed to load courses')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [activeVertical, selectedCategory, selectedDifficulty])

  const filteredCourses = useMemo(() => {
    let result = courses

    // Filter by search term (client-side search)
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(course =>
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term) ||
        (course.instructor.name && course.instructor.name.toLowerCase().includes(term)) ||
        (course.tags && course.tags.some(tag => tag.toLowerCase().includes(term)))
      )
    }

    // Filter by sub-category if not 'all'
    if (activeSubFilter !== 'all') {
      result = result.filter(course => {
        // For ALL courses (database + static), check learningPath first
        // This is what the UI uses to display badges like "Star Senior Secondary", "Award High School", etc.
        if (course.learningPath && course.learningPath.id) {
          const learningPathMapping: Record<string, string[]> = {
            // School sub-filters (using new taxonomy IDs)
            'primary-school': ['primary', 'primary-school', 'class1', 'class2', 'class3', 'class4', 'class5'],
            'middle-school': ['middle', 'middle-school', 'class6', 'class7', 'class8'],
            'secondary-school': ['secondary', 'secondary-school', 'high-school', 'class9', 'class10'],
            'senior-secondary': ['senior', 'senior-secondary', 'class11', 'class12'],
            // College sub-filters (new taxonomy)
            'arts-humanities': ['arts', 'humanities', 'communication', 'philosophy', 'art', 'literature', 'history'],
            'commerce-business': ['commerce', 'business', 'accounting', 'economics', 'statistics', 'marketing', 'bcom', 'bba'],
            'engineering-technology': ['engineering', 'technology', 'programming', 'mathematics', 'physics', 'electronics', 'btech'],
            'medical-sciences': ['medical', 'medicine', 'anatomy', 'physiology', 'biochemistry', 'research', 'bsc'],
            // PG sub-filters (new taxonomy)
            'mba': ['mba', 'master-of-business-administration', 'mba-finance', 'mba-marketing', 'mba-hr', 'mba-operations'],
            'mcom': ['mcom', 'master-of-commerce', 'mcom-accounting', 'mcom-finance', 'mcom-business', 'mcom-taxation'],
            'msc-mca': ['msc', 'm.sc', 'master-of-science', 'pg-msc', 'mca', 'master-of-computer-applications', 'pg-mca'],
            'ma-llm': ['ma', 'm.a', 'master-of-arts', 'pg-ma', 'llm', 'l.l.m', 'master-of-laws', 'pg-llm'],
            // Professional sub-filters (new taxonomy)
            'technology-programming': ['technology', 'programming', 'web-development', 'python', 'javascript', 'react', 'nodejs', 'coding', 'mobile', 'fullstack'],
            'business-entrepreneurship': ['business', 'entrepreneurship', 'startup', 'strategy', 'management', 'project-management', 'financial-management'],
            'design-creative': ['design', 'ui', 'ux', 'figma', 'graphic-design', 'ui-ux', 'photography', 'video-editing', 'art'],
            'marketing-communication': ['marketing', 'digital-marketing', 'seo', 'social-media', 'advertising', 'brand', 'public-speaking', 'communication'],
            'workplace-life-skills': ['career', 'resume', 'interview', 'job-prep', 'professional-development', 'excel', 'english', 'cyber-safety', 'mental-health', 'fitness', 'nutrition'],
            // Exams sub-filters (new taxonomy)
            'professional-certifications': ['certification', 'ca', 'chartered-accountancy', 'ca-foundation', 'ca-intermediate', 'ca-final', 'cs', 'company-secretary', 'cma', 'cfa', 'frm', 'acca', 'actuarial'],
            'government-exams': ['upsc', 'civil-services', 'ias', 'ssc', 'cgl', 'chsl', 'mts', 'police', 'state-police', 'tet', 'teaching', 'defense', 'nda', 'cds'],
            // Citizen sub-filters (new taxonomy)
            'personal-finance': ['personal-finance', 'finance', 'tax', 'insurance', 'investment', 'stock', 'mutual-fund', 'money'],
            'digital-literacy': ['digital', 'upi', 'banking', 'government-portal', 'certificate', 'online-safety', 'fraud'],
            'community-systems': ['community', 'food-work', 'bulk-buying', 'work-model']
          }
          
          const learningPathMappingValues = learningPathMapping[activeSubFilter] || []
          if (learningPathMappingValues.length > 0) {
            const learningPathId = course.learningPath.id.toLowerCase()
            const matches = learningPathMappingValues.some(m => learningPathId.includes(m.toLowerCase()))
            if (matches) return true
          }
        }
        
        // Fallback: check tags for static courses
        const tagMapping: Record<string, string[]> = {
          // School sub-filters (new taxonomy)
          'primary-school': ['primary', 'primary-school', 'class1', 'class2', 'class3', 'class4', 'class5', 'english-grammar', 'mathematics-primary', 'science-fundamentals'],
          'middle-school': ['middle', 'middle-school', 'class6', 'class7', 'class8', 'mathematics-middle', 'science-middle', 'english-literature'],
          'secondary-school': ['secondary', 'secondary-school', 'class9', 'class10', 'mathematics-secondary', 'physics-secondary', 'chemistry-secondary', 'biology-secondary'],
          'senior-secondary': ['senior', 'senior-secondary', 'class11', 'class12', 'physics-senior', 'chemistry-senior', 'biology-senior', 'advanced-mathematics'],
          // College sub-filters (new taxonomy)
          'arts-humanities': ['arts-humanities', 'communication-skills', 'philosophy-basics', 'history-of-art', 'world-literature'],
          'commerce-business': ['commerce-business', 'accounting-principles', 'business-economics', 'business-statistics', 'marketing-fundamentals', 'bcom-financial-accounting'],
          'engineering-technology': ['engineering-technology', 'programming-fundamentals', 'engineering-mathematics', 'engineering-physics', 'digital-electronics'],
          'medical-sciences': ['medical-sciences', 'human-anatomy', 'physiology', 'biochemistry', 'medical-research'],
          // PG sub-filters (new taxonomy)
          'mba': ['mba', 'mba-finance', 'mba-marketing', 'mba-hr'],
          'mcom': ['mcom', 'mcom-accounting', 'mcom-taxation'],
          'msc-mca': ['msc', 'msc-data-science', 'msc-cyber-security', 'mca', 'mca-cloud'],
          'ma-llm': ['ma', 'ma-economics', 'llm', 'llm-corporate', 'llm-ip'],
          // Professional sub-filters (new taxonomy)
          'technology-programming': ['technology-programming', 'python-programming', 'web-development', 'fullstack-development', 'mobile-development', 'data-science-fundamentals'],
          'business-entrepreneurship': ['business-entrepreneurship', 'entrepreneurship-essentials', 'business-strategy', 'project-management', 'financial-management', 'startup-foundation'],
          'design-creative': ['design-creative', 'ui-ux-design', 'graphic-design', 'photography', 'video-editing'],
          'marketing-communication': ['marketing-communication', 'digital-marketing', 'social-media', 'brand-strategy', 'public-speaking'],
          'workplace-life-skills': ['workplace-life-skills', 'advanced-excel', 'english-communication', 'job-preparation', 'cyber-safety', 'mental-health', 'fitness-nutrition'],
          // Exams sub-filters (new taxonomy)
          'professional-certifications': ['professional-certifications', 'ca', 'cs', 'cma', 'cfa', 'frm', 'acca', 'actuarial-science', 'ca-foundation', 'ca-intermediate', 'ca-final'],
          'government-exams': ['government-exams', 'upsc', 'ssc', 'state-police', 'tet', 'upsc-prelims', 'upsc-mains', 'ssc-cgl', 'ssc-chsl'],
          // Citizen sub-filters (new taxonomy)
          'personal-finance': ['personal-finance', 'tax-planning', 'stock-market'],
          'digital-literacy': ['digital-literacy', 'digital-money-banking', 'government-portals', 'online-safety'],
          'community-systems': ['community-systems', 'food-work', 'community-buying']
        }
        
        const mapping = tagMapping[activeSubFilter] || []
        if (mapping.length === 0) return false
        
        return course.tags && course.tags.some(tag => 
          mapping.some(m => tag.toLowerCase().includes(m.toLowerCase()))
        )
      })
    }

    return result
  }, [courses, searchTerm, activeSubFilter])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'BEGINNER': return { bg: '#dcfce7', text: '#16a34a' }
      case 'INTERMEDIATE': return { bg: '#fef3c7', text: '#d97706' }
      case 'ADVANCED': return { bg: '#fee2e2', text: '#dc2626' }
      default: return { bg: '#f3f4f6', text: '#6b7280' }
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  // Check if a course is from a specific vertical
  const isSchoolCourse = (course: Course) => {
    return (
      (course.learningPath && SCHOOL_LEARNING_PATH_IDS.includes(course.learningPath.id)) ||
      (course.source === 'static' && course.vertical && SCHOOL_VERTICALS.includes(course.vertical))
    )
  }

  const isCollegeCourse = (course: Course) => {
    return (
      (course.learningPath && COLLEGE_LEARNING_PATH_IDS.includes(course.learningPath.id)) ||
      (course.source === 'static' && course.vertical && COLLEGE_VERTICALS.includes(course.vertical))
    )
  }

  const isPGCourse = (course: Course) => {
    return (
      course.source === 'static' && course.vertical && PG_VERTICALS.includes(course.vertical)
    )
  }

  const isProfessionalCourse = (course: Course) => {
    return (
      course.source === 'static' && course.vertical && PROFESSIONAL_VERTICALS.includes(course.vertical)
    )
  }

  const isExamsCourse = (course: Course) => {
    return (
      course.source === 'static' && course.vertical && EXAMS_VERTICALS.includes(course.vertical)
    )
  }

  const isCitizenCourse = (course: Course) => {
    return (
      course.source === 'static' && course.vertical && CITIZEN_VERTICALS.includes(course.vertical)
    )
  }

  // Get current sub-filters based on active vertical
  const getCurrentSubFilters = () => {
    return SUB_FILTERS[activeVertical as keyof typeof SUB_FILTERS] || []
  }

  // Get vertical badge info
  const getVerticalBadge = (course: Course) => {
    if (isPGCourse(course)) return { text: '🎓 PG', bg: '#7c3aed' }
    if (isCollegeCourse(course)) return { text: '🎓 College', bg: '#f59e0b' }
    if (isSchoolCourse(course)) return { text: '🏫 School', bg: '#2563eb' }
    if (isProfessionalCourse(course)) return { text: '💼 Professional', bg: '#15803d' }
    if (isExamsCourse(course)) return { text: '📋 Exams', bg: '#b91c1c' }
    if (isCitizenCourse(course)) return { text: '🧠 Citizen', bg: '#0891b2' }
    return null
  }

  // Get thumbnail path
  const getThumbnailPath = (courseId: string, currentThumbnail: string | null) => {
    if (currentThumbnail && (currentThumbnail.startsWith('/assets/') || currentThumbnail.startsWith('/images/'))) {
      return currentThumbnail
    }
    
    const thumbnailMap: Record<string, string> = {
      // School courses
      'school1': '/assets/courses/school-primary-math.svg',
      'school2': '/assets/courses/school-primary-english.svg',
      'school3': '/assets/courses/school-primary-math.svg',
      'school4': '/assets/courses/school-primary-science.svg',
      'school5': '/assets/courses/school-primary-math.svg',
      'school6': '/assets/courses/school-primary-english.svg',
      'school7': '/assets/courses/school-primary-math.svg',
      'school8': '/assets/courses/school-primary-science.svg',
      'school9': '/assets/courses/school-middle-math.svg',
      'school10': '/assets/courses/school-middle-science.svg',
      'school11': '/assets/courses/school-middle-english.svg',
      'school12': '/assets/courses/school-middle-math.svg',
      'school13': '/assets/courses/school-middle-science.svg',
      'school14': '/assets/courses/school-secondary-math.svg',
      'school15': '/assets/courses/school-secondary-physics.svg',
      'school16': '/assets/courses/school-secondary-chemistry.svg',
      'school17': '/assets/courses/school-secondary-biology.svg',
      'school18': '/assets/courses/school-secondary-math.svg',
      'school19': '/assets/courses/school-senior-math.svg',
      'school20': '/assets/courses/school-senior-physics.svg',
      'school21': '/assets/courses/school-senior-chemistry.svg',
      'school22': '/assets/courses/school-senior-biology.svg',
      
      // College courses
      'college1': '/assets/courses/college-engineering-math.svg',
      'college2': '/assets/courses/college-programming.svg',
      'college3': '/assets/courses/college-engineering-physics.svg',
      'college4': '/assets/courses/college-digital-electronics.svg',
      'college5': '/assets/courses/college-human-anatomy.svg',
      'college6': '/assets/courses/college-biochemistry.svg',
      'college7': '/assets/courses/college-physiology.svg',
      'college8': '/assets/courses/college-medical-research.svg',
      'college9': '/assets/courses/college-business-economics.svg',
      'college10': '/assets/courses/college-accounting.svg',
      'college11': '/assets/courses/college-business-stats.svg',
      'college12': '/assets/courses/college-marketing.svg',
      'college13': '/assets/courses/college-world-literature.svg',
      'college14': '/assets/courses/college-philosophy.svg',
      'college15': '/assets/courses/college-art-history.svg',
      'college16': '/assets/courses/college-communication.svg',
      'college_bsc_pcm': '/assets/courses/college-bsc-pcm.svg',
      'college_bsc_pcb': '/assets/courses/college-bsc-pcb.svg',
      'college_bsc_cs': '/assets/courses/college-bsc-cs.svg',
      'college_bsc_bio': '/assets/courses/college-bsc-biotech.svg',
      'college_bsc_stats': '/assets/courses/college-bsc-stats.svg',
      'college_bcom': '/assets/courses/college-bcom.svg',
      'college_bba': '/assets/courses/college-bba.svg',
      'college_ba_history': '/assets/courses/college-ba-history.svg',
      'college_ba_polsc': '/assets/courses/college-ba-polsc.svg',
      'college_ba_psychology': '/assets/courses/college-ba-psychology.svg',
      'college_btech_cs': '/assets/courses/college-btech-cs.svg',
      'college_llb': '/assets/courses/college-llb.svg',
      'college_semester_support': '/assets/courses/college-semester-support.svg',
      'college_exam_prep': '/assets/courses/college-exam-prep.svg',
      'college_career_skills': '/assets/courses/college-career-skills.svg',
      
      // PG courses
      'pg_mba_finance': '/assets/courses/pg-mba-finance.svg',
      'pg_mba_marketing': '/assets/courses/pg-mba-marketing.svg',
      'pg_mba_hr': '/assets/courses/pg-mba-hr.svg',
      'pg_mba_operations': '/assets/courses/pg-mba-operations.svg',
      'pg_mcom_accounting': '/assets/courses/pg-mcom-accounting.svg',
      'pg_mcom_finance': '/assets/courses/pg-mcom-finance.svg',
      'pg_mcom_business': '/assets/courses/pg-mcom-business.svg',
      'pg_msc_maths': '/assets/courses/pg-msc-maths.svg',
      'pg_msc_physics': '/assets/courses/pg-msc-physics.svg',
      'pg_msc_chemistry': '/assets/courses/pg-msc-chemistry.svg',
      'pg_msc_cs': '/assets/courses/pg-msc-cs.svg',
      'pg_msc_data_science': '/assets/courses/pg-msc-data-science.svg',
      'pg_mca': '/assets/courses/pg-mca.svg',
      'pg_ma_economics': '/assets/courses/pg-ma-economics.svg',
      'pg_ma_history': '/assets/courses/pg-ma-history.svg',
      'pg_ma_psychology': '/assets/courses/pg-ma-psychology.svg',
      'pg_ma_english': '/assets/courses/pg-ma-english.svg',
      'pg_llm_corporate': '/assets/courses/pg-llm-corporate.svg',
      'pg_llm_criminal': '/assets/courses/pg-llm-criminal.svg',
      'pg_llm_constitutional': '/assets/courses/pg-llm-constitutional.svg',
      'pg_net_prep': '/assets/courses/pg-net-prep.svg',
      'pg_gate_prep': '/assets/courses/pg-gate-prep.svg',
      'pg_career_guidance': '/assets/courses/pg-career-guidance.svg',
      
      // Career courses
      'career1': '/assets/courses/web-development-bootcamp.svg',
      'career2': '/assets/courses/python-masterclass.svg',
      'career3': '/assets/courses/data-science.svg',
      'career4': '/assets/courses/mobile-app.svg',
      'career5': '/assets/courses/business-strategy.svg',
      'career6': '/assets/courses/entrepreneurship.svg',
      'career7': '/assets/courses/financial-management.svg',
      'career8': '/assets/courses/project-management.svg',
      'career9': '/assets/courses/ui-ux-design.svg',
      'career10': '/assets/courses/graphic-design.svg',
      'career11': '/assets/courses/video-editing.svg',
      'career12': '/assets/courses/photography.svg',
      'career13': '/assets/courses/digital-marketing.svg',
      'career14': '/assets/courses/public-speaking.svg',
      'career15': '/assets/courses/social-media.svg',
      'career16': '/assets/courses/brand-strategy.svg',
      
      // Life skills
      'life1': '/assets/courses/personal-finance.svg',
      'life2': '/assets/courses/investment.svg',
      'life3': '/assets/courses/tax-planning.svg',
      'life4': '/assets/courses/nutrition.svg',
      'life5': '/assets/courses/fitness.svg',
      'life6': '/assets/courses/mental-health.svg',
      
      // Confusion Removers
      'cr_digital': '/assets/courses/cr_digital.svg',
      'cr_upi': '/assets/courses/cr_upi.svg',
      'cr_gov': '/assets/courses/cr_gov.svg',
      'cr_fraud': '/assets/courses/cr_fraud.svg',
      'cr_money': '/assets/courses/cr_money.svg',
      'cr_english': '/assets/courses/cr_english.svg',
      'cr_bulk': '/assets/courses/cr_bulk.svg',
      'cr_foodwork': '/assets/courses/cr_foodwork.svg',
      'cr_community': '/assets/courses/cr_community.svg',
      
      // Government exams
      'upsc_prelims': '/assets/courses/upsc-prelims.svg',
      'upsc_mains': '/assets/courses/upsc-mains.svg',
      'upsc_interview': '/assets/courses/upsc-interview.svg',
      'ssc_chsl': '/assets/courses/ssc-chsl.svg',
      'ssc_cgl': '/assets/courses/ssc-cgl.svg',
      'ssc_mts': '/assets/courses/ssc-mts.svg',
      'state_police': '/assets/courses/state-police.svg',
      'state_tet': '/assets/courses/tet.svg',
      
      // Stock market
      'stock-market-basics': '/assets/courses/stock-basics.svg',
      'options-trading-mastery': '/assets/courses/options-trading.svg',
      'technical-analysis-master': '/assets/courses/technical-analysis.svg',
      'mutual-funds-sip-mastery': '/assets/courses/mutual-funds.svg',
      
      // Professional certifications
      'course-ca-foundation': '/assets/courses/ca-foundation.svg',
      'course-ca-intermediate': '/assets/courses/ca-intermediate.svg',
      'course-ca-final': '/assets/courses/ca-final.svg',
      'cs_foundation': '/assets/courses/cs-foundation.svg',
      'cs_executive': '/assets/courses/cs-executive.svg',
      'cs_professional': '/assets/courses/cs-professional.svg',
      'cma_foundation': '/assets/courses/cma-foundation.svg',
      'cma_intermediate': '/assets/courses/cma-intermediate.svg',
      'cma_final': '/assets/courses/cma-final.svg',
      'cfa_level1': '/assets/courses/cfa-level1.svg',
      'cfa_level2': '/assets/courses/cfa-level2.svg',
      'cfa_level3': '/assets/courses/cfa-level3.svg',
      'frm_part1': '/assets/courses/frm-part1.svg',
      'frm_part2': '/assets/courses/frm-part2.svg',
      'acca_level1': '/assets/courses/acca-level1.svg',
      'acca_level2': '/assets/courses/acca-level2.svg',
      'acca_level3': '/assets/courses/acca-level3.svg',
      'course-actuarial-science': '/assets/courses/actuarial.svg',
      'advanced-excel-pro': '/assets/courses/excel.svg',
    }
    
    if (thumbnailMap[courseId]) {
      return thumbnailMap[courseId]
    }
    
    return currentThumbnail
  }

  // Calculate stats
  const totalCourses = filteredCourses.length
  const totalLessons = filteredCourses.reduce((sum, c) => sum + c.lessonCount, 0)
  const uniqueInstructors = new Set(filteredCourses.map(c => c.instructor.id)).size

  // Get current active filter for display
  const getActiveFilter = () => {
    return VERTICAL_CONFIG[activeVertical as keyof typeof VERTICAL_CONFIG]?.name || 'All Courses'
  }

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NewNavigation />

      <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#f9fafb' }}>
        {/* Header */}
        <div style={{ background: 'white', padding: '3rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>
                Explore Our Course Library
              </h1>
              <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
                Discover courses designed for Indian learners with practical skills and real-world applications.
              </p>
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.75rem 1.5rem', 
                background: '#ede9fe', 
                borderRadius: '0.5rem',
                display: 'inline-block'
              }}>
                <p style={{ color: '#5b21b6', fontSize: '0.9rem' }}>
                  🎓 <strong>New:</strong> Post-Graduate courses now available - MBA, M.Sc, M.Com, MCA, M.A., LL.M.!
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  Search
                </span>
                <input
                  type="text"
                  placeholder="Search courses, instructors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 3rem',
                    fontSize: '1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Level Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setActiveVertical('all')
                  setActiveSubFilter('all')
                }}
                style={{
                  padding: '0.625rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  border: 'none',
                  background: activeVertical === 'all' ? '#111827' : 'white',
                  color: activeVertical === 'all' ? 'white' : '#111827',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s'
                }}
              >
                All Courses
              </button>
              <button
                onClick={() => {
                  setActiveVertical('school')
                  setActiveSubFilter('all')
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  border: 'none',
                  background: activeVertical === 'school' ? '#2563eb' : 'white',
                  color: activeVertical === 'school' ? 'white' : '#1e40af',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s'
                }}
              >
                🏫 School
              </button>
              <button
                onClick={() => {
                  setActiveVertical('college')
                  setActiveSubFilter('all')
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  border: 'none',
                  background: activeVertical === 'college' ? '#ea580c' : 'white',
                  color: activeVertical === 'college' ? 'white' : '#92400e',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s'
                }}
              >
                🎓 College (UG)
              </button>
              <button
                onClick={() => {
                  setActiveVertical('pg')
                  setActiveSubFilter('all')
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  border: 'none',
                  background: activeVertical === 'pg' ? '#7c3aed' : 'white',
                  color: activeVertical === 'pg' ? 'white' : '#5b21b6',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s'
                }}
              >
                🎓 Post-Graduate (PG)
              </button>
              <button
                onClick={() => {
                  setActiveVertical('professional')
                  setActiveSubFilter('all')
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  border: 'none',
                  background: activeVertical === 'professional' ? '#15803d' : 'white',
                  color: activeVertical === 'professional' ? 'white' : '#166534',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s'
                }}
              >
                💼 Professional
              </button>
              <button
                onClick={() => {
                  setActiveVertical('competitive')
                  setActiveSubFilter('all')
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  border: 'none',
                  background: activeVertical === 'competitive' ? '#b91c1c' : 'white',
                  color: activeVertical === 'competitive' ? 'white' : '#991b1b',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s'
                }}
              >
                📋 Competitive Exams
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          
          {/* Dynamic Sub-Filter Section */}
          {activeVertical !== 'all' && (
            <div style={{
              background: `linear-gradient(135deg, ${VERTICAL_CONFIG[activeVertical as keyof typeof VERTICAL_CONFIG]?.bg} 0%, ${VERTICAL_CONFIG[activeVertical as keyof typeof VERTICAL_CONFIG]?.bg} 100%)`,
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: `1px solid ${VERTICAL_CONFIG[activeVertical as keyof typeof VERTICAL_CONFIG]?.color}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{VERTICAL_CONFIG[activeVertical as keyof typeof VERTICAL_CONFIG]?.icon}</span>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: VERTICAL_CONFIG[activeVertical as keyof typeof VERTICAL_CONFIG]?.color }}>
                  {VERTICAL_CONFIG[activeVertical as keyof typeof VERTICAL_CONFIG]?.name} Courses
                </h3>
              </div>
              
              <p style={{ color: VERTICAL_CONFIG[activeVertical as keyof typeof VERTICAL_CONFIG]?.color, fontSize: '0.875rem', marginBottom: '1rem' }}>
                Select a category to find relevant courses tailored to your goals
              </p>
              
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {getCurrentSubFilters().map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveSubFilter(filter.id)}
                    style={{
                      padding: '0.625rem 1.25rem',
                      fontSize: '0.875rem',
                      border: `1px solid ${VERTICAL_CONFIG[activeVertical as keyof typeof VERTICAL_CONFIG]?.color}`,
                      borderRadius: '0.5rem',
                      background: activeSubFilter === filter.id ? VERTICAL_CONFIG[activeVertical as keyof typeof VERTICAL_CONFIG]?.color : 'white',
                      color: activeSubFilter === filter.id ? 'white' : VERTICAL_CONFIG[activeVertical as keyof typeof VERTICAL_CONFIG]?.color,
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    {filter.icon} {filter.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* College Education University Filter (when college is active) */}
          {activeVertical === 'college' && (
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #f59e0b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🎓</span>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#92400e' }}>
                  College Education - Find Your University Courses
                </h3>
              </div>
              
              <p style={{ color: '#a16207', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Select your university to see degree-specific courses tailored to your curriculum
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  style={{
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    border: '1px solid #d97706',
                    borderRadius: '0.5rem',
                    background: 'white',
                    cursor: 'pointer',
                    minWidth: '280px',
                    maxWidth: '400px'
                  }}
                >
                  <option value="">Select Your University...</option>
                  {INDIAN_UNIVERSITIES.map(uni => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name} ({uni.state})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setSelectedUniversity('')
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    border: '1px solid #d97706',
                    borderRadius: '0.5rem',
                    background: 'white',
                    color: '#92400e',
                    cursor: 'pointer'
                  }}
                >
                  Clear Selection
                </button>
              </div>

              {selectedUniversity && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem', 
                  background: 'rgba(255,255,255,0.7)', 
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#92400e'
                }}>
                  <strong>Showing courses for:</strong> {INDIAN_UNIVERSITIES.find(u => u.id === selectedUniversity)?.name}
                  <p style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: '#a16207' }}>
                    These degree courses are designed to align with common university curricula across India.
                    Check your specific university syllabus for any variations.
                  </p>
                </div>
              )}
            </div>
          )}
              
          {/* General Filters */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
              Filters:
            </span>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: 'white',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>

            {(selectedDifficulty || searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSelectedDifficulty('')
                  setSearchTerm('')
                  setSelectedCategory('')
                  setSelectedUniversity('')
                }}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Clear Filters
              </button>
            )}

            <div style={{ marginLeft: 'auto', color: '#6b7280', fontSize: '0.875rem' }}>
              {filteredCourses.length} courses found
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '0.75rem' }}>
              <div style={{ color: '#6b7280', fontSize: '1.125rem' }}>Loading courses...</div>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '0.75rem' }}>
              <p style={{ color: '#dc2626', fontSize: '1.125rem' }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  background: '#ea580c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '0.75rem' }}>
              <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>No courses found matching your criteria.</p>
              <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
                  {getActiveFilter()} Courses
                </h2>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredCourses.map((course) => {
                  const diffColors = getDifficultyColor(course.difficulty)
                  const learningPathInfo = course.learningPath
                  const isSchool = isSchoolCourse(course)
                  const isCollege = isCollegeCourse(course)
                  const isPG = isPGCourse(course)

                  return (
                    <div
                      key={course.id}
                      style={{
                        background: 'white',
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      {/* Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        zIndex: 10,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        {isPG && (
                          <span style={{
                            background: '#7c3aed',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            display: 'inline-block'
                          }}>
                            🎓 PG
                          </span>
                        )}
                        {isCollege && !isPG && (
                          <span style={{
                            background: '#f59e0b',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            display: 'inline-block'
                          }}>
                            🎓 College
                          </span>
                        )}
                        {isSchool && !isCollege && !isPG && (
                          <span style={{
                            background: '#2563eb',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            display: 'inline-block'
                          }}>
                            🏫 School
                          </span>
                        )}
                        {isProfessionalCourse(course) && !isCompetitiveCourse(course) && (
                          <span style={{
                            background: '#15803d',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            display: 'inline-block'
                          }}>
                            💼 Professional
                          </span>
                        )}
                        {isCompetitiveCourse(course) && (
                          <span style={{
                            background: '#b91c1c',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            display: 'inline-block'
                          }}>
                            📋 Competitive
                          </span>
                        )}
                      </div>

                      {/* Thumbnail */}
                      <div style={{
                        aspectRatio: '16/9',
                        background: isPG 
                          ? 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)'
                          : isCollege 
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {(() => {
                          const thumbnailPath = getThumbnailPath(course.id, course.thumbnail)
                          if (thumbnailPath) {
                            return (
                              <img 
                                src={thumbnailPath} 
                                alt={course.title}
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover',
                                  opacity: 0.9
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 4rem;">📚</span>'
                                }}
                              />
                            )
                          }
                          return <span style={{ fontSize: '4rem' }}>📚</span>
                        })()}
                      </div>

                      {/* Content */}
                      <div style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                          {learningPathInfo && (
                            <span style={{
                              background: '#e0e7ff',
                              color: '#4f46e5',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              {learningPathInfo.icon} {learningPathInfo.title}
                            </span>
                          )}
                          <span style={{
                            background: diffColors.bg,
                            color: diffColors.text,
                            padding: '0.25rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                          </span>
                        </div>

                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '0.5rem'
                        }}>
                          {course.title}
                        </h3>

                        <p style={{
                          color: '#6b7280',
                          fontSize: '0.875rem',
                          marginBottom: '1rem',
                          lineHeight: '1.5',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {course.description}
                        </p>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: '1rem',
                          borderTop: '1px solid #f3f4f6'
                        }}>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              By {course.instructor.name}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                              {formatDuration(course.duration)} • {course.lessonCount} lessons
                            </p>
                          </div>
                          <Link href={`/courses/${course.id}`} style={{
                            display: 'inline-block',
                            background: isPG ? '#7c3aed' : isCollege ? '#ea580c' : isSchool ? '#2563eb' : isProfessionalCourse(course) ? '#15803d' : '#b91c1c',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                          }}>
                            View Course
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div style={{ background: 'white', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              textAlign: 'center'
            }}>
              {[
                { icon: '📚', number: filteredCourses.length.toString(), label: 'Expert Courses', color: '#ea580c' },
                { icon: '📂', number: '15+', label: 'Learning Categories', color: '#16a34a' },
                { icon: '⏱️', number: `${totalLessons}+`, label: 'Video Lessons', color: '#2563eb' },
                { icon: '👨‍🏫', number: uniqueInstructors.toString(), label: 'Expert Instructors', color: '#9333ea' }
              ].map((stat, index) => (
                <div key={index}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stat.color, marginBottom: '0.25rem' }}>
                    {stat.number}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: 'white',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            © 2026 INR99.Academy - India&apos;s Learning Infrastructure
          </p>
        </div>
      </footer>
    </div>
  )
}
