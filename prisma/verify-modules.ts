import { db } from '@/lib/db'

async function verifyModuleCategorization() {
  try {
    const courseId = 'career1'
    
    const lessons = await db.lesson.findMany({
      where: {
        courseId: courseId,
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        title: true,
        order: true,
      },
    })

    const moduleNames: Record<string, string> = {
      '1': 'Web Development Introduction',
      '2': 'HTML Fundamentals',
      '3': 'CSS Styling',
      '4': 'JavaScript Basics',
      '5': 'JavaScript Advanced',
      '6': 'Version Control with Git',
      '7': 'UI/UX Design Principles',
      '8': 'React.js Fundamentals',
      '9': 'Backend Development',
      '10': 'Database Management',
      '11': 'Authentication & Security',
      '12': 'API Development',
      '13': 'Testing & Best Practices',
      '14': 'Performance Optimization',
      '15': 'Deployment & DevOps',
      '16': 'Capstone Project',
    }

    const moduleLessons: Record<string, typeof lessons> = {}
    
    for (const lesson of lessons) {
      let moduleNum = '1'
      
      if (lesson.order >= 1 && lesson.order <= 99) {
        moduleNum = '1'
      } else if (lesson.order >= 100 && lesson.order <= 199) {
        moduleNum = '2'
      } else if (lesson.order >= 200 && lesson.order <= 299) {
        moduleNum = '3'
      } else if (lesson.order >= 300 && lesson.order <= 399) {
        moduleNum = '4'
      } else if (lesson.order >= 400 && lesson.order <= 499) {
        moduleNum = '5'
      } else if (lesson.order >= 500 && lesson.order <= 599) {
        moduleNum = '6'
      } else if (lesson.order >= 600 && lesson.order <= 699) {
        moduleNum = '7'
      } else if (lesson.order >= 700 && lesson.order <= 799) {
        moduleNum = '8'
      } else if (lesson.order >= 800 && lesson.order <= 899) {
        moduleNum = '9'
      } else if (lesson.order >= 900 && lesson.order <= 999) {
        moduleNum = '10'
      } else if (lesson.order >= 1000 && lesson.order <= 1099) {
        moduleNum = '11'
      } else if (lesson.order >= 1100 && lesson.order <= 1199) {
        moduleNum = '12'
      } else if (lesson.order >= 1200 && lesson.order <= 1299) {
        moduleNum = '13'
      } else if (lesson.order >= 1300 && lesson.order <= 1399) {
        moduleNum = '14'
      } else if (lesson.order >= 1400 && lesson.order <= 1499) {
        moduleNum = '15'
      } else if (lesson.order >= 1500 && lesson.order <= 1599) {
        moduleNum = '16'
      }
      
      if (!moduleLessons[moduleNum]) {
        moduleLessons[moduleNum] = []
      }
      moduleLessons[moduleNum].push(lesson)
    }

    console.log('=== Web Development Bootcamp Modules ===\n')
    
    for (let i = 1; i <= 16; i++) {
      const moduleNum = i.toString()
      const moduleLessonList = moduleLessons[moduleNum] || []
      console.log(`Module ${moduleNum}: ${moduleNames[moduleNum]} (${moduleLessonList.length} lessons)`)
      if (moduleLessonList.length > 0) {
        moduleLessonList.forEach(l => {
          console.log(`  - ${l.order}: ${l.title}`)
        })
      }
      console.log()
    }

    // Summary
    console.log('=== Summary ===')
    const totalLessons = Object.values(moduleLessons).reduce((sum, m) => sum + m.length, 0)
    const modulesWithLessons = Object.keys(moduleLessons).length
    console.log(`Total modules: ${modulesWithLessons}`)
    console.log(`Total lessons: ${totalLessons}`)
    console.log(`Average lessons per module: ${(totalLessons / modulesWithLessons).toFixed(1)}`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await db.$disconnect()
  }
}

verifyModuleCategorization()
