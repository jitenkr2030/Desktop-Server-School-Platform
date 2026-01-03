import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adding comprehensive Web Development Bootcamp curriculum...\n')

  const courseId = 'career1'

  // Check if the course exists
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  })

  if (!course) {
    console.log('❌ Course career1 not found!')
    return
  }

  console.log(`✅ Found course: ${course.title}`)

  // Check if lessons already exist
  const existingLessons = await prisma.lesson.findMany({
    where: { courseId: courseId }
  })

  if (existingLessons.length > 100) {
    console.log(`⚠️ Course already has ${existingLessons.length} lessons. Clearing and re-adding...`)
    await prisma.lesson.deleteMany({
      where: { courseId: courseId }
    })
  }

  // Update course metadata
  await prisma.course.update({
    where: { id: courseId },
    data: {
      difficulty: 'BEGINNER',
      duration: 4800, // 80 hours
      description: 'Complete web development course with HTML, CSS, JavaScript. Master full-stack web development from scratch.',
    }
  })
  console.log('✅ Updated course metadata')

  // Define all 320 lessons across 16 modules
  const allLessons = [
    // Module 1: HTML Fundamentals (20 Lessons | 5h)
    { order: 101, title: 'Introduction to Web Development', duration: 15 },
    { order: 102, title: 'How the Web Works (HTTP, Browser, Server)', duration: 15 },
    { order: 103, title: 'HTML vs CSS vs JS', duration: 10 },
    { order: 104, title: 'HTML Document Structure', duration: 15 },
    { order: 105, title: 'Doctype & Meta Tags', duration: 10 },
    { order: 106, title: 'Head vs Body', duration: 10 },
    { order: 107, title: 'Text Elements (h1–h6, p, span)', duration: 15 },
    { order: 108, title: 'Formatting Tags', duration: 10 },
    { order: 109, title: 'Lists (ul, ol, dl)', duration: 15 },
    { order: 110, title: 'Links & Anchors', duration: 15 },
    { order: 111, title: 'Images & Attributes', duration: 15 },
    { order: 112, title: 'Audio & Video', duration: 15 },
    { order: 113, title: 'Tables Basics', duration: 15 },
    { order: 114, title: 'Semantic HTML', duration: 15 },
    { order: 115, title: 'Forms Overview', duration: 15 },
    { order: 116, title: 'Input Types', duration: 15 },
    { order: 117, title: 'Labels & Accessibility', duration: 15 },
    { order: 118, title: 'HTML Validation', duration: 10 },
    { order: 119, title: 'SEO Basics with HTML', duration: 15 },
    { order: 120, title: 'Mini Project: Static Page', duration: 30 },

    // Module 2: CSS Styling (20 Lessons | 5h)
    { order: 201, title: 'CSS Introduction', duration: 15 },
    { order: 202, title: 'Inline vs Internal vs External CSS', duration: 10 },
    { order: 203, title: 'Selectors Deep Dive', duration: 15 },
    { order: 204, title: 'Colors & Units', duration: 15 },
    { order: 205, title: 'Typography', duration: 15 },
    { order: 206, title: 'Box Model', duration: 15 },
    { order: 207, title: 'Margin & Padding', duration: 15 },
    { order: 208, title: 'Borders & Shadows', duration: 15 },
    { order: 209, title: 'Display Property', duration: 15 },
    { order: 210, title: 'Positioning', duration: 15 },
    { order: 211, title: 'Flexbox Basics', duration: 15 },
    { order: 212, title: 'Flexbox Advanced', duration: 15 },
    { order: 213, title: 'CSS Grid Basics', duration: 15 },
    { order: 214, title: 'Grid Layouts', duration: 15 },
    { order: 215, title: 'Responsive Design Concepts', duration: 15 },
    { order: 216, title: 'Media Queries', duration: 15 },
    { order: 217, title: 'Animations', duration: 15 },
    { order: 218, title: 'Transitions', duration: 10 },
    { order: 219, title: 'CSS Best Practices', duration: 15 },
    { order: 220, title: 'Mini Project: Responsive Layout', duration: 30 },

    // Module 3: JavaScript Essentials (20 Lessons | 5h)
    { order: 301, title: 'JavaScript Overview', duration: 15 },
    { order: 302, title: 'Variables & Data Types', duration: 15 },
    { order: 303, title: 'Operators', duration: 15 },
    { order: 304, title: 'Conditional Statements', duration: 15 },
    { order: 305, title: 'Loops', duration: 15 },
    { order: 306, title: 'Functions', duration: 15 },
    { order: 307, title: 'Arrow Functions', duration: 10 },
    { order: 308, title: 'Scope & Hoisting', duration: 15 },
    { order: 309, title: 'Arrays', duration: 15 },
    { order: 310, title: 'Objects', duration: 15 },
    { order: 311, title: 'DOM Basics', duration: 15 },
    { order: 312, title: 'DOM Manipulation', duration: 15 },
    { order: 313, title: 'Events', duration: 15 },
    { order: 314, title: 'Forms Handling', duration: 15 },
    { order: 315, title: 'Timers', duration: 10 },
    { order: 316, title: 'Error Handling', duration: 15 },
    { order: 317, title: 'ES6 Features', duration: 15 },
    { order: 318, title: 'JSON', duration: 10 },
    { order: 319, title: 'Debugging JS', duration: 15 },
    { order: 320, title: 'Project: Interactive Website', duration: 30 },

    // Module 4: Advanced JavaScript (20 Lessons | 5h)
    { order: 401, title: 'Execution Context', duration: 15 },
    { order: 402, title: 'Call Stack', duration: 15 },
    { order: 403, title: 'Closures', duration: 15 },
    { order: 404, title: 'Callbacks', duration: 15 },
    { order: 405, title: 'Promises', duration: 15 },
    { order: 406, title: 'Async / Await', duration: 15 },
    { order: 407, title: 'Fetch API', duration: 15 },
    { order: 408, title: 'REST APIs', duration: 15 },
    { order: 409, title: 'LocalStorage', duration: 10 },
    { order: 410, title: 'SessionStorage', duration: 10 },
    { order: 411, title: 'Cookies', duration: 10 },
    { order: 412, title: 'Modules', duration: 15 },
    { order: 413, title: 'Event Delegation', duration: 15 },
    { order: 414, title: 'Throttling & Debouncing', duration: 15 },
    { order: 415, title: 'Memory Leaks', duration: 15 },
    { order: 416, title: 'Performance Optimization', duration: 15 },
    { order: 417, title: 'Security Basics', duration: 15 },
    { order: 418, title: 'JS Design Patterns', duration: 15 },
    { order: 419, title: 'Testing Basics', duration: 15 },
    { order: 420, title: 'Project: API App', duration: 30 },

    // Module 5: Git & GitHub (20 Lessons | 5h)
    { order: 501, title: 'Version Control Basics', duration: 15 },
    { order: 502, title: 'Git Installation', duration: 10 },
    { order: 503, title: 'Git Init', duration: 10 },
    { order: 504, title: 'Git Status', duration: 10 },
    { order: 505, title: 'Git Add & Commit', duration: 15 },
    { order: 506, title: 'Branches', duration: 15 },
    { order: 507, title: 'Merging', duration: 15 },
    { order: 508, title: 'Rebasing', duration: 15 },
    { order: 509, title: 'Git Logs', duration: 10 },
    { order: 510, title: 'Git Ignore', duration: 10 },
    { order: 511, title: 'GitHub Overview', duration: 15 },
    { order: 512, title: 'Repositories', duration: 10 },
    { order: 513, title: 'Pull Requests', duration: 15 },
    { order: 514, title: 'Code Reviews', duration: 15 },
    { order: 515, title: 'Issues & Projects', duration: 10 },
    { order: 516, title: 'GitHub Actions', duration: 15 },
    { order: 517, title: 'CI/CD Basics', duration: 15 },
    { order: 518, title: 'Collaboration Workflow', duration: 15 },
    { order: 519, title: 'Best Practices', duration: 15 },
    { order: 520, title: 'Team Project Setup', duration: 30 },

    // Module 6: UI/UX Fundamentals (20 Lessons | 5h)
    { order: 601, title: 'UI vs UX', duration: 15 },
    { order: 602, title: 'Design Thinking', duration: 15 },
    { order: 603, title: 'User Personas', duration: 15 },
    { order: 604, title: 'Wireframing', duration: 15 },
    { order: 605, title: 'Prototyping', duration: 15 },
    { order: 606, title: 'Color Theory', duration: 15 },
    { order: 607, title: 'Typography', duration: 15 },
    { order: 608, title: 'Spacing Systems', duration: 10 },
    { order: 609, title: 'Accessibility (WCAG)', duration: 15 },
    { order: 610, title: 'Responsive UX', duration: 15 },
    { order: 611, title: 'Mobile-First Design', duration: 15 },
    { order: 612, title: 'UX Laws', duration: 15 },
    { order: 613, title: 'Design Systems', duration: 15 },
    { order: 614, title: 'Figma Basics', duration: 15 },
    { order: 615, title: 'Figma Components', duration: 15 },
    { order: 616, title: 'UX Research', duration: 15 },
    { order: 617, title: 'Usability Testing', duration: 15 },
    { order: 618, title: 'Micro-Interactions', duration: 15 },
    { order: 619, title: 'UX Metrics', duration: 15 },
    { order: 620, title: 'Redesign Project', duration: 30 },

    // Module 7: Frontend Framework – React (20 Lessons | 5h)
    { order: 701, title: 'React Introduction', duration: 15 },
    { order: 702, title: 'JSX', duration: 15 },
    { order: 703, title: 'Components', duration: 15 },
    { order: 704, title: 'Props', duration: 15 },
    { order: 705, title: 'State', duration: 15 },
    { order: 706, title: 'Events', duration: 10 },
    { order: 707, title: 'Conditional Rendering', duration: 15 },
    { order: 708, title: 'Lists & Keys', duration: 15 },
    { order: 709, title: 'Hooks Overview', duration: 10 },
    { order: 710, title: 'useState', duration: 15 },
    { order: 711, title: 'useEffect', duration: 15 },
    { order: 712, title: 'Forms', duration: 15 },
    { order: 713, title: 'Lifting State', duration: 15 },
    { order: 714, title: 'Context API', duration: 15 },
    { order: 715, title: 'Routing', duration: 15 },
    { order: 716, title: 'API Integration', duration: 15 },
    { order: 717, title: 'Error Boundaries', duration: 15 },
    { order: 718, title: 'Performance', duration: 15 },
    { order: 719, title: 'Deployment', duration: 15 },
    { order: 720, title: 'React Project', duration: 30 },

    // Module 8: Backend Fundamentals (20 Lessons | 5h)
    { order: 801, title: 'Backend Overview', duration: 15 },
    { order: 802, title: 'Node.js Introduction', duration: 15 },
    { order: 803, title: 'npm & yarn', duration: 15 },
    { order: 804, title: 'Express.js Basics', duration: 15 },
    { order: 805, title: 'Routing', duration: 15 },
    { order: 806, title: 'Middleware', duration: 15 },
    { order: 807, title: 'REST Principles', duration: 15 },
    { order: 808, title: 'CRUD APIs', duration: 15 },
    { order: 809, title: 'Request/Response', duration: 15 },
    { order: 810, title: 'Status Codes', duration: 10 },
    { order: 811, title: 'Error Handling', duration: 15 },
    { order: 812, title: 'Logging', duration: 10 },
    { order: 813, title: 'Environment Variables', duration: 10 },
    { order: 814, title: 'CORS', duration: 10 },
    { order: 815, title: 'Security Basics', duration: 15 },
    { order: 816, title: 'API Versioning', duration: 10 },
    { order: 817, title: 'Rate Limiting', duration: 10 },
    { order: 818, title: 'Documentation', duration: 15 },
    { order: 819, title: 'Testing APIs', duration: 15 },
    { order: 820, title: 'Backend Mini Project', duration: 30 },

    // Module 9: Databases (20 Lessons | 5h)
    { order: 901, title: 'Database Concepts', duration: 15 },
    { order: 902, title: 'SQL vs NoSQL', duration: 15 },
    { order: 903, title: 'MongoDB Basics', duration: 15 },
    { order: 904, title: 'Collections & Documents', duration: 15 },
    { order: 905, title: 'CRUD Operations', duration: 15 },
    { order: 906, title: 'Indexing', duration: 15 },
    { order: 907, title: 'Relationships', duration: 15 },
    { order: 908, title: 'Aggregation', duration: 15 },
    { order: 909, title: 'Mongoose', duration: 15 },
    { order: 910, title: 'Schema Design', duration: 15 },
    { order: 911, title: 'Validation', duration: 15 },
    { order: 912, title: 'Transactions', duration: 15 },
    { order: 913, title: 'Performance', duration: 15 },
    { order: 914, title: 'Security', duration: 15 },
    { order: 915, title: 'Backups', duration: 10 },
    { order: 916, title: 'PostgreSQL Intro', duration: 15 },
    { order: 917, title: 'SQL Queries', duration: 15 },
    { order: 918, title: 'Joins', duration: 15 },
    { order: 919, title: 'Optimization', duration: 15 },
    { order: 920, title: 'Database Project', duration: 30 },

    // Module 10: Authentication & Authorization (20 Lessons | 5h)
    { order: 1001, title: 'Auth Concepts', duration: 15 },
    { order: 1002, title: 'Sessions', duration: 15 },
    { order: 1003, title: 'Cookies', duration: 15 },
    { order: 1004, title: 'JWT', duration: 15 },
    { order: 1005, title: 'Password Hashing', duration: 15 },
    { order: 1006, title: 'Login API', duration: 15 },
    { order: 1007, title: 'Signup API', duration: 15 },
    { order: 1008, title: 'Role-Based Access', duration: 15 },
    { order: 1009, title: 'OAuth', duration: 15 },
    { order: 1010, title: 'Social Login', duration: 15 },
    { order: 1011, title: 'Email Verification', duration: 15 },
    { order: 1012, title: 'Password Reset', duration: 15 },
    { order: 1013, title: 'Refresh Tokens', duration: 15 },
    { order: 1014, title: 'Token Security', duration: 15 },
    { order: 1015, title: 'MFA', duration: 15 },
    { order: 1016, title: 'Rate Limiting', duration: 10 },
    { order: 1017, title: 'Brute Force Protection', duration: 10 },
    { order: 1018, title: 'Audit Logs', duration: 10 },
    { order: 1019, title: 'Compliance', duration: 10 },
    { order: 1020, title: 'Auth Project', duration: 30 },

    // Module 11: DevOps Basics (20 Lessons | 5h)
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

    // Module 12: Security Essentials (20 Lessons | 5h)
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

    // Module 13: Performance Optimization (20 Lessons | 5h)
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

    // Module 14: Testing & Quality (20 Lessons | 5h)
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

    // Module 15: Real-World Projects (20 Lessons | 5h)
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

    // Module 16: Career & Startup Readiness (20 Lessons | 5h)
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

  // Create all lessons
  let lessonsCreated = 0
  for (const lessonData of allLessons) {
    const lessonId = `webdev_lesson_${lessonData.order}`
    
    await prisma.lesson.upsert({
      where: { id: lessonId },
      update: {
        title: lessonData.title,
        duration: lessonData.duration,
        order: lessonData.order,
        content: `Content for: ${lessonData.title}`,
        isActive: true,
      },
      create: {
        id: lessonId,
        courseId: courseId,
        title: lessonData.title,
        duration: lessonData.duration,
        order: lessonData.order,
        content: `Content for: ${lessonData.title}`,
        isActive: true,
      },
    })
    lessonsCreated++
  }

  console.log(`✅ Created ${lessonsCreated} lessons`)

  // Verify the course data
  const finalCourse = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      _count: {
        select: { lessons: true }
      }
    }
  })

  console.log('\n📊 Final Course Stats:')
  console.log(`  - Course: ${finalCourse?.title}`)
  console.log(`  - Level: ${finalCourse?.difficulty}`)
  console.log(`  - Lessons: ${finalCourse?._count.lessons}`)
  console.log(`  - Duration: ${finalCourse?.duration} minutes (${Math.round(finalCourse!.duration / 60)} hours)`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
