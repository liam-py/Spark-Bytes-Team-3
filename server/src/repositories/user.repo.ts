import { prisma } from '../lib/db'

export const userRepo = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  create: (data: { email: string; name?: string | null; passwordHash: string }) =>
    prisma.user.create({
      data: { ...data, name: data.name ?? null }, // 关键：把 undefined 归一成 null
    }),

  findByIdPublic: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true },
    }),
}
