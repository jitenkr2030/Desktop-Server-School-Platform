import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating lessons for School Category courses...')

  // school2: English Grammar Grade 1 (BEGINNER, 100 min) - 1 module x 100 lessons
  const school2 = await prisma.course.findUnique({ where: { id: 'school2' } })
  if (school2) {
    console.log('Creating lessons for school2: English Grammar Grade 1...')
    await prisma.lesson.deleteMany({ where: { courseId: school2.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school2.id,
        title: `English Grammar Basics - Lesson ${i}`,
        content: `Foundational lesson covering essential English grammar concepts for Grade 1 students. This lesson introduces basic sentence structure, simple nouns, verbs, and fundamental language skills appropriate for young learners beginning their English language journey.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 100 lessons for English Grammar Grade 1')
  }

  // school3: Mathematics Grade 2 (BEGINNER, 140 min) - 1 module x 100 lessons + 1 module x 40 lessons
  const school3 = await prisma.course.findUnique({ where: { id: 'school3' } })
  if (school3) {
    console.log('Creating lessons for school3: Mathematics Grade 2...')
    await prisma.lesson.deleteMany({ where: { courseId: school3.id } })
    const lessons = []
    // Module 1: 100 lessons
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school3.id,
        title: `Number Sense & Operations - Lesson ${i}`,
        content: `Comprehensive lesson covering foundational mathematics concepts for Grade 2. This lesson develops number sense, addition and subtraction skills, and introduces basic problem-solving strategies appropriate for early elementary learners.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    // Module 2: 40 lessons
    for (let i = 1; i <= 40; i++) {
      lessons.push({
        courseId: school3.id,
        title: `Geometry & Measurement - Lesson ${i}`,
        content: `Comprehensive lesson covering geometry and measurement concepts for Grade 2. This lesson explores shapes, patterns, time telling, and basic measurement skills to build spatial awareness and practical math abilities.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 140 lessons for Mathematics Grade 2')
  }

  // school4: Science Fundamentals Grade 3 (BEGINNER, 150 min) - 1 module x 100 lessons + 1 module x 50 lessons
  const school4 = await prisma.course.findUnique({ where: { id: 'school4' } })
  if (school4) {
    console.log('Creating lessons for school4: Science Fundamentals Grade 3...')
    await prisma.lesson.deleteMany({ where: { courseId: school4.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school4.id,
        title: `Living Things & Nature - Lesson ${i}`,
        content: `Engaging lesson exploring the natural world for Grade 3 students. This lesson covers plants, animals, ecosystems, and basic scientific observation skills to foster curiosity and understanding of the environment.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 50; i++) {
      lessons.push({
        courseId: school4.id,
        title: `Earth & Space Science - Lesson ${i}`,
        content: `Comprehensive lesson introducing earth and space science for Grade 3. This lesson explores weather, seasons, the solar system, and basic geological concepts to expand students' understanding of their planet and beyond.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 150 lessons for Science Fundamentals Grade 3')
  }

  // school5: Mathematics Grade 3 (BEGINNER, 160 min) - 1 module x 100 lessons + 1 module x 60 lessons
  const school5 = await prisma.course.findUnique({ where: { id: 'school5' } })
  if (school5) {
    console.log('Creating lessons for school5: Mathematics Grade 3...')
    await prisma.lesson.deleteMany({ where: { courseId: school5.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school5.id,
        title: `Multiplication & Division - Lesson ${i}`,
        content: `Detailed lesson covering multiplication and division concepts for Grade 3. This lesson develops fluency with times tables, introduces division as inverse operation, and builds foundational skills for higher-level mathematics.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 60; i++) {
      lessons.push({
        courseId: school5.id,
        title: `Fractions & Data Handling - Lesson ${i}`,
        content: `Comprehensive lesson introducing fractions and data analysis for Grade 3. This lesson explores parts of a whole, basic fractions, and simple data representation through charts and graphs.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 160 lessons for Mathematics Grade 3')
  }

  // school6: English Literature Grade 4 (BEGINNER, 180 min) - 1 module x 100 lessons + 1 module x 80 lessons
  const school6 = await prisma.course.findUnique({ where: { id: 'school6' } })
  if (school6) {
    console.log('Creating lessons for school6: English Literature Grade 4...')
    await prisma.lesson.deleteMany({ where: { courseId: school6.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school6.id,
        title: `Reading Comprehension - Lesson ${i}`,
        content: `Engaging lesson developing reading skills for Grade 4 students. This lesson explores various text types, improves comprehension strategies, and builds vocabulary through exposure to quality children's literature.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 80; i++) {
      lessons.push({
        courseId: school6.id,
        title: `Literature Analysis - Lesson ${i}`,
        content: `Comprehensive lesson introducing literary analysis for Grade 4. This lesson develops understanding of story elements, character analysis, theme identification, and creative writing skills through exposure to classic and contemporary literature.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 180 lessons for English Literature Grade 4')
  }

  // school7: Mathematics Grade 4 (INTERMEDIATE, 170 min) - 1 module x 100 lessons + 1 module x 70 lessons
  const school7 = await prisma.course.findUnique({ where: { id: 'school7' } })
  if (school7) {
    console.log('Creating lessons for school7: Mathematics Grade 4...')
    await prisma.lesson.deleteMany({ where: { courseId: school7.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school7.id,
        title: `Advanced Operations - Lesson ${i}`,
        content: `Detailed lesson covering advanced arithmetic operations for Grade 4. This lesson develops fluency with multi-digit multiplication, long division, and introduces algebraic thinking through pattern recognition.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 70; i++) {
      lessons.push({
        courseId: school7.id,
        title: `Decimals & Advanced Geometry - Lesson ${i}`,
        content: `Comprehensive lesson introducing decimals and advanced geometry for Grade 4. This lesson explores decimal place value, operations with decimals, and complex geometric shapes and their properties.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 170 lessons for Mathematics Grade 4')
  }

  // school8: Science Grade 5 (INTERMEDIATE, 190 min) - 1 module x 100 lessons + 1 module x 90 lessons
  const school8 = await prisma.course.findUnique({ where: { id: 'school8' } })
  if (school8) {
    console.log('Creating lessons for school8: Science Grade 5...')
    await prisma.lesson.deleteMany({ where: { courseId: school8.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school8.id,
        title: `Matter & Energy - Lesson ${i}`,
        content: `Comprehensive lesson exploring states of matter and energy forms for Grade 5. This lesson covers solids, liquids, gases, energy transfer, and introduces basic chemistry concepts through engaging experiments and demonstrations.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 90; i++) {
      lessons.push({
        courseId: school8.id,
        title: `Life Science & Ecosystems - Lesson ${i}`,
        content: `Detailed lesson covering life science and ecological concepts for Grade 5. This lesson explores cell structure, body systems, food chains, ecosystems, and environmental conservation to build scientific literacy.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 190 lessons for Science Grade 5')
  }

  // school9: Mathematics Grade 6 (INTERMEDIATE, 200 min) - 2 modules x 100 lessons each
  const school9 = await prisma.course.findUnique({ where: { id: 'school9' } })
  if (school9) {
    console.log('Creating lessons for school9: Mathematics Grade 6...')
    await prisma.lesson.deleteMany({ where: { courseId: school9.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school9.id,
        title: `Number Theory & Fractions - Lesson ${i}`,
        content: `Detailed lesson covering advanced number theory and fraction operations for Grade 6. This lesson explores greatest common factors, least common multiples, equivalent fractions, and operations with unlike denominators.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school9.id,
        title: `Ratios & Proportional Reasoning - Lesson ${i}`,
        content: `Comprehensive lesson introducing ratios and proportional thinking for Grade 6. This lesson develops understanding of rates, unit rates, percentages, and real-world applications of proportional reasoning.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 200 lessons for Mathematics Grade 6')
  }

  // school10: Science Grade 6 (INTERMEDIATE, 210 min) - 2 modules x 100 lessons + 1 module x 10 lessons
  const school10 = await prisma.course.findUnique({ where: { id: 'school10' } })
  if (school10) {
    console.log('Creating lessons for school10: Science Grade 6...')
    await prisma.lesson.deleteMany({ where: { courseId: school10.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school10.id,
        title: `Scientific Method & Inquiry - Lesson ${i}`,
        content: `Comprehensive lesson developing scientific inquiry skills for Grade 6. This lesson covers the scientific method, hypothesis testing, data collection, analysis techniques, and introduces laboratory safety and procedures.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school10.id,
        title: `Earth Systems Science - Lesson ${i}`,
        content: `Detailed lesson exploring earth systems for Grade 6. This lesson covers geology, meteorology, oceanography, and atmospheric science to develop understanding of Earth's dynamic systems and processes.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 10; i++) {
      lessons.push({
        courseId: school10.id,
        title: `Scientific Applications - Lesson ${i}`,
        content: `Engaging lesson connecting science to real-world applications for Grade 6. This lesson explores technology, engineering applications of science, and prepares students for advanced scientific study.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 210 lessons for Science Grade 6')
  }

  console.log('Continuing with remaining school courses...')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
