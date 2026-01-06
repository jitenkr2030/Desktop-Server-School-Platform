const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const instructors = await prisma.instructor.findMany({
    select: { id: true, name: true }
  })
  console.log('Available Instructors:')
  console.log(JSON.stringify(instructors, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
