import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking database connection...\n')

  try {
    // Check if connection works
    await prisma.$connect()
    console.log('✅ Database connected successfully!\n')

    // Get all table counts
    console.log('📊 Table Counts:\n')
    
    const tableNames = [
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

    for (const table of tableNames) {
      try {
        const count = await (prisma as any)[table].count()
        console.log(`  ${table}: ${count} records`)
      } catch (e) {
        console.log(`  ${table}: table not found or error`)
      }
    }

    console.log('\n✅ Database check complete!')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
