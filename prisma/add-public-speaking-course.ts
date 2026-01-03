import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adding Public Speaking & Presentation course...')

  // First, check if the course already exists
  const existingCourse = await prisma.course.findFirst({
    where: {
      title: {
        contains: 'Public Speaking',
        mode: 'insensitive'
      }
    }
  })

  if (existingCourse) {
    console.log('✅ Public Speaking course already exists with ID:', existingCourse.id)
    
    // Check if lessons exist
    const existingLessons = await prisma.lesson.findMany({
      where: { courseId: existingCourse.id }
    })

    if (existingLessons.length > 0) {
      console.log(`✅ Course already has ${existingLessons.length} lessons`)
      return
    }

    console.log('📝 Adding lessons to existing course...')
  }

  // Create or get instructor for this course
  let instructor = await prisma.instructor.findFirst({
    where: { name: 'Rohit Joshi' }
  })

  if (!instructor) {
    instructor = await prisma.instructor.create({
      data: {
        id: 'inst_rohit_joshi',
        name: 'Rohit Joshi',
        bio: 'Expert communication coach with 15+ years of experience training professionals in public speaking and presentation skills.',
        expertise: JSON.stringify(['Public Speaking', 'Presentation Skills', 'Communication', 'Leadership']),
        isActive: true,
      },
    })
    console.log('✅ Created instructor: Rohit Joshi')
  }

  // Create the Public Speaking course
  const course = await prisma.course.upsert({
    where: { id: 'course_public_speaking' },
    update: {
      title: 'Public Speaking & Presentation: Impact & Influence',
      description: 'Master public speaking and professional presentations. Transform your communication skills from basic to extraordinary.',
      difficulty: 'INTERMEDIATE',
      duration: 760, // 12h 40m = 760 minutes
      isActive: true,
      instructorId: instructor.id,
    },
    create: {
      id: 'course_public_speaking',
      title: 'Public Speaking & Presentation: Impact & Influence',
      description: 'Master public speaking and professional presentations. Transform your communication skills from basic to extraordinary.',
      difficulty: 'INTERMEDIATE',
      duration: 760, // 12h 40m = 760 minutes
      isActive: true,
      instructorId: instructor.id,
    },
  })
  console.log('✅ Created course:', course.title)

  // Define the complete curriculum with 50 lessons
  const lessonsData = [
    // Module 1: The Psychology of Performance (5 lessons, 75 min)
    { order: 101, title: 'Understanding Your Speaking Identity', duration: 15 },
    { order: 102, title: 'The Science of Adrenaline and Performance', duration: 18 },
    { order: 103, title: 'Reframing Nervous Energy into Power', duration: 16 },
    { order: 104, title: 'Conquering Imposter Syndrome', duration: 14 },
    { order: 105, title: 'Building Pre-Presentation Rituals', duration: 12 },

    // Module 2: Advanced Presentation Structure (5 lessons, 83 min)
    { order: 201, title: 'Crafting a Compelling Opening Hook', duration: 18 },
    { order: 202, title: 'The Narrative Arc in Business Presentations', duration: 20 },
    { order: 203, title: 'Mastering Smooth Transitions Between Ideas', duration: 15 },
    { order: 204, title: 'The Strategic Use of Pauses and Silence', duration: 12 },
    { order: 205, title: 'Designing Memorable Closures and Calls to Action', duration: 18 },

    // Module 3: Visual Rhetoric and Slide Design (5 lessons, 83 min)
    { order: 301, title: 'Cognitive Load Theory for Presentations', duration: 16 },
    { order: 302, title: 'Creating Impactful Data Visualizations', duration: 20 },
    { order: 303, title: 'Beyond Bullet Points: Visual Storytelling', duration: 18 },
    { order: 304, title: 'The 10-20-30 Rule and Modern Adaptations', duration: 14 },
    { order: 305, title: 'Interacting with Slides Without Breaking Flow', duration: 15 },

    // Module 4: Vocal Mastery and Delivery (5 lessons, 80 min)
    { order: 401, title: 'Diaphragmatic Breathing and Voice Projection', duration: 15 },
    { order: 402, title: 'Finding Your Authoritative Voice', duration: 18 },
    { order: 403, title: 'Mastering Pace, Tempo, and Rhythm', duration: 16 },
    { order: 404, title: 'Eliminating Filler Words Effectively', duration: 14 },
    { order: 405, title: 'Using Tonal Variety to Convey Emotion', duration: 17 },

    // Module 5: Body Language and Presence (5 lessons, 76 min)
    { order: 501, title: 'The Power Stance and Confident Physiology', duration: 16 },
    { order: 502, title: 'Purposeful Gestures and Movement', duration: 18 },
    { order: 503, title: 'Eye Contact Strategies for Any Audience Size', duration: 15 },
    { order: 504, title: 'Stage Anchoring and Strategic Movement', duration: 14 },
    { order: 505, title: 'Facial Expressions and Emotional Connection', duration: 13 },

    // Module 6: Audience Engagement and Dynamics (5 lessons, 76 min)
    { order: 601, title: 'Reading and Calibrating to Your Audience', duration: 17 },
    { order: 602, title: 'Interactive Elements and Participation Techniques', duration: 16 },
    { order: 603, title: 'Using Humor Professionally and Safely', duration: 18 },
    { order: 604, title: 'Handling Difficult Audience Behaviors', duration: 15 },
    { order: 605, title: 'Customizing Content for Different Stakeholders', duration: 14 },

    // Module 7: The Art of Persuasion (5 lessons, 82 min)
    { order: 701, title: 'Ethos, Pathos, and Logos in Modern Presentations', duration: 18 },
    { order: 702, title: 'The Rule of Three and Rhetorical Devices', duration: 16 },
    { order: 703, title: 'Crafting Powerful Analogies and Metaphors', duration: 17 },
    { order: 704, title: 'Leveraging Social Proof and Authority', duration: 15 },
    { order: 705, title: 'Framing and Anchoring for Maximum Impact', duration: 16 },

    // Module 8: Handling the Unexpected (5 lessons, 70 min)
    { order: 801, title: 'Preparing for Q&A Sessions', duration: 14 },
    { order: 802, title: 'Bridging Techniques for Difficult Questions', duration: 16 },
    { order: 803, title: 'Managing Hostile Questions and Hecklers', duration: 15 },
    { order: 804, title: 'Recovering from Technical Difficulties', duration: 13 },
    { order: 805, title: 'Gracefully Handling the Unknown', duration: 12 },

    // Module 9: Virtual and Hybrid Presentations (5 lessons, 80 min)
    { order: 901, title: 'Camera Eye Contact for Virtual Impact', duration: 15 },
    { order: 902, title: 'Professional Lighting and Audio Setup', duration: 18 },
    { order: 903, title: 'Maintaining Engagement on Video Calls', duration: 16 },
    { order: 904, title: 'Screen Sharing and Virtual Presentation Tools', duration: 14 },
    { order: 905, title: 'Hybrid Presentation Mastery', duration: 17 },

    // Module 10: Professional Application and Capstone (5 lessons, 81 min)
    { order: 1001, title: 'Crafting the Perfect Elevator Pitch', duration: 15 },
    { order: 1002, title: 'Panel Discussion Participation and Moderation', duration: 18 },
    { order: 1003, title: 'Keynote Speaking Fundamentals', duration: 20 },
    { order: 1004, title: 'Building Your Personal Presentation Style', duration: 16 },
    { order: 1005, title: 'Creating Your Development Action Plan', duration: 12 },
  ]

  // Create all lessons
  let lessonsCreated = 0
  for (const lessonData of lessonsData) {
    const lessonId = `psp_lesson_${lessonData.order}`
    
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
        courseId: course.id,
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
    where: { id: course.id },
    include: {
      _count: {
        select: { lessons: true }
      }
    }
  })

  console.log('📊 Final Course Stats:')
  console.log(`  - Course: ${finalCourse?.title}`)
  console.log(`  - Lessons: ${finalCourse?._count.lessons}`)
  console.log(`  - Duration: ${finalCourse?.duration} minutes`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
