import { db } from '@/lib/db'

async function checkLessonDistribution() {
  try {
    const courseId = 'career1'
    
    // Get all lessons ordered by order number
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

    console.log(`Total lessons: ${lessons.length}`)
    
    // Show lessons grouped by their first digit
    console.log('\n=== Lessons grouped by hundreds ===')
    
    const ranges = [
      { name: '000s (1-99)', min: 1, max: 99 },
      { name: '100s (100-199)', min: 100, max: 199 },
      { name: '200s (200-299)', min: 200, max: 299 },
      { name: '300s (300-399)', min: 300, max: 399 },
      { name: '400s (400-499)', min: 400, max: 499 },
      { name: '500s (500-599)', min: 500, max: 599 },
      { name: '600s (600-699)', min: 600, max: 699 },
      { name: '700s (700-799)', min: 700, max: 799 },
      { name: '800s (800-899)', min: 800, max: 899 },
      { name: '900s (900-999)', min: 900, max: 999 },
    ]

    for (const range of ranges) {
      const rangeLessons = lessons.filter(l => l.order >= range.min && l.order <= range.max)
      console.log(`\n${range.name}: ${rangeLessons.length} lessons`)
      if (rangeLessons.length > 0) {
        rangeLessons.forEach(l => {
          console.log(`  ${l.order}: ${l.title}`)
        })
      }
    }

    // Check for missing ranges
    console.log('\n=== Expected ranges vs actual ===')
    const existingRanges = ranges.filter(range => {
      return lessons.some(l => l.order >= range.min && l.order <= range.max)
    })
    
    console.log('Ranges with lessons:', existingRanges.map(r => r.name))
    
    // Count how many lessons we should have per range based on the curriculum
    const expectedRanges = [
      { name: 'HTML (100s)', expected: 20 },
      { name: 'CSS (200s)', expected: 20 },
      { name: 'JavaScript (300s)', expected: 20 },
      { name: 'DOM (400s)', expected: 20 },
      { name: 'Responsive (500s)', expected: 20 },
      { name: 'Frameworks (600s)', expected: 20 },
      { name: 'Git (700s)', expected: 20 },
      { name: 'React Intro (800s)', expected: 20 },
      { name: 'React Hooks (900s)', expected: 20 },
      { name: 'State (1000s)', expected: 20 },
      { name: 'Backend (1100s)', expected: 20 },
      { name: 'API (1200s)', expected: 20 },
      { name: 'Database (1300s)', expected: 20 },
      { name: 'Auth (1400s)', expected: 20 },
      { name: 'Deployment (1500s)', expected: 20 },
      { name: 'Project (1600s)', expected: 20 },
    ]

    console.log('\n=== What we have vs expected ===')
    for (const range of expectedRanges) {
      const existing = lessons.filter(l => l.order >= parseInt(range.name.split(' ')[1].slice(0, -1)) * 100 && l.order < (parseInt(range.name.split(' ')[1].slice(0, -1)) + 1) * 100).length
      console.log(`${range.name}: ${existing}/${range.expected} lessons`)
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkLessonDistribution()
