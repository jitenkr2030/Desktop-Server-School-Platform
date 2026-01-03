import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Continuing with remaining School Category courses (school11-school22)...')

  // school11: English Literature Grade 7 (INTERMEDIATE, 220 min) - 2 modules x 100 lessons + 1 module x 20 lessons
  const school11 = await prisma.course.findUnique({ where: { id: 'school11' } })
  if (school11) {
    console.log('Creating lessons for school11: English Literature Grade 7...')
    await prisma.lesson.deleteMany({ where: { courseId: school11.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school11.id,
        title: `Classic Literature - Lesson ${i}`,
        content: `Comprehensive lesson exploring classic and contemporary literature for Grade 7. This lesson develops critical reading skills, introduces literary periods, and builds appreciation for diverse literary traditions and voices.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school11.id,
        title: `Writing & Composition - Lesson ${i}`,
        content: `Detailed lesson developing advanced writing skills for Grade 7. This lesson covers argumentative writing, research techniques, rhetorical strategies, and revision processes to prepare for academic writing.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 20; i++) {
      lessons.push({
        courseId: school11.id,
        title: `Speech & Presentation - Lesson ${i}`,
        content: `Engaging lesson developing public speaking and presentation skills for Grade 7. This lesson covers speech structure, delivery techniques, visual aid creation, and builds confidence for oral communication.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 220 lessons for English Literature Grade 7')
  }

  // school12: Mathematics Grade 7 (INTERMEDIATE, 230 min) - 2 modules x 100 lessons + 1 module x 30 lessons
  const school12 = await prisma.course.findUnique({ where: { id: 'school12' } })
  if (school12) {
    console.log('Creating lessons for school12: Mathematics Grade 7...')
    await prisma.lesson.deleteMany({ where: { courseId: school12.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school12.id,
        title: `Algebraic Expressions - Lesson ${i}`,
        content: `Detailed lesson introducing algebraic expressions and operations for Grade 7. This lesson develops skills in simplifying expressions, evaluating formulas, and understanding variables as foundational algebraic concepts.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school12.id,
        title: `Equations & Inequalities - Lesson ${i}`,
        content: `Comprehensive lesson covering linear equations and inequalities for Grade 7. This lesson develops problem-solving strategies, introduces two-step equations, and builds understanding of mathematical modeling.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 30; i++) {
      lessons.push({
        courseId: school12.id,
        title: `Probability & Statistics - Lesson ${i}`,
        content: `Engaging lesson introducing probability and statistics for Grade 7. This lesson covers data analysis, probability calculations, sampling techniques, and interpreting statistical information from real-world contexts.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 230 lessons for Mathematics Grade 7')
  }

  // school13: Science Grade 8 (ADVANCED, 240 min) - 2 modules x 100 lessons + 1 module x 40 lessons
  const school13 = await prisma.course.findUnique({ where: { id: 'school13' } })
  if (school13) {
    console.log('Creating lessons for school13: Science Grade 8...')
    await prisma.lesson.deleteMany({ where: { courseId: school13.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school13.id,
        title: `Chemistry Fundamentals - Lesson ${i}`,
        content: `Comprehensive lesson introducing chemistry for Grade 8. This lesson covers atomic structure, periodic table trends, chemical bonds, reactions, and introduces laboratory techniques and safety procedures.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school13.id,
        title: `Physics: Forces & Motion - Lesson ${i}`,
        content: `Detailed lesson covering forces and motion for Grade 8. This lesson explores Newton's laws, velocity, acceleration, momentum, and introduces concepts of work, power, and energy transfer.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 40; i++) {
      lessons.push({
        courseId: school13.id,
        title: `Scientific Integration - Lesson ${i}`,
        content: `Engaging lesson connecting chemistry and physics concepts for Grade 8. This lesson explores interdisciplinary applications, engineering principles, and prepares students for high school science courses.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 240 lessons for Science Grade 8')
  }

  // school14: Mathematics Grade 9 (ADVANCED, 250 min) - 2 modules x 100 lessons + 1 module x 50 lessons
  const school14 = await prisma.course.findUnique({ where: { id: 'school14' } })
  if (school14) {
    console.log('Creating lessons for school14: Mathematics Grade 9...')
    await prisma.lesson.deleteMany({ where: { courseId: school14.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school14.id,
        title: `Linear Equations & Functions - Lesson ${i}`,
        content: `Detailed lesson covering linear equations and functions for Grade 9. This lesson develops understanding of slope, intercepts, direct variation, and introduces function notation as preparation for advanced algebra.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school14.id,
        title: `Polynomials & Factoring - Lesson ${i}`,
        content: `Comprehensive lesson introducing polynomials and factoring techniques for Grade 9. This lesson covers polynomial operations, special factoring patterns, and solving polynomial equations through various methods.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 50; i++) {
      lessons.push({
        courseId: school14.id,
        title: `Quadratic Functions - Lesson ${i}`,
        content: `Engaging lesson exploring quadratic functions for Grade 9. This lesson covers parabolas, vertex form, quadratic formula, and applications of quadratic modeling in real-world situations.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 250 lessons for Mathematics Grade 9')
  }

  // school15: Physics Grade 9 (ADVANCED, 260 min) - 2 modules x 100 lessons + 1 module x 60 lessons
  const school15 = await prisma.course.findUnique({ where: { id: 'school15' } })
  if (school15) {
    console.log('Creating lessons for school15: Physics Grade 9...')
    await prisma.lesson.deleteMany({ where: { courseId: school15.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school15.id,
        title: `Mechanics & Motion - Lesson ${i}`,
        content: `Comprehensive lesson covering mechanics and motion for Grade 9. This lesson explores kinematics, dynamics, vectors, projectile motion, and circular motion with mathematical rigor and practical applications.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school15.id,
        title: `Energy & Work - Lesson ${i}`,
        content: `Detailed lesson exploring energy, work, and power for Grade 9. This lesson covers kinetic and potential energy, conservation of energy, work calculations, and efficiency in mechanical systems.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 60; i++) {
      lessons.push({
        courseId: school15.id,
        title: `Waves & Optics - Lesson ${i}`,
        content: `Engaging lesson introducing wave properties and optics for Grade 9. This lesson covers wave characteristics, sound, light reflection, refraction, and introduces basic optical instruments and their applications.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 260 lessons for Physics Grade 9')
  }

  // school16: Chemistry Grade 10 (ADVANCED, 270 min) - 2 modules x 100 lessons + 1 module x 70 lessons
  const school16 = await prisma.course.findUnique({ where: { id: 'school16' } })
  if (school16) {
    console.log('Creating lessons for school16: Chemistry Grade 10...')
    await prisma.lesson.deleteMany({ where: { courseId: school16.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school16.id,
        title: `Atomic Structure & Periodicity - Lesson ${i}`,
        content: `Detailed lesson covering atomic theory and periodic trends for Grade 10. This lesson explores electron configuration, periodic properties, bonding theories, and molecular geometry with advanced nomenclature.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school16.id,
        title: `Chemical Reactions & Stoichiometry - Lesson ${i}`,
        content: `Comprehensive lesson exploring chemical reactions and quantitative analysis for Grade 10. This lesson covers reaction types, balancing equations, mole concept, and stoichiometric calculations with laboratory applications.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 70; i++) {
      lessons.push({
        courseId: school16.id,
        title: `Acids, Bases & Equilibrium - Lesson ${i}`,
        content: `Engaging lesson introducing acid-base chemistry and equilibrium for Grade 10. This lesson covers pH scale, titration, buffer systems, and introduces chemical equilibrium principles and Le Chatelier's principle.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 270 lessons for Chemistry Grade 10')
  }

  // school17: Biology Grade 10 (ADVANCED, 280 min) - 2 modules x 100 lessons + 1 module x 80 lessons
  const school17 = await prisma.course.findUnique({ where: { id: 'school17' } })
  if (school17) {
    console.log('Creating lessons for school17: Biology Grade 10...')
    await prisma.lesson.deleteMany({ where: { courseId: school17.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school17.id,
        title: `Cell Biology & Genetics - Lesson ${i}`,
        content: `Comprehensive lesson covering cell structure, organelles, and genetics for Grade 10. This lesson explores DNA replication, protein synthesis, Mendelian genetics, and introduces modern genetic concepts and biotechnology applications.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school17.id,
        title: `Evolution & Ecology - Lesson ${i}`,
        content: `Detailed lesson exploring evolutionary theory and ecological relationships for Grade 10. This lesson covers natural selection, speciation, population dynamics, food webs, and environmental conservation with current scientific research.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 80; i++) {
      lessons.push({
        courseId: school17.id,
        title: `Human Body Systems - Lesson ${i}`,
        content: `Engaging lesson covering human anatomy and physiology for Grade 10. This lesson explores body systems including digestive, respiratory, circulatory, nervous, and endocrine systems with emphasis on health and disease.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 280 lessons for Biology Grade 10')
  }

  // school18: Mathematics Grade 10 (ADVANCED, 290 min) - 2 modules x 100 lessons + 1 module x 90 lessons
  const school18 = await prisma.course.findUnique({ where: { id: 'school18' } })
  if (school18) {
    console.log('Creating lessons for school18: Mathematics Grade 10...')
    await prisma.lesson.deleteMany({ where: { courseId: school18.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school18.id,
        title: `Geometry & Trigonometry - Lesson ${i}`,
        content: `Detailed lesson covering geometry and trigonometric concepts for Grade 10. This lesson explores similarity, congruence, trigonometric ratios, and their applications in solving geometric problems and real-world scenarios.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school18.id,
        title: `Advanced Functions - Lesson ${i}`,
        content: `Comprehensive lesson introducing advanced functions for Grade 10. This lesson covers polynomial, rational, exponential, and logarithmic functions with emphasis on transformations, inverses, and modeling applications.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 90; i++) {
      lessons.push({
        courseId: school18.id,
        title: `Coordinate Geometry - Lesson ${i}`,
        content: `Engaging lesson exploring coordinate geometry and conic sections for Grade 10. This lesson covers circles, ellipses, parabolas, hyperbolas, and introduces geometric reasoning through algebraic representation.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 290 lessons for Mathematics Grade 10')
  }

  // school19: Advanced Mathematics Class 11 (ADVANCED, 300 min) - 3 modules x 100 lessons each
  const school19 = await prisma.course.findUnique({ where: { id: 'school19' } })
  if (school19) {
    console.log('Creating lessons for school19: Advanced Mathematics Class 11...')
    await prisma.lesson.deleteMany({ where: { courseId: school19.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school19.id,
        title: `Calculus: Limits & Derivatives - Lesson ${i}`,
        content: `Detailed lesson introducing limits and differentiation for Class 11. This lesson covers limit laws, continuity, derivative rules, applications of derivatives, and introduces calculus as a tool for analyzing change.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school19.id,
        title: `Trigonometry & Complex Numbers - Lesson ${i}`,
        content: `Comprehensive lesson covering advanced trigonometry and complex numbers for Class 11. This lesson explores trigonometric identities, inverse functions, De Moivre's theorem, and complex plane representations.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school19.id,
        title: `Sequences, Series & Probability - Lesson ${i}`,
        content: `Engaging lesson exploring sequences, series, and probability theory for Class 11. This lesson covers arithmetic and geometric progressions, binomial theorem, permutations, combinations, and probability distributions.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 300 lessons for Advanced Mathematics Class 11')
  }

  console.log('Continuing with final school courses...')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
