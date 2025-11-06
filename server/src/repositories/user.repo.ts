import { prisma } from '../lib/db'
import { UserRole } from '@prisma/client'

// Helper to retry on prepared statement errors
const retryQuery = async <T>(fn: () => Promise<T>): Promise<T> => {
  let lastError: any
  for (let i = 0; i < 3; i++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      if (error?.code === '42P05' && error?.message?.includes('prepared statement')) {
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)))
        continue
      }
      throw error
    }
  }
  throw lastError
}

export const userRepo = {
  findByEmail: (email: string) =>
    retryQuery(() => prisma.user.findUnique({ where: { email } })),

  create: (data: {
    email: string
    name?: string | null
    passwordHash: string
    role?: UserRole
  }) =>
    retryQuery(() =>
      prisma.user.create({
        data: {
          ...data,
          name: data.name ?? null,
          role: data.role || 'STUDENT',
        },
      })
    ),

  findByIdPublic: (id: string) =>
    retryQuery(() =>
      prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isOrganizer: true,
          createdAt: true,
        },
      })
    ),

  findById: (id: string) => retryQuery(() => prisma.user.findUnique({ where: { id } })),

  update: (id: string, data: any) =>
    retryQuery(() => prisma.user.update({ where: { id }, data })),
}
