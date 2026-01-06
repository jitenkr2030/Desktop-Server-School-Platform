const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Creating ACCA Level 3 (Strategic Professional) course record...');

  // Create the main course record
  const course = await prisma.course.upsert({
    where: { id: 'acca_level3' },
    update: {
      title: 'ACCA Level 3 (Strategic Professional) – Complete Course',
      description: 'Complete preparation for ACCA Strategic Professional level including Essentials (SBL, SBR) and Options (AFM, AAA, APM, ATX) papers.',
      duration: 320,
      difficulty: 'ADVANCED',
      thumbnail: '/assets/courses/acca-level3.svg',
      isActive: true,
      courseType: 'GENERAL',
    },
    create: {
      id: 'acca_level3',
      title: 'ACCA Level 3 (Strategic Professional) – Complete Course',
      description: 'Complete preparation for ACCA Strategic Professional level including Essentials (SBL, SBR) and Options (AFM, AAA, APM, ATX) papers.',
      duration: 320,
      difficulty: 'ADVANCED',
      thumbnail: '/assets/courses/acca-level3.svg',
      isActive: true,
      courseType: 'GENERAL',
      instructorId: 'inst-professional-courses',
    },
  });

  console.log('Course created:', course.id);
  console.log('Title:', course.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
