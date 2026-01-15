// Test script to verify database and API logic
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDatabase() {
  console.log('🧪 Testing Database and API Logic...\n')

  try {
    // Test 1: Check learning path categories
    console.log('📊 Test 1: Learning Path Categories')
    const categories = await prisma.learningPathCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })
    console.log(`✅ Found ${categories.length} learning path categories:`)
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`)
    })

    // Test 2: Check learning paths with categories
    console.log('\n📊 Test 2: Learning Paths')
    const learningPaths = await prisma.learningPath.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            courses: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })
    console.log(`✅ Found ${learningPaths.length} learning paths:`)
    learningPaths.forEach(path => {
      console.log(`   - ${path.title} (Category: ${path.category?.name || 'None'}, Courses: ${path._count.courses})`)
    })

    // Test 3: Check courses
    console.log('\n📊 Test 3: Courses')
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      include: {
        instructor: {
          select: {
            id: true,
            name: true
          }
        },
        learningPath: {
          select: {
            id: true,
            title: true
          }
        },
        _count: {
          select: {
            lessons: true,
            assessments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    console.log(`✅ Found ${courses.length} courses:`)
    courses.forEach(course => {
      console.log(`   - ${course.title} (Instructor: ${course.instructor.name}, Path: ${course.learningPath?.title || 'None'}, Lessons: ${course._count.lessons})`)
    })

    // Test 4: Simulate API response for learning path categories
    console.log('\n📊 Test 4: Simulated API Response')
    const apiResponse = {
      success: true,
      learningPathCategories: categories.map(category => {
        const categoryPaths = learningPaths.filter(path => path.categoryId === category.id)
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          color: category.color,
          sortOrder: category.sortOrder,
          isFeatured: category.isFeatured,
          learningPaths: categoryPaths.map(path => ({
            id: path.id,
            title: path.title,
            description: path.description,
            icon: path.icon,
            color: path.color,
            courseCount: path._count.courses
          }))
        }
      })
    }

    console.log(`✅ API would return ${apiResponse.learningPathCategories.length} categories`)
    console.log('✅ Sample category with paths:')
    const sampleCategory = apiResponse.learningPathCategories.find(cat => cat.learningPaths.length > 0)
    if (sampleCategory) {
      console.log(`   Category: ${sampleCategory.name}`)
      console.log(`   Learning Paths: ${sampleCategory.learningPaths.length}`)
      sampleCategory.learningPaths.forEach(path => {
        console.log(`     - ${path.title} (${path.courseCount} courses)`)
      })
    }

    // Test 5: Check for any missing relationships
    console.log('\n📊 Test 5: Relationship Integrity Check')
    const pathsWithoutCategory = learningPaths.filter(path => !path.categoryId)
    const coursesWithoutPath = courses.filter(course => !course.learningPathId)
    
    console.log(`   Learning paths without category: ${pathsWithoutCategory.length}`)
    if (pathsWithoutCategory.length > 0) {
      pathsWithoutCategory.forEach(path => {
        console.log(`     - ${path.title}`)
      })
    }
    
    console.log(`   Courses without learning path: ${coursesWithoutPath.length}`)
    if (coursesWithoutPath.length > 0) {
      coursesWithoutPath.forEach(course => {
        console.log(`     - ${course.title}`)
      })
    }

    console.log('\n🎉 Database test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()