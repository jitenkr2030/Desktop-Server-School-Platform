const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  try {
    // Clear existing data
    await prisma.userBadge.deleteMany()
    await prisma.certificate.deleteMany()
    await prisma.paymentRecord.deleteMany()
    await prisma.discussionReply.deleteMany()
    await prisma.discussion.deleteMany()
    await prisma.userAssessment.deleteMany()
    await prisma.assessmentQuestion.deleteMany()
    await prisma.assessment.deleteMany()
    await prisma.courseProgress.deleteMany()
    await prisma.lesson.deleteMany()
    await prisma.subCategoryStats.deleteMany()
    await prisma.categoryStats.deleteMany()
    await prisma.course.deleteMany()
    await prisma.instructor.deleteMany()
    await prisma.subCategory.deleteMany()
    await prisma.category.deleteMany()
    await prisma.learningPath.deleteMany()
    await prisma.skillBadge.deleteMany()
    await prisma.subscription.deleteMany()
    await prisma.user.deleteMany()

    console.log('🗑️ Cleared existing data')

    // Create Users
    const users = await Promise.all([
      prisma.user.create({
        data: {
          id: 'admin',
          mobileNumber: '+919876543210',
          email: 'admin@inr99.academy',
          name: 'Admin User',
          isActive: true,
        },
      }),
      prisma.user.create({
        data: {
          id: 'user1',
          mobileNumber: '+919876543211',
          email: 'rahul@example.com',
          name: 'Rahul Sharma',
          isActive: true,
        },
      }),
      prisma.user.create({
        data: {
          id: 'user2',
          mobileNumber: '+919876543212',
          email: 'priya@example.com',
          name: 'Priya Patel',
          isActive: true,
        },
      }),
      prisma.user.create({
        data: {
          id: 'user3',
          mobileNumber: '+919876543213',
          email: 'amit@example.com',
          name: 'Amit Kumar',
          isActive: true,
        },
      }),
    ])

    // Create Categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          id: 'cat1',
          name: 'Programming',
          slug: 'programming',
          description: 'Learn various programming languages and development frameworks',
          icon: 'BookOpen',
          color: 'bg-blue-100',
          isFeatured: true,
          sortOrder: 1,
          isActive: true,
        },
      }),
      prisma.category.create({
        data: {
          id: 'cat2',
          name: 'Design',
          slug: 'design',
          description: 'UI/UX design, graphic design, and creative skills',
          icon: 'FolderOpen',
          color: 'bg-purple-100',
          isFeatured: true,
          sortOrder: 2,
          isActive: true,
        },
      }),
      prisma.category.create({
        data: {
          id: 'cat3',
          name: 'Business & Finance',
          slug: 'business-finance',
          description: 'Business skills, finance, and entrepreneurship',
          icon: 'TrendingUp',
          color: 'bg-green-100',
          isFeatured: true,
          sortOrder: 3,
          isActive: true,
        },
      }),
    ])

    console.log('✅ Database seeded successfully!')
    console.log('📊 Summary:')
    console.log(`  - Users: ${users.length}`)
    console.log(`  - Categories: ${categories.length}`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()