import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Adding 6 more lessons to reach 70 total...\n')

  const courseId = 'cr_english_mastery'
  
  // Get current max order
  const lastLesson = await prisma.lesson.findFirst({
    where: { courseId },
    orderBy: { order: 'desc' }
  })
  
  const startOrder = (lastLesson?.order || 0) + 1

  const additionalLessons = [
    { id: 'cr_ecm_065', title: 'English for Government Exams', duration: 25, order: startOrder, content: '## English for Competitive Exams\nPreparing for government job exams requires strong English skills.\n\n## Key Areas\n- Reading Comprehension\n- Grammar and Vocabulary\n- Para Jumbles\n- Error Detection\n\n## Tips for Exam Success\n- Read newspapers daily\n- Practice previous year papers\n- Time management techniques' },
    { id: 'cr_ecm_066', title: 'Accent Training', duration: 22, order: startOrder + 1, content: '## Neutralizing Your Accent\nAchieving clear, understandable English pronunciation.\n\n## Common Indian Accent Features\n- TH sounds\n- T and D sounds\n- V and W\n\n## Practice Techniques\n- Minimal pairs\n- Listening and imitating\n- Recording and comparing\n\n## Resources\nRecommended apps and videos for accent training.' },
    { id: 'cr_ecm_067', title: 'Group Discussion Skills', duration: 28, order: startOrder + 2, content: '## Mastering Group Discussions\nExcelling in GD rounds for placements and admissions.\n\n## GD Topics\n- Current affairs\n- Abstract topics\n- Case studies\n\n## Participation Tips\n- When to speak\n- How to introduce points\n- Building on others\' ideas\n\n## Handling Conflicts\nPolite disagreement techniques.' },
    { id: 'cr_ecm_068', title: 'Email Follow-Up Etiquette', duration: 18, order: startOrder + 3, content: '## Following Up Professionally\nWhen and how to send follow-up emails.\n\n## After Application\n- Waiting period\n- First follow-up\n- Second follow-up\n\n## After Interview\n- Thank you email\n- Status inquiry\n- Offer negotiation\n\n## Sample Follow-up Templates' },
    { id: 'cr_ecm_069', title: 'Technical Writing Basics', duration: 30, order: startOrder + 4, content: '## Introduction to Technical Writing\nCreating documentation and technical content.\n\n## Types of Technical Writing\n- User manuals\n- API documentation\n- README files\n- Process guides\n\n## Key Principles\n- Clarity over cleverness\n- Consistent terminology\n- Visual hierarchy\n\n## Tools and Software\n- Markdown\n- Documentation platforms' },
    { id: 'cr_ecm_070', title: 'Course Completion Project', duration: 40, order: startOrder + 5, content: '## Final Capstone Project\nApply everything you\'ve learned in this comprehensive project.\n\n## Project Requirements\n1. Write a professional report (1000 words)\n2. Record a 5-minute presentation\n3. Participate in a mock interview\n4. Create a business email scenario\n\n## Submission Guidelines\n- Video recording of presentation\n- Written report document\n- Reflection summary\n\n## Grading Criteria\n- Grammar and vocabulary\n- Clarity of expression\n- Professional tone' },
  ]

  for (const lesson of additionalLessons) {
    await prisma.lesson.create({
      data: {
        id: lesson.id,
        courseId: courseId,
        title: lesson.title,
        content: lesson.content,
        duration: lesson.duration,
        order: lesson.order,
        isActive: true,
      }
    })
    console.log(`  ✅ Lesson ${lesson.order}: ${lesson.title} (${lesson.duration} min)`)
  }

  // Count lessons
  const lessonCount = await prisma.lesson.count({
    where: { courseId }
  })

  const totalDuration = await prisma.lesson.aggregate({
    where: { courseId },
    _sum: { duration: true }
  })

  console.log(`\n✅ Successfully updated English Communication Mastery!`)
  console.log(`   Total Lessons: ${lessonCount}`)
  console.log(`   Total Duration: ${totalDuration._sum.duration} minutes (${Math.floor((totalDuration._sum.duration || 0) / 60)}h ${(totalDuration._sum.duration || 0) % 60}m)`)

  await prisma.$disconnect()
}

main().catch(console.error)
