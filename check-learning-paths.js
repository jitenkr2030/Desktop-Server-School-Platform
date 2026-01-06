const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const paths = await prisma.learningPath.findMany({
    select: { id: true, title: true }
  })
  console.log('Available Learning Paths:')
  console.log(JSON.stringify(paths, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
