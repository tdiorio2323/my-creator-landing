import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis

// Only create Prisma client on server side
const createPrismaClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('PrismaClient is not supported in the browser')
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query','error','warn'] : ['error']
  })
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
