import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(' 🌱 Starting CS Professional course update...')

  const courseId = 'cs_professional'
  const categoryId = 'cat_cs' // CS courses category

  // Check if category exists, create if not
  let category = await prisma.category.findFirst({
    where: { id: categoryId }
  })

  if (!category) {
    category = await prisma.category.create({
      data: {
        id: categoryId,
        name: 'Company Secretary',
        slug: 'company-secretary',
        description: 'Complete Company Secretary courses for ICSI exams'
      }
    })
    console.log('✅ Created CS category')
  }

  // Cleanup existing course data
  console.log('🧹 Cleaning up existing CS Professional lessons...')
  await prisma.assessment.deleteMany({ where: { courseId: courseId } })
  await prisma.lesson.deleteMany({ where: { courseId: courseId } })
  console.log('✅ Cleanup complete')

  // Verify course exists
  const course = await prisma.course.findFirst({
    where: { id: courseId }
  })

  if (!course) {
    // Create the course if it doesn't exist
    await prisma.course.create({
      data: {
        id: courseId,
        title: 'CS Professional Complete Course',
        description: 'In-depth, practice-oriented preparation for the Company Secretary (CS) Professional Programme, focusing on advanced corporate governance, compliance management, strategic advisory, and case-law application.',
        difficulty: 'ADVANCED',
        thumbnail: '/assets/courses/cs-professional.svg',
        isActive: true,
        categoryId: categoryId,
        instructorId: 'inst-ca-faculty'
      }
    })
    console.log('✅ Course created:', courseId)
  } else {
    console.log('✅ Course found:', course.title)
  }

  // Define lessons with order numbers for module grouping
  const lessonsData = [
    // Module 1: Governance, Risk Management, Compliance & Ethics (GRMCE) - Orders 1-99
    { title: 'Corporate Governance – Global & Indian Practices', duration: 150, order: 1 },
    { title: 'Board Structure, Committees & Processes', duration: 160, order: 2 },
    { title: 'Risk Management Frameworks', duration: 150, order: 3 },
    { title: 'Compliance Management Systems', duration: 160, order: 4 },
    { title: 'Ethics, Values & Sustainability', duration: 140, order: 5 },
    { title: 'ESG & Integrated Reporting', duration: 150, order: 6 },
    { title: 'Case Studies & Governance Failures', duration: 160, order: 7 },

    // Module 2: Advanced Tax Laws & Practice - Orders 100-199
    { title: 'Advanced Income Tax Provisions', duration: 170, order: 101 },
    { title: 'Tax Planning & Management', duration: 160, order: 102 },
    { title: 'Transfer Pricing (Indian Perspective)', duration: 170, order: 103 },
    { title: 'International Taxation Basics', duration: 160, order: 104 },
    { title: 'GST – Advanced Concepts', duration: 170, order: 105 },
    { title: 'Tax Litigation & Appeals', duration: 160, order: 106 },
    { title: 'Practical Case Studies', duration: 170, order: 107 },

    // Module 3: Drafting, Pleadings & Appearances - Orders 200-299
    { title: 'Legal Drafting Principles', duration: 120, order: 201 },
    { title: 'Corporate Agreements & Contracts', duration: 140, order: 202 },
    { title: 'Pleadings & Affidavits', duration: 130, order: 203 },
    { title: 'Applications, Petitions & Appeals', duration: 130, order: 204 },
    { title: 'Appearance before Tribunals & Courts', duration: 120, order: 205 },
    { title: 'Practical Drafting Exercises', duration: 140, order: 206 },

    // Module 4: Secretarial Audit, Compliance Management & Due Diligence - Orders 300-399
    { title: 'Secretarial Audit – Scope & Process', duration: 150, order: 301 },
    { title: 'Compliance Audits', duration: 150, order: 302 },
    { title: 'Due Diligence – Corporate & Legal', duration: 160, order: 303 },
    { title: 'Annual Secretarial Compliance Report', duration: 140, order: 304 },
    { title: 'Certification & Reporting', duration: 140, order: 305 },
    { title: 'Case Studies', duration: 150, order: 306 },

    // Module 5: Corporate Restructuring, Insolvency & Resolution - Orders 400-499
    { title: 'Corporate Restructuring', duration: 160, order: 401 },
    { title: 'Mergers, Amalgamations & Demergers', duration: 170, order: 402 },
    { title: 'Insolvency & Bankruptcy Code (IBC)', duration: 170, order: 403 },
    { title: 'Liquidation & Winding Up', duration: 160, order: 404 },
    { title: 'Cross-border Insolvency', duration: 150, order: 405 },
    { title: 'Practical & Case-Based Questions', duration: 170, order: 406 },

    // Module 6: Capital Markets & Securities Laws - Orders 500-599
    { title: 'SEBI Regulations (Advanced)', duration: 160, order: 501 },
    { title: 'Listing Regulations & Compliance', duration: 150, order: 502 },
    { title: 'Takeover Code & Insider Trading', duration: 160, order: 503 },
    { title: 'Issue of Securities', duration: 150, order: 504 },
    { title: 'Market Intermediaries', duration: 140, order: 505 },
    { title: 'Case Law & Regulatory Actions', duration: 150, order: 506 },

    // Module 7: Corporate Disputes & Arbitration - Orders 600-699
    { title: 'Corporate Disputes', duration: 130, order: 601 },
    { title: 'Arbitration & Conciliation Act', duration: 140, order: 602 },
    { title: 'Mediation & Alternative Dispute Resolution', duration: 130, order: 603 },
    { title: 'NCLT & Appellate Procedures', duration: 140, order: 604 },
    { title: 'Landmark Case Laws', duration: 130, order: 605 },

    // Module 8: Economic, Business & Commercial Laws (Advanced) - Orders 700-799
    { title: 'Competition Law – Advanced', duration: 110, order: 701 },
    { title: 'FEMA & Foreign Trade Policy', duration: 110, order: 702 },
    { title: 'Consumer Protection Laws', duration: 100, order: 703 },
    { title: 'Data Protection & Cyber Laws', duration: 110, order: 704 },
    { title: 'Case-Based Applications', duration: 100, order: 705 },

    // Module 9: Professional Readiness & Exam Mastery - Orders 800-899
    { title: 'ICSI Study Material & Case Digest Analysis', duration: 60, order: 801 },
    { title: 'Past Year Question, RTP & MTP Strategy', duration: 60, order: 802 },
    { title: 'Answer Writing for Case-Based Exams', duration: 50, order: 803 },
    { title: 'Professional Ethics in Practice', duration: 40, order: 804 },
    { title: '90/60/30 Day Revision Plans', duration: 50, order: 805 },
  ]

  console.log('📝 Creating 64 lessons across 9 modules...')

  for (const lessonData of lessonsData) {
    await prisma.lesson.create({
      data: {
        title: lessonData.title,
        duration: lessonData.duration,
        order: lessonData.order,
        courseId: courseId,
        isActive: true,
        content: `Content for ${lessonData.title}`
      }
    })
    console.log(`✅ Lesson ${lessonData.order}: ${lessonData.title}`)
  }

  // Create assessments
  console.log('📊 Creating assessments...')
  await prisma.assessment.create({
    data: {
      title: 'Module 1: Governance, Risk Management & Ethics Mock Test',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Module 2: Advanced Tax Laws Assessment',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Module 3: Drafting & Appearances Practice Test',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Module 4: Secretarial Audit & Due Diligence Quiz',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Module 5: Restructuring & Insolvency Mock Test',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Module 6: Capital Markets & Securities Laws Quiz',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Module 7: Corporate Disputes & Arbitration Assessment',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'Module 8: Advanced Commercial Laws Test',
      type: 'QUIZ',
      courseId: courseId
    }
  })
  await prisma.assessment.create({
    data: {
      title: 'CS Professional Complete Mock Test',
      type: 'PRACTICE',
      courseId: courseId
    }
  })
  console.log('✅ Assessments created')

  // Update course duration
  const totalDuration = lessonsData.reduce((sum, lesson) => sum + lesson.duration, 0)
  await prisma.course.update({
    where: { id: courseId },
    data: {
      duration: totalDuration,
      description: 'In-depth, practice-oriented preparation for the Company Secretary (CS) Professional Programme, focusing on advanced corporate governance, compliance management, strategic advisory, and case-law application. Prepares learners for high-level corporate, regulatory, and boardroom roles.'
    }
  })

  console.log('============================================================')
  console.log('🎉 CS Professional Complete Course updated successfully!')
  console.log('============================================================')
  console.log('📖 Course: CS Professional Complete Course')
  console.log('📁 Course ID:', courseId)
  console.log('📊 Structure Summary:')
  console.log('   📚 Total Modules: 9 (3 Groups)')
  console.log('   📝 Total Lessons:', lessonsData.length)
  console.log('   ⏱️ Total Duration:', totalDuration, 'minutes (', Math.round(totalDuration / 60), 'hours)')
  console.log('   📝 Total Assessments: 9')
  console.log('📚 Modules Breakdown:')
  console.log('   1. Governance, Risk Management, Compliance & Ethics (7 lessons, 17h)')
  console.log('   2. Advanced Tax Laws & Practice (7 lessons, 20h)')
  console.log('   3. Drafting, Pleadings & Appearances (6 lessons, 15h)')
  console.log('   4. Secretarial Audit, Compliance Management & Due Diligence (6 lessons, 18h)')
  console.log('   5. Corporate Restructuring, Insolvency & Resolution (6 lessons, 20h)')
  console.log('   6. Capital Markets & Securities Laws (6 lessons, 16h)')
  console.log('   7. Corporate Disputes & Arbitration (5 lessons, 12h)')
  console.log('   8. Economic, Business & Commercial Laws (Advanced) (5 lessons, 7h)')
  console.log('   9. Professional Readiness & Exam Mastery (5 lessons, 4h)')
  console.log('✅ Ready to publish!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
