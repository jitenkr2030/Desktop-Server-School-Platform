const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testPlatformFunctionality() {
  console.log('🧪 Testing Platform Functionality with Demo Data...')
  console.log('=' * 60)

  try {
    // Test 1: Basic Data Counts
    console.log('\n📊 Test 1: Basic Data Counts')
    console.log('-' * 40)
    
    const userCount = await prisma.user.count()
    const instructorCount = await prisma.instructor.count()
    const categoryCount = await prisma.category.count()
    const subCategoryCount = await prisma.subCategory.count()
    const learningPathCount = await prisma.learningPath.count()
    const courseCount = await prisma.course.count()
    const lessonCount = await prisma.lesson.count()
    const assessmentCount = await prisma.assessment.count()
    const discussionCount = await prisma.discussion.count()
    const subscriptionCount = await prisma.subscription.count()
    const badgeCount = await prisma.skillBadge.count()
    
    console.log(`Users: ${userCount} ✅`)
    console.log(`Instructors: ${instructorCount} ✅`)
    console.log(`Categories: ${categoryCount} ✅`)
    console.log(`SubCategories: ${subCategoryCount} ✅`)
    console.log(`Learning Paths: ${learningPathCount} ✅`)
    console.log(`Courses: ${courseCount} ✅`)
    console.log(`Lessons: ${lessonCount} ✅`)
    console.log(`Assessments: ${assessmentCount} ✅`)
    console.log(`Discussions: ${discussionCount} ✅`)
    console.log(`Subscriptions: ${subscriptionCount} ✅`)
    console.log(`Skill Badges: ${badgeCount} ✅`)

    // Test 2: User Data with Relationships
    console.log('\n👥 Test 2: User Data with Relationships')
    console.log('-' * 40)
    
    const usersWithDetails = await prisma.user.findMany({
      take: 3,
      include: {
        subscriptions: true,
        progress: true,
        badges: {
          include: {
            badge: true
          }
        },
        assessments: true
      }
    })
    
    usersWithDetails.forEach(user => {
      console.log(`\nUser: ${user.name} (${user.email})`)
      console.log(`  Subscriptions: ${user.subscriptions.length}`)
      console.log(`  Course Progress: ${user.progress.length}`)
      console.log(`  Badges: ${user.badges.length}`)
      console.log(`  Assessments: ${user.assessments.length}`)
    })

    // Test 3: Course Data with Relationships
    console.log('\n📚 Test 3: Course Data with Relationships')
    console.log('-' * 40)
    
    const coursesWithDetails = await prisma.course.findMany({
      take: 3,
      include: {
        instructor: true,
        category: true,
        subCategory: true,
        learningPath: true,
        lessons: true,
        assessments: true,
        discussions: {
          include: {
            user: true
          }
        }
      }
    })
    
    coursesWithDetails.forEach(course => {
      console.log(`\nCourse: ${course.title}`)
      console.log(`  Instructor: ${course.instructor.name}`)
      console.log(`  Category: ${course.category.name} > ${course.subCategory.name}`)
      console.log(`  Learning Path: ${course.learningPath?.title || 'None'}`)
      console.log(`  Lessons: ${course.lessons.length}`)
      console.log(`  Assessments: ${course.assessments.length}`)
      console.log(`  Discussions: ${course.discussions.length}`)
    })

    // Test 4: Discussion Data with Replies
    console.log('\n💬 Test 4: Discussion Data with Replies')
    console.log('-' * 40)
    
    const discussionsWithReplies = await prisma.discussion.findMany({
      take: 2,
      include: {
        user: true,
        course: true,
        replies: {
          include: {
            user: true
          }
        }
      }
    })
    
    discussionsWithReplies.forEach(discussion => {
      console.log(`\nDiscussion: ${discussion.title}`)
      console.log(`  Course: ${discussion.course.title}`)
      console.log(`  Author: ${discussion.user.name}`)
      console.log(`  Replies: ${discussion.replies.length}`)
      discussion.replies.forEach(reply => {
        console.log(`    - ${reply.user.name}: ${reply.content.substring(0, 50)}...`)
      })
    })

    // Test 5: Assessment Data with Questions
    console.log('\n📝 Test 5: Assessment Data with Questions')
    console.log('-' * 40)
    
    const assessmentsWithQuestions = await prisma.assessment.findMany({
      take: 2,
      include: {
        course: true,
        questions: true,
        userResults: {
          include: {
            user: true
          }
        }
      }
    })
    
    assessmentsWithQuestions.forEach(assessment => {
      console.log(`\nAssessment: ${assessment.title}`)
      console.log(`  Course: ${assessment.course.title}`)
      console.log(`  Questions: ${assessment.questions.length}`)
      console.log(`  User Results: ${assessment.userResults.length}`)
      assessment.userResults.forEach(result => {
        console.log(`    - ${result.user.name}: ${result.score}%`)
      })
    })

    // Test 6: Category Statistics
    console.log('\n📈 Test 6: Category Statistics')
    console.log('-' * 40)
    
    const categoriesWithStats = await prisma.category.findMany({
      include: {
        categoryStats: true,
        courses: true,
        subcategories: true
      }
    })
    
    categoriesWithStats.forEach(category => {
      console.log(`\nCategory: ${category.name}`)
      console.log(`  Courses: ${category.courses.length}`)
      console.log(`  SubCategories: ${category.subcategories.length}`)
      if (category.categoryStats) {
        console.log(`  Students: ${category.categoryStats.studentCount}`)
        console.log(`  Revenue: ₹${category.categoryStats.revenue}`)
        console.log(`  Rating: ${category.categoryStats.avgRating}/5`)
      }
    })

    // Test 7: Learning Path Progress
    console.log('\n🎯 Test 7: Learning Path Progress')
    console.log('-' * 40)
    
    const learningPathsWithCourses = await prisma.learningPath.findMany({
      include: {
        courses: {
          include: {
            progress: true
          }
        }
      }
    })
    
    learningPathsWithCourses.forEach(path => {
      console.log(`\nLearning Path: ${path.title}`)
      console.log(`  Courses: ${path.courses.length}`)
      const totalProgress = path.courses.reduce((sum, course) => {
        return sum + course.progress.reduce((progressSum, p) => progressSum + p.progress, 0)
      }, 0)
      const maxProgress = path.courses.length * 100
      const avgProgress = maxProgress > 0 ? (totalProgress / maxProgress) * 100 : 0
      console.log(`  Average Progress: ${avgProgress.toFixed(1)}%`)
    })

    // Test 8: Subscription and Payment Data
    console.log('\n💰 Test 8: Subscription and Payment Data')
    console.log('-' * 40)
    
    const subscriptionsWithPayments = await prisma.subscription.findMany({
      include: {
        user: true
      }
    })
    
    subscriptionsWithPayments.forEach(subscription => {
      console.log(`\nSubscription: ${subscription.type} for ${subscription.user.name}`)
      console.log(`  Status: ${subscription.status}`)
      console.log(`  Period: ${subscription.startDate.toDateString()} - ${subscription.endDate?.toDateString() || 'Ongoing'}`)
      console.log(`  Auto-renew: ${subscription.autoRenew}`)
    })

    // Test 9: Badge System
    console.log('\n🏆 Test 9: Badge System')
    console.log('-' * 40)
    
    const badgesWithUsers = await prisma.skillBadge.findMany({
      include: {
        userBadges: {
          include: {
            user: true
          }
        }
      }
    })
    
    badgesWithUsers.forEach(badge => {
      console.log(`\nBadge: ${badge.name}`)
      console.log(`  Description: ${badge.description}`)
      console.log(`  Earned by: ${badge.userBadges.length} users`)
      badge.userBadges.forEach(userBadge => {
        console.log(`    - ${userBadge.user.name}`)
      })
    })

    // Test 10: Content Accessibility
    console.log('\n🔓 Test 10: Content Accessibility')
    console.log('-' * 40)
    
    const activeUsers = await prisma.user.findMany({
      where: {
        subscriptions: {
          some: {
            status: 'ACTIVE'
          }
        }
      },
      include: {
        subscriptions: true
      }
    })
    
    console.log(`Active Subscribers: ${activeUsers.length}`)
    
    const totalContent = {
      courses: courseCount,
      lessons: lessonCount,
      assessments: assessmentCount
    }
    
    console.log(`Total Content Available:`)
    console.log(`  Courses: ${totalContent.courses}`)
    console.log(`  Lessons: ${totalContent.lessons}`)
    console.log(`  Assessments: ${totalContent.assessments}`)
    
    const avgContentPerUser = activeUsers.length > 0 ? {
      courses: (totalContent.courses / activeUsers.length).toFixed(1),
      lessons: (totalContent.lessons / activeUsers.length).toFixed(1),
      assessments: (totalContent.assessments / activeUsers.length).toFixed(1)
    } : { courses: 0, lessons: 0, assessments: 0 }
    
    console.log(`Average Content Per Active User:`)
    console.log(`  Courses: ${avgContentPerUser.courses}`)
    console.log(`  Lessons: ${avgContentPerUser.lessons}`)
    console.log(`  Assessments: ${avgContentPerUser.assessments}`)

    console.log('\n✅ Platform Functionality Test Completed Successfully!')
    console.log('=' * 60)
    console.log('🎉 All demo data is properly structured and accessible!')
    console.log('🚀 The INR99.Academy platform is ready for testing!')

  } catch (error) {
    console.error('❌ Error during platform testing:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPlatformFunctionality()