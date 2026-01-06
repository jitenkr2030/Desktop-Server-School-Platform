const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Checking if US CMA Part 2 course exists...\n');

  const courseId = 'us_cma_part2';
  
  // Check if course exists
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
    },
    include: {
      _count: {
        select: {
          lessons: true,
          assessments: true,
        },
      },
    },
  });

  if (course) {
    console.log('✅ Course found!');
    console.log('Course ID:', course.id);
    console.log('Course Title:', course.title);
    console.log('Description:', course.description);
    console.log('Number of Lessons:', course._count.lessons);
    console.log('Number of Assessments:', course._count.assessments);
    console.log('Duration:', course.duration, 'minutes');
    console.log('Is Active:', course.isActive);
    console.log('Difficulty:', course.difficulty);
  } else {
    console.log('❌ Course not found!');
    console.log('Course ID:', courseId);
    console.log('You need to create this course first before adding lessons.');
  }
}

main()
  .catch((e) => {
    console.error('Error checking course:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
