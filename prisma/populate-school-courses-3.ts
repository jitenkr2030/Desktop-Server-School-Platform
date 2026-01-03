import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating lessons for final School Category courses (school20-school22)...')

  // school20: Physics Class 11 (ADVANCED, 310 min) - 3 modules x 100 lessons + 1 module x 10 lessons
  const school20 = await prisma.course.findUnique({ where: { id: 'school20' } })
  if (school20) {
    console.log('Creating lessons for school20: Physics Class 11...')
    await prisma.lesson.deleteMany({ where: { courseId: school20.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school20.id,
        title: `Mechanics & Gravitation - Lesson ${i}`,
        content: `Detailed lesson covering advanced mechanics and universal gravitation for Class 11. This lesson explores rotational dynamics, moment of inertia, gravitational fields, Kepler's laws, and satellite motion with calculus-based analysis.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school20.id,
        title: `Thermodynamics & Kinetic Theory - Lesson ${i}`,
        content: `Comprehensive lesson exploring thermodynamics and kinetic theory for Class 11. This lesson covers laws of thermodynamics, heat transfer, kinetic molecular theory, and introduces concepts of entropy and energy conservation.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school20.id,
        title: `Oscillations & Waves - Lesson ${i}`,
        content: `Engaging lesson covering simple harmonic motion and wave phenomena for Class 11. This lesson explores spring-mass systems, pendulums, wave properties, sound waves, and Doppler effect with mathematical rigor.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 10; i++) {
      lessons.push({
        courseId: school20.id,
        title: `Modern Physics Introduction - Lesson ${i}`,
        content: `Introductory lesson to modern physics concepts for Class 11. This lesson covers photoelectric effect, atomic models, wave-particle duality, and introduces quantum mechanics principles and special relativity basics.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 300 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 310 lessons for Physics Class 11')
  }

  // school21: Chemistry Class 11 (ADVANCED, 320 min) - 3 modules x 100 lessons + 1 module x 20 lessons
  const school21 = await prisma.course.findUnique({ where: { id: 'school21' } })
  if (school21) {
    console.log('Creating lessons for school21: Chemistry Class 11...')
    await prisma.lesson.deleteMany({ where: { courseId: school21.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school21.id,
        title: `Atomic Structure & Quantum Mechanics - Lesson ${i}`,
        content: `Detailed lesson covering atomic structure and quantum mechanical models for Class 11. This lesson explores Bohr model limitations, quantum numbers, electron configurations, and introduces wave mechanical approach to atomic theory.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school21.id,
        title: `Chemical Bonding & Molecular Structure - Lesson ${i}`,
        content: `Comprehensive lesson exploring chemical bonding theories for Class 11. This lesson covers ionic and covalent bonding, VSEPR theory, hybridization, molecular orbital theory, and intermolecular forces with structural analysis.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school21.id,
        title: `Thermodynamics & Chemical Equilibrium - Lesson ${i}`,
        content: `Engaging lesson covering thermodynamics and equilibrium for Class 11. This lesson explores enthalpy, entropy, Gibbs free energy, equilibrium constants, Le Chatelier's principle, and Gibbs phase rule with practical applications.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 20; i++) {
      lessons.push({
        courseId: school21.id,
        title: `Organic Chemistry Fundamentals - Lesson ${i}`,
        content: `Introductory lesson to organic chemistry for Class 11. This lesson covers carbon bonding, functional groups, IUPAC nomenclature, isomerism, and introduces reaction mechanisms and stereochemistry basics.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 300 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 320 lessons for Chemistry Class 11')
  }

  // school22: Biology Class 12 (ADVANCED, 330 min) - 3 modules x 100 lessons + 1 module x 30 lessons
  const school22 = await prisma.course.findUnique({ where: { id: 'school22' } })
  if (school22) {
    console.log('Creating lessons for school22: Biology Class 12...')
    await prisma.lesson.deleteMany({ where: { courseId: school22.id } })
    const lessons = []
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school22.id,
        title: `Genetics & Molecular Biology - Lesson ${i}`,
        content: `Detailed lesson covering advanced genetics and molecular biology for Class 12. This lesson explores gene expression, regulation, recombinant DNA technology, genetic engineering, genomics, and ethical considerations in biotechnology.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school22.id,
        title: `Human Physiology & Reproduction - Lesson ${i}`,
        content: `Comprehensive lesson exploring human body systems and reproduction for Class 12. This lesson covers nervous, endocrine, immune systems, human reproductive biology, embryonic development, and health disorders with clinical correlations.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 100 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 100; i++) {
      lessons.push({
        courseId: school22.id,
        title: `Ecology & Environment - Lesson ${i}`,
        content: `Engaging lesson covering ecology, biodiversity, and environmental science for Class 12. This lesson explores ecosystems, population ecology, conservation biology, pollution, climate change, and sustainable development with current research.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 200 + i,
        isActive: true,
      })
    }
    for (let i = 1; i <= 30; i++) {
      lessons.push({
        courseId: school22.id,
        title: `Biology in Medicine & Research - Lesson ${i}`,
        content: `Advanced lesson connecting biology to medical and research applications for Class 12. This lesson covers immunology, disease mechanisms, stem cell research, pharmacology, bioinformatics, and career pathways in biological sciences.`,
        videoUrl: 'https://example.com/video',
        duration: 1,
        order: 300 + i,
        isActive: true,
      })
    }
    await prisma.lesson.createMany({ data: lessons })
    console.log('Created 330 lessons for Biology Class 12')
  }

  console.log('All School Category courses have been populated!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
