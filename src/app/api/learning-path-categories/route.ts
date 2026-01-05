import { NextRequest, NextResponse } from 'next/server'

// Learning path categories with the new categories added
export async function GET(request: NextRequest) {
  try {
    const learningPathCategories = [
      {
        id: '1',
        name: 'School Learning',
        slug: 'school-learning',
        description: 'Class 1-12 with all boards',
        icon: '🧒',
        color: 'bg-blue-500',
        sortOrder: 1,
        isFeatured: true,
        learningPaths: [
          { id: '1a', title: 'Primary (1-5)', description: 'Math, EVS, English', icon: '📚', color: 'bg-blue-100', courseCount: 15 },
          { id: '1b', title: 'Middle School (6-8)', description: 'Math, Science, Social', icon: '📖', color: 'bg-blue-100', courseCount: 20 },
          { id: '1c', title: 'Secondary (9-10)', description: 'Math, Science, English', icon: '📝', color: 'bg-blue-100', courseCount: 25 },
          { id: '1d', title: 'Senior Secondary (11-12)', description: 'Science, Commerce, Arts', icon: '🎓', color: 'bg-blue-100', courseCount: 30 }
        ]
      },
      {
        id: '2',
        name: 'College Foundation',
        slug: 'college-foundation',
        description: 'UG degrees and subjects',
        icon: '🎓',
        color: 'bg-green-500',
        sortOrder: 2,
        isFeatured: true,
        learningPaths: [
          { id: '2a', title: 'Commerce', description: 'Accounting, Business', icon: '💼', color: 'bg-green-100', courseCount: 18 },
          { id: '2b', title: 'Computer Science', description: 'Programming, CS fundamentals', icon: '💻', color: 'bg-green-100', courseCount: 22 },
          { id: '2c', title: 'Science', description: 'Physics, Chemistry, Biology', icon: '🔬', color: 'bg-green-100', courseCount: 16 },
          { id: '2d', title: 'Engineering', description: 'Math, Physics basics', icon: '⚙️', color: 'bg-green-100', courseCount: 14 }
        ]
      },
      {
        id: '3',
        name: 'Competitive Exams',
        slug: 'competitive-exams',
        description: 'Government jobs and competitive exam preparation',
        icon: '🏛️',
        color: 'bg-red-500',
        sortOrder: 3,
        isFeatured: true,
        learningPaths: [
          { id: '3a', title: 'UPSC', description: 'Civil Services, NDA, CDS', icon: '📋', color: 'bg-red-100', courseCount: 3 },
          { id: '3b', title: 'SSC', description: 'CGL, CHSL, MTS, GD', icon: '📊', color: 'bg-red-100', courseCount: 4 },
          { id: '3c', title: 'Banking', description: 'SBI, IBPS, RRB', icon: '🏦', color: 'bg-red-100', courseCount: 3 },
          { id: '3d', title: 'Railway & Defense', description: 'RRB, NDA, CDS, AFCAT', icon: '🚂', color: 'bg-red-100', courseCount: 4 },
          { id: '3e', title: 'State Government', description: 'PSC, Police, Patwari, TET', icon: '🏢', color: 'bg-red-100', courseCount: 4 }
        ]
      },
      {
        id: '4',
        name: 'Professional Courses',
        slug: 'professional-courses',
        description: 'CA, CS, CMA, CFA, FRM, Actuarial',
        icon: '📊',
        color: 'bg-purple-500',
        sortOrder: 4,
        isFeatured: true,
        learningPaths: [
          { id: '4a', title: 'Chartered Accountant', description: 'CA Foundation, Intermediate, Final', icon: '📈', color: 'bg-purple-100', courseCount: 3 },
          { id: '4b', title: 'Company Secretary', description: 'CS Executive, Professional', icon: '📋', color: 'bg-purple-100', courseCount: 2 },
          { id: '4c', title: 'CMA', description: 'Cost and Management Accounting', icon: '💰', color: 'bg-purple-100', courseCount: 3 },
          { id: '4d', title: 'CFA', description: 'Chartered Financial Analyst', icon: '📉', color: 'bg-purple-100', courseCount: 3 },
          { id: '4e', title: 'FRM & Actuarial', description: 'Risk Management, Actuarial Science', icon: '🎯', color: 'bg-purple-100', courseCount: 3 }
        ]
      },
      {
        id: '5',
        name: 'Career Skills',
        slug: 'career-skills',
        description: 'Professional development',
        icon: '🧑‍💼',
        color: 'bg-indigo-500',
        sortOrder: 5,
        isFeatured: true,
        learningPaths: [
          { id: '5a', title: 'Professional Skills', description: 'Communication, Leadership', icon: '💪', color: 'bg-indigo-100', courseCount: 12 },
          { id: '5b', title: 'Technical Skills', description: 'Web dev, Data analysis', icon: '⚡', color: 'bg-indigo-100', courseCount: 20 },
          { id: '5c', title: 'Soft Skills', description: 'Emotional intelligence, Problem solving', icon: '🧠', color: 'bg-indigo-100', courseCount: 10 },
          { id: '5d', title: 'Digital Skills', description: 'AI, Automation basics', icon: '🤖', color: 'bg-indigo-100', courseCount: 15 }
        ]
      },
      {
        id: '6',
        name: 'Money & Business',
        slug: 'money-business',
        description: 'Financial literacy',
        icon: '💰',
        color: 'bg-orange-500',
        sortOrder: 6,
        isFeatured: true,
        learningPaths: [
          { id: '6a', title: 'Financial Literacy', description: 'Personal finance, Investment', icon: '📊', color: 'bg-orange-100', courseCount: 14 },
          { id: '6b', title: 'Business Fundamentals', description: 'Planning, Entrepreneurship', icon: '🚀', color: 'bg-orange-100', courseCount: 16 },
          { id: '6c', title: 'Investment & Trading', description: 'Stock market, Crypto', icon: '📈', color: 'bg-orange-100', courseCount: 12 },
          { id: '6d', title: 'E-commerce', description: 'Online business, Digital marketing', icon: '🛒', color: 'bg-orange-100', courseCount: 18 }
        ]
      },
      {
        id: '7',
        name: 'Life Skills',
        slug: 'life-skills',
        description: 'Personal development and well-being',
        icon: '🧠',
        color: 'bg-pink-500',
        sortOrder: 7,
        isFeatured: true,
        learningPaths: [
          { id: '7a', title: 'Productivity', description: 'Time Management, Focus', icon: '⏰', color: 'bg-pink-100', courseCount: 2 },
          { id: '7b', title: 'Wellness', description: 'Stress Management, Mental Health', icon: '🧘', color: 'bg-pink-100', courseCount: 1 },
          { id: '7c', title: 'Communication', description: 'Confidence, Public Speaking', icon: '🎤', color: 'bg-pink-100', courseCount: 2 },
          { id: '7d', title: 'Personal Growth', description: 'Decision Making, Critical Thinking', icon: '🌟', color: 'bg-pink-100', courseCount: 5 }
        ]
      }
    ]

    return NextResponse.json({
      success: true,
      learningPathCategories
    })

  } catch (error) {
    console.error('Get learning path categories error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error', 
        error: error.message 
      },
      { status: 500 }
    )
  }
}
