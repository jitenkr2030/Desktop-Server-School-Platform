const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with community and discussions data...')

  try {
    // Create Assessments
    const assessments = await Promise.all([
      prisma.assessment.create({
        data: {
          id: 'assess1',
          courseId: 'course1',
          title: 'HTML & CSS Fundamentals Quiz',
          type: 'QUIZ',
          isActive: true,
        },
      }),
      prisma.assessment.create({
        data: {
          id: 'assess2',
          courseId: 'course2',
          title: 'JavaScript Programming Challenge',
          type: 'QUIZ',
          isActive: true,
        },
      }),
      prisma.assessment.create({
        data: {
          id: 'assess3',
          courseId: 'course7',
          title: 'UI Design Principles Assessment',
          type: 'QUIZ',
          isActive: true,
        },
      }),
      prisma.assessment.create({
        data: {
          id: 'assess4',
          courseId: 'course11',
          title: 'Personal Finance Knowledge Check',
          type: 'QUIZ',
          isActive: true,
        },
      }),
      prisma.assessment.create({
        data: {
          id: 'assess5',
          courseId: 'course15',
          title: 'Data Analysis Practical Scenario',
          type: 'SCENARIO',
          isActive: true,
        },
      }),
    ])

    // Create Assessment Questions
    await Promise.all([
      prisma.assessmentQuestion.create({
        data: {
          id: 'q1',
          assessmentId: 'assess1',
          question: 'What does HTML stand for?',
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify([
            'Hyper Text Markup Language',
            'High Tech Modern Language',
            'Home Tool Markup Language',
            'Hyperlink and Text Markup Language'
          ]),
          correctAnswer: 'Hyper Text Markup Language',
          explanation: 'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.',
          order: 1,
        },
      }),
      prisma.assessmentQuestion.create({
        data: {
          id: 'q2',
          assessmentId: 'assess1',
          question: 'Which CSS property is used to change the text color?',
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify([
            'text-color',
            'font-color',
            'color',
            'text-style'
          ]),
          correctAnswer: 'color',
          explanation: 'The color property in CSS is used to change the text color of an element.',
          order: 2,
        },
      }),
      prisma.assessmentQuestion.create({
        data: {
          id: 'q3',
          assessmentId: 'assess1',
          question: 'What is the purpose of the <head> section in HTML?',
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify([
            'To display the main content of the page',
            'To contain metadata and links to external resources',
            'To create navigation menus',
            'To define the page layout'
          ]),
          correctAnswer: 'To contain metadata and links to external resources',
          explanation: 'The <head> section contains meta-information about the HTML document, including the title, character set, styles, scripts, and other meta information.',
          order: 3,
        },
      }),
      prisma.assessmentQuestion.create({
        data: {
          id: 'q4',
          assessmentId: 'assess2',
          question: 'What is the correct way to declare a variable in JavaScript?',
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify([
            'variable myVar;',
            'var myVar;',
            'v myVar;',
            'declare myVar;'
          ]),
          correctAnswer: 'var myVar;',
          explanation: 'In JavaScript, variables are declared using the var keyword, followed by the variable name.',
          order: 1,
        },
      }),
      prisma.assessmentQuestion.create({
        data: {
          id: 'q5',
          assessmentId: 'assess2',
          question: 'What is a closure in JavaScript?',
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify([
            'A function that has access to variables in its outer scope',
            'A way to close a browser window',
            'A method to end a loop',
            'A type of error handling'
          ]),
          correctAnswer: 'A function that has access to variables in its outer scope',
          explanation: 'A closure is a function that has access to variables in its outer (enclosing) lexical scope even after the outer function has returned.',
          order: 2,
        },
      }),
      prisma.assessmentQuestion.create({
        data: {
          id: 'q6',
          assessmentId: 'assess3',
          question: 'What is the purpose of color theory in UI design?',
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify([
            'To make designs look pretty',
            'To create visual hierarchy and evoke emotions',
            'To reduce file size',
            'To ensure compatibility with all browsers'
          ]),
          correctAnswer: 'To create visual hierarchy and evoke emotions',
          explanation: 'Color theory helps designers create visual hierarchy, establish brand identity, and evoke specific emotions in users.',
          order: 1,
        },
      }),
      prisma.assessmentQuestion.create({
        data: {
          id: 'q7',
          assessmentId: 'assess4',
          question: 'What is the recommended percentage of income to save for emergencies?',
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify([
            '5-10%',
            '10-20%',
            '20-30%',
            '50% or more'
          ]),
          correctAnswer: '20-30%',
          explanation: 'Financial experts recommend saving 20-30% of income, with a portion dedicated to building an emergency fund that covers 3-6 months of expenses.',
          order: 1,
        },
      }),
    ])

    // Create Discussions
    const discussions = await Promise.all([
      prisma.discussion.create({
        data: {
          id: 'disc1',
          courseId: 'course1',
          userId: 'user1',
          title: 'Help with CSS Flexbox layout issues',
          content: 'I\'m having trouble understanding CSS Flexbox. Can someone explain the main concepts? I\'m trying to create a responsive navbar but the items aren\'t aligning properly.',
          isPinned: true,
          isActive: true,
        },
      }),
      prisma.discussion.create({
        data: {
          id: 'disc2',
          courseId: 'course2',
          userId: 'user2',
          title: 'Best practices for JavaScript functions',
          content: 'What are the best practices for writing clean JavaScript functions? I want to improve my code quality and make it more maintainable.',
          isPinned: false,
          isActive: true,
        },
      }),
      prisma.discussion.create({
        data: {
          id: 'disc3',
          courseId: 'course7',
          userId: 'user3',
          title: 'Color theory in modern UI design',
          content: 'How important is color theory in modern UI design? Any resources to learn more about creating effective color palettes?',
          isPinned: false,
          isActive: true,
        },
      }),
      prisma.discussion.create({
        data: {
          id: 'disc4',
          courseId: 'course11',
          userId: 'user4',
          title: 'Budgeting tips for beginners in India',
          content: 'I\'m new to personal finance and looking for budgeting tips specifically for Indian context. What are the best apps or methods to track expenses?',
          isPinned: true,
          isActive: true,
        },
      }),
      prisma.discussion.create({
        data: {
          id: 'disc5',
          courseId: 'course15',
          userId: 'user5',
          title: 'Python vs R for data analysis',
          content: 'I\'m starting my data science journey and confused between Python and R. Which one should I learn first for data analysis in India?',
          isPinned: false,
          isActive: true,
        },
      }),
      prisma.discussion.create({
        data: {
          id: 'disc6',
          courseId: 'course3',
          userId: 'user1',
          title: 'React hooks vs class components',
          content: 'Should I focus on learning React hooks or class components? Most tutorials seem to prefer hooks now.',
          isPinned: false,
          isActive: true,
        },
      }),
    ])

    // Create Discussion Replies
    await Promise.all([
      prisma.discussionReply.create({
        data: {
          id: 'reply1',
          discussionId: 'disc1',
          userId: 'user2',
          content: 'Flexbox is all about flexible box layouts. The main concepts are flex container, flex items, and various properties like justify-content and align-items. Try setting display: flex on the parent and then experiment with flex-direction.',
        },
      }),
      prisma.discussionReply.create({
        data: {
          id: 'reply2',
          discussionId: 'disc1',
          userId: 'user3',
          content: 'I recommend checking out CSS Tricks guide on Flexbox. It has great interactive examples! Also, remember that flexbox is one-dimensional, whereas grid is two-dimensional.',
        },
      }),
      prisma.discussionReply.create({
        data: {
          id: 'reply3',
          discussionId: 'disc2',
          userId: 'user1',
          content: 'Some best practices: use meaningful function names, keep functions small and focused, use proper error handling, and add comments for complex logic. Also, consider using ES6+ features like arrow functions and template literals.',
        },
      }),
      prisma.discussionReply.create({
        data: {
          id: 'reply4',
          discussionId: 'disc2',
          userId: 'user4',
          content: 'Don\'t forget about pure functions and avoiding side effects. Also, learn about async/await for handling asynchronous operations cleanly.',
        },
      }),
      prisma.discussionReply.create({
        data: {
          id: 'reply5',
          discussionId: 'disc3',
          userId: 'user2',
          content: 'Color theory is crucial! It affects user experience, accessibility, and brand perception. I suggest learning about color psychology, complementary colors, and accessibility guidelines.',
        },
      }),
      prisma.discussionReply.create({
        data: {
          id: 'reply6',
          discussionId: 'disc4',
          userId: 'user3',
          content: 'For Indian context, I recommend using apps like Walnut or Money Manager. They work well with Indian banks and UPI transactions. Also, consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings.',
        },
      }),
      prisma.discussionReply.create({
        data: {
          id: 'reply7',
          discussionId: 'disc5',
          userId: 'user1',
          content: 'I\'d recommend Python first. It has a gentler learning curve, more job opportunities in India, and great libraries like Pandas and NumPy for data analysis.',
        },
      }),
      prisma.discussionReply.create({
        data: {
          id: 'reply8',
          discussionId: 'disc6',
          userId: 'user2',
          content: 'Definitely focus on hooks! They\'re the modern way of writing React components. Class components are considered legacy now.',
        },
      }),
    ])

    // Create Subscriptions
    await Promise.all([
      prisma.subscription.create({
        data: {
          id: 'sub1',
          userId: 'user1',
          type: 'MONTHLY',
          status: 'ACTIVE',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-02-01'),
          autoRenew: true,
        },
      }),
      prisma.subscription.create({
        data: {
          id: 'sub2',
          userId: 'user2',
          type: 'YEARLY',
          status: 'ACTIVE',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2025-01-15'),
          autoRenew: true,
        },
      }),
      prisma.subscription.create({
        data: {
          id: 'sub3',
          userId: 'user3',
          type: 'QUARTERLY',
          status: 'ACTIVE',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-05-01'),
          autoRenew: true,
        },
      }),
      prisma.subscription.create({
        data: {
          id: 'sub4',
          userId: 'user4',
          type: 'MONTHLY',
          status: 'EXPIRED',
          startDate: new Date('2023-12-01'),
          endDate: new Date('2024-01-01'),
          autoRenew: false,
        },
      }),
    ])

    // Create Course Progress
    await Promise.all([
      prisma.courseProgress.create({
        data: {
          id: 'progress1',
          userId: 'user1',
          courseId: 'course1',
          lessonId: 'lesson2',
          completed: false,
          progress: 50,
          timeSpent: 90,
          lastAccess: new Date(),
        },
      }),
      prisma.courseProgress.create({
        data: {
          id: 'progress2',
          userId: 'user2',
          courseId: 'course2',
          lessonId: 'lesson7',
          completed: false,
          progress: 33,
          timeSpent: 75,
          lastAccess: new Date(),
        },
      }),
      prisma.courseProgress.create({
        data: {
          id: 'progress3',
          userId: 'user3',
          courseId: 'course7',
          lessonId: 'lesson13',
          completed: true,
          progress: 75,
          timeSpent: 120,
          lastAccess: new Date(),
        },
      }),
      prisma.courseProgress.create({
        data: {
          id: 'progress4',
          userId: 'user4',
          courseId: 'course11',
          lessonId: 'lesson16',
          completed: false,
          progress: 25,
          timeSpent: 45,
          lastAccess: new Date(),
        },
      }),
    ])

    // Create User Assessments
    await Promise.all([
      prisma.userAssessment.create({
        data: {
          id: 'userAssess1',
          userId: 'user1',
          assessmentId: 'assess1',
          score: 85,
          answers: JSON.stringify({
            q1: 'Hyper Text Markup Language',
            q2: 'color',
            q3: 'To contain metadata and links to external resources'
          }),
          completedAt: new Date(),
        },
      }),
      prisma.userAssessment.create({
        data: {
          id: 'userAssess2',
          userId: 'user2',
          assessmentId: 'assess2',
          score: 92,
          answers: JSON.stringify({
            q4: 'var myVar;',
            q5: 'A function that has access to variables in its outer scope'
          }),
          completedAt: new Date(),
        },
      }),
      prisma.userAssessment.create({
        data: {
          id: 'userAssess3',
          userId: 'user3',
          assessmentId: 'assess3',
          score: 78,
          answers: JSON.stringify({
            q6: 'To create visual hierarchy and evoke emotions'
          }),
          completedAt: new Date(),
        },
      }),
    ])

    // Create Skill Badges
    const skillBadges = await Promise.all([
      prisma.skillBadge.create({
        data: {
          id: 'badge1',
          name: 'HTML Basics',
          description: 'Completed HTML fundamentals course',
          criteria: JSON.stringify({ courseCompletion: 'course1', minScore: 80 }),
          isActive: true,
        },
      }),
      prisma.skillBadge.create({
        data: {
          id: 'badge2',
          name: 'JavaScript Beginner',
          description: 'Started JavaScript programming journey',
          criteria: JSON.stringify({ courseStart: 'course2' }),
          isActive: true,
        },
      }),
      prisma.skillBadge.create({
        data: {
          id: 'badge3',
          name: 'UI Design Novice',
          description: 'Exploring UI design principles',
          criteria: JSON.stringify({ courseStart: 'course7' }),
          isActive: true,
        },
      }),
      prisma.skillBadge.create({
        data: {
          id: 'badge4',
          name: 'Finance Aware',
          description: 'Understanding personal finance basics',
          criteria: JSON.stringify({ courseStart: 'course11' }),
          isActive: true,
        },
      }),
      prisma.skillBadge.create({
        data: {
          id: 'badge5',
          name: 'Quiz Master',
          description: 'Scored above 90% in course assessments',
          criteria: JSON.stringify({ minScore: 90, assessmentsCompleted: 3 }),
          isActive: true,
        },
      }),
    ])

    // Create User Badges
    await Promise.all([
      prisma.userBadge.create({
        data: {
          id: 'userBadge1',
          userId: 'user1',
          badgeId: 'badge1',
        },
      }),
      prisma.userBadge.create({
        data: {
          id: 'userBadge2',
          userId: 'user2',
          badgeId: 'badge2',
        },
      }),
      prisma.userBadge.create({
        data: {
          id: 'userBadge3',
          userId: 'user3',
          badgeId: 'badge3',
        },
      }),
      prisma.userBadge.create({
        data: {
          id: 'userBadge4',
          userId: 'user4',
          badgeId: 'badge4',
        },
      }),
      prisma.userBadge.create({
        data: {
          id: 'userBadge5',
          userId: 'user2',
          badgeId: 'badge5',
        },
      }),
    ])

    // Create Payment Records
    await Promise.all([
      prisma.paymentRecord.create({
        data: {
          id: 'pay1',
          userId: 'user1',
          type: 'SUBSCRIPTION',
          amount: 99,
          currency: 'INR',
          status: 'COMPLETED',
          paymentId: 'pay_123456',
        },
      }),
      prisma.paymentRecord.create({
        data: {
          id: 'pay2',
          userId: 'user2',
          type: 'SUBSCRIPTION',
          amount: 1188,
          currency: 'INR',
          status: 'COMPLETED',
          paymentId: 'pay_789012',
        },
      }),
      prisma.paymentRecord.create({
        data: {
          id: 'pay3',
          userId: 'user3',
          type: 'SUBSCRIPTION',
          amount: 297,
          currency: 'INR',
          status: 'COMPLETED',
          paymentId: 'pay_345678',
        },
      }),
      prisma.paymentRecord.create({
        data: {
          id: 'pay4',
          userId: 'user4',
          type: 'SUBSCRIPTION',
          amount: 99,
          currency: 'INR',
          status: 'FAILED',
          paymentId: 'pay_901234',
        },
      }),
    ])

    // Create Category Stats
    await Promise.all([
      prisma.categoryStats.create({
        data: {
          categoryId: 'cat1',
          courseCount: 6,
          studentCount: 150,
          totalDuration: 1340,
          avgRating: 4.5,
          revenue: 14850,
        },
      }),
      prisma.categoryStats.create({
        data: {
          categoryId: 'cat2',
          courseCount: 4,
          studentCount: 89,
          totalDuration: 780,
          avgRating: 4.7,
          revenue: 8799,
        },
      }),
      prisma.categoryStats.create({
        data: {
          categoryId: 'cat3',
          courseCount: 4,
          studentCount: 67,
          totalDuration: 660,
          avgRating: 4.3,
          revenue: 6633,
        },
      }),
      prisma.categoryStats.create({
        data: {
          categoryId: 'cat4',
          courseCount: 2,
          studentCount: 45,
          totalDuration: 520,
          avgRating: 4.6,
          revenue: 4500,
        },
      }),
      prisma.categoryStats.create({
        data: {
          categoryId: 'cat5',
          courseCount: 0,
          studentCount: 0,
          totalDuration: 0,
          avgRating: 0,
          revenue: 0,
        },
      }),
      prisma.categoryStats.create({
        data: {
          categoryId: 'cat6',
          courseCount: 0,
          studentCount: 0,
          totalDuration: 0,
          avgRating: 0,
          revenue: 0,
        },
      }),
    ])

    // Create Certificates
    await Promise.all([
      prisma.certificate.create({
        data: {
          id: 'cert1',
          userId: 'user1',
          courseId: 'course1',
          certificateNumber: 'CERT2024001',
          verified: false,
        },
      }),
      prisma.certificate.create({
        data: {
          id: 'cert2',
          userId: 'user2',
          courseId: 'course2',
          certificateNumber: 'CERT2024002',
          verified: true,
          verificationUrl: 'https://inr99.academy/verify/CERT2024002',
        },
      }),
    ])

    console.log('✅ Community and discussions data seeded successfully!')
    console.log('📊 Summary:')
    console.log(`  - Assessments: ${assessments.length}`)
    console.log(`  - Discussions: ${discussions.length}`)
    console.log(`  - Skill Badges: ${skillBadges.length}`)
    console.log(`  - Subscriptions: 4`)
    console.log(`  - Payment Records: 4`)
    console.log(`  - Certificates: 2`)

  } catch (error) {
    console.error('❌ Error seeding community data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()