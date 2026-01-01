const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking database connection...\n')

  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully!\n')

    console.log('📊 Table Counts:\n')
    
    const tables = [
      'user',
      'course',
      'instructor',
      'category',
      'subscription',
      'paymentRecord',
      'lesson',
      'courseProgress',
      'assessment',
      'certificate',
      'discussion',
      'platformSettings'
    ]

    for (const table of tables) {
      try {
        const model = prisma[table]
        if (model && typeof model.count === 'function') {
          const count = await model.count()
          console.log(`  ${table}: ${count} records`)
        } else {
          console.log(`  ${table}: model not found`)
        }
      } catch (e) {
        console.log(`  ${table}: error - ${e.message}`)
      }
    }

    console.log('\n✅ Database check complete!')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
