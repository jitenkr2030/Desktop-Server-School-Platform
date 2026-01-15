import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

export const prisma = db

// For backward compatibility - some files import createClient
export const createClient = db

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db