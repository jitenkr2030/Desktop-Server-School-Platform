import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Adding remaining modules 11-16 lessons...')

  const courseId = 'career1'

  // Check current lessons
  const existingLessons = await prisma.lesson.findMany({
    where: { courseId: courseId }
  })

  console.log(`Found ${existingLessons.length} lessons already`)

  // Module 11: DevOps Basics (20 lessons)
  const module11 = [
    { order: 1101, title: 'DevOps Overview', duration: 15 },
    { order: 1102, title: 'Linux Basics', duration: 15 },
    { order: 1103, title: 'Servers', duration: 15 },
    { order: 1104, title: 'Nginx', duration: 15 },
    { order: 1105, title: 'Apache', duration: 15 },
    { order: 1106, title: 'Environment Setup', duration: 15 },
    { order: 1107, title: 'Docker Basics', duration: 15 },
    { order: 1108, title: 'Dockerfiles', duration: 15 },
    { order: 1109, title: 'Containers', duration: 15 },
    { order: 1110, title: 'Docker Compose', duration: 15 },
    { order: 1111, title: 'CI/CD', duration: 15 },
    { order: 1112, title: 'GitHub Actions', duration: 15 },
    { order: 1113, title: 'Cloud Basics', duration: 15 },
    { order: 1114, title: 'AWS Overview', duration: 15 },
    { order: 1115, title: 'VPS Deployment', duration: 15 },
    { order: 1116, title: 'Monitoring', duration: 15 },
    { order: 1117, title: 'Logging', duration: 10 },
    { order: 1118, title: 'Scaling', duration: 15 },
    { order: 1119, title: 'Backup Strategy', duration: 10 },
    { order: 1120, title: 'Deploy Project', duration: 30 },
  ]

  // Module 12: Security Essentials (20 lessons)
  const module12 = [
    { order: 1201, title: 'OWASP Top 10', duration: 15 },
    { order: 1202, title: 'XSS', duration: 15 },
    { order: 1203, title: 'CSRF', duration: 15 },
    { order: 1204, title: 'SQL Injection', duration: 15 },
    { order: 1205, title: 'Authentication Attacks', duration: 15 },
    { order: 1206, title: 'Authorization Bugs', duration: 15 },
    { order: 1207, title: 'API Security', duration: 15 },
    { order: 1208, title: 'HTTPS', duration: 15 },
    { order: 1209, title: 'Encryption', duration: 15 },
    { order: 1210, title: 'Hashing', duration: 15 },
    { order: 1211, title: 'Secrets Management', duration: 15 },
    { order: 1212, title: 'Secure Headers', duration: 10 },
    { order: 1213, title: 'Input Validation', duration: 15 },
    { order: 1214, title: 'Rate Limiting', duration: 10 },
    { order: 1215, title: 'Logging Attacks', duration: 10 },
    { order: 1216, title: 'Security Testing', duration: 15 },
    { order: 1217, title: 'Pen-Testing Intro', duration: 15 },
    { order: 1218, title: 'Compliance Basics', duration: 10 },
    { order: 1219, title: 'Incident Response', duration: 10 },
    { order: 1220, title: 'Secure App Project', duration: 30 },
  ]

  // Module 13: Performance Optimization (20 lessons)
  const module13 = [
    { order: 1301, title: 'Performance Metrics', duration: 15 },
    { order: 1302, title: 'Lighthouse', duration: 15 },
    { order: 1303, title: 'Frontend Optimization', duration: 15 },
    { order: 1304, title: 'Image Optimization', duration: 15 },
    { order: 1305, title: 'Code Splitting', duration: 15 },
    { order: 1306, title: 'Lazy Loading', duration: 15 },
    { order: 1307, title: 'Caching', duration: 15 },
    { order: 1308, title: 'CDN', duration: 15 },
    { order: 1309, title: 'Backend Optimization', duration: 15 },
    { order: 1310, title: 'Database Indexing', duration: 15 },
    { order: 1311, title: 'API Optimization', duration: 15 },
    { order: 1312, title: 'Memory Management', duration: 15 },
    { order: 1313, title: 'Profiling', duration: 15 },
    { order: 1314, title: 'Load Testing', duration: 15 },
    { order: 1315, title: 'Stress Testing', duration: 15 },
    { order: 1316, title: 'Scaling Strategies', duration: 15 },
    { order: 1317, title: 'Monitoring Tools', duration: 15 },
    { order: 1318, title: 'Alerts', duration: 10 },
    { order: 1319, title: 'Optimization Checklist', duration: 10 },
    { order: 1320, title: 'Performance Project', duration: 30 },
  ]

  // Module 14: Testing & Quality (20 lessons)
  const module14 = [
    { order: 1401, title: 'Testing Types', duration: 15 },
    { order: 1402, title: 'Unit Testing', duration: 15 },
    { order: 1403, title: 'Integration Testing', duration: 15 },
    { order: 1404, title: 'End-to-End Testing', duration: 15 },
    { order: 1405, title: 'Jest', duration: 15 },
    { order: 1406, title: 'Mocha', duration: 15 },
    { order: 1407, title: 'Cypress', duration: 15 },
    { order: 1408, title: 'Test Coverage', duration: 15 },
    { order: 1409, title: 'Mocking', duration: 15 },
    { order: 1410, title: 'API Testing', duration: 15 },
    { order: 1411, title: 'Load Testing', duration: 15 },
    { order: 1412, title: 'Security Testing', duration: 15 },
    { order: 1413, title: 'UI Testing', duration: 15 },
    { order: 1414, title: 'Automation', duration: 15 },
    { order: 1415, title: 'CI Testing', duration: 15 },
    { order: 1416, title: 'Bug Tracking', duration: 10 },
    { order: 1417, title: 'QA Process', duration: 15 },
    { order: 1418, title: 'Documentation', duration: 10 },
    { order: 1419, title: 'Best Practices', duration: 15 },
    { order: 1420, title: 'Testing Project', duration: 30 },
  ]

  // Module 15: Real-World Projects (20 lessons)
  const module15 = [
    { order: 1501, title: 'Project Planning', duration: 15 },
    { order: 1502, title: 'Requirement Analysis', duration: 15 },
    { order: 1503, title: 'Wireframes', duration: 15 },
    { order: 1504, title: 'Architecture', duration: 15 },
    { order: 1505, title: 'Tech Stack', duration: 15 },
    { order: 1506, title: 'Frontend Build', duration: 30 },
    { order: 1507, title: 'Backend Build', duration: 30 },
    { order: 1508, title: 'Database Design', duration: 15 },
    { order: 1509, title: 'Auth Integration', duration: 15 },
    { order: 1510, title: 'API Integration', duration: 15 },
    { order: 1511, title: 'Security', duration: 15 },
    { order: 1512, title: 'Performance', duration: 15 },
    { order: 1513, title: 'Testing', duration: 15 },
    { order: 1514, title: 'Deployment', duration: 15 },
    { order: 1515, title: 'Monitoring', duration: 10 },
    { order: 1516, title: 'Bug Fixing', duration: 15 },
    { order: 1517, title: 'Scaling', duration: 15 },
    { order: 1518, title: 'Documentation', duration: 10 },
    { order: 1519, title: 'Presentation', duration: 15 },
    { order: 1520, title: 'Final Product', duration: 30 },
  ]

  // Module 16: Career & Startup Readiness (20 lessons)
  const module16 = [
    { order: 1601, title: 'Developer Roadmap', duration: 15 },
    { order: 1602, title: 'Portfolio Building', duration: 15 },
    { order: 1603, title: 'GitHub Profile', duration: 10 },
    { order: 1604, title: 'Resume Writing', duration: 15 },
    { order: 1605, title: 'Interview Prep', duration: 15 },
    { order: 1606, title: 'Coding Interviews', duration: 15 },
    { order: 1607, title: 'System Design', duration: 15 },
    { order: 1608, title: 'Freelancing', duration: 15 },
    { order: 1609, title: 'Remote Jobs', duration: 15 },
    { order: 1610, title: 'SaaS Basics', duration: 15 },
    { order: 1611, title: 'Startup Ideas', duration: 15 },
    { order: 1612, title: 'MVP Building', duration: 15 },
    { order: 1613, title: 'Monetization', duration: 15 },
    { order: 1614, title: 'Legal Basics', duration: 10 },
    { order: 1615, title: 'Pricing Models', duration: 15 },
    { order: 1616, title: 'Client Handling', duration: 15 },
    { order: 1617, title: 'Scaling Products', duration: 15 },
    { order: 1618, title: 'AI Integration', duration: 15 },
    { order: 1619, title: 'Future Trends', duration: 15 },
    { order: 1620, title: 'Capstone Demo', duration: 30 },
  ]

  const allRemaining = [...module11, ...module12, ...module13, ...module14, ...module15, ...module16]

  let added = 0
  const existingOrders = existingLessons.map(l => l.order)

  for (const lesson of allRemaining) {
    if (!existingOrders.includes(lesson.order)) {
      await prisma.lesson.create({
        data: {
          id: `webdev_lesson_${lesson.order}`,
          courseId: courseId,
          title: lesson.title,
          duration: lesson.duration,
          order: lesson.order,
          content: `Content for: ${lesson.title}`,
          isActive: true,
        }
      })
      added++
    }
  }

  const final = await prisma.course.findUnique({
    where: { id: courseId },
    include: { _count: { select: { lessons: true } } }
  })

  console.log(`\n✅ Added ${added} more lessons`)
  console.log(`✅ Total lessons: ${final?._count.lessons}`)
  console.log(`\n📊 Final Course Stats:`)
  console.log(`   Course: ${final?.title}`)
  console.log(`   Level: ${final?.difficulty}`)
  console.log(`   Lessons: ${final?._count.lessons}`)
  console.log(`   Duration: ${final?.duration} minutes (${Math.round(final!.duration / 60)} hours)`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
