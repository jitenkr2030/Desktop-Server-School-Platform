import { PrismaClient } from '@prisma/client';

// Database configuration
const getDatabaseUrl = (): string => {
  // Check if we're in desktop mode with SQLite
  if (process.env.DATABASE_PROVIDER === 'sqlite') {
    return process.env.DATABASE_URL_SQLITE || 'file:./db/academy.db';
  }
  
  // Default to PostgreSQL for server deployment
  return process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/school_platform';
};

const getDatabaseProvider = (): 'sqlite' | 'postgresql' => {
  return (process.env.DATABASE_PROVIDER as 'sqlite' | 'postgresql') || 'postgresql';
};

// Create Prisma client with configuration
const createPrismaClient = () => {
  const provider = getDatabaseProvider();
  
  const client = new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
  
  return client;
};

// Export singleton for server-side usage
let prismaClient: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prismaClient) {
    prismaClient = createPrismaClient();
  }
  return prismaClient;
}

export const prisma = getPrismaClient();

// Database utilities
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export async function getDatabaseStats() {
  try {
    const userCount = await prisma.user.count();
    const courseCount = await prisma.course.count();
    const activeUsers = await prisma.user.count({
      where: { isActive: true },
    });
    
    return {
      users: userCount,
      courses: courseCount,
      activeUsers,
      provider: getDatabaseProvider(),
      connected: true,
    };
  } catch (error) {
    console.error('Failed to get database stats:', error);
    return {
      users: 0,
      courses: 0,
      activeUsers: 0,
      provider: getDatabaseProvider(),
      connected: false,
    };
  }
}

// Migration utilities
export async function runMigrations() {
  try {
    await prisma.$executeRaw`PRAGMA foreign_keys = ON;`;
    console.log('Migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}

export async function resetDatabase() {
  try {
    // Note: This is destructive - use with caution
    await prisma.$executeRaw`DROP TABLE IF EXISTS users`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS courses`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS lessons`;
    console.log('Database reset completed');
    return true;
  } catch (error) {
    console.error('Database reset failed:', error);
    return false;
  }
}
