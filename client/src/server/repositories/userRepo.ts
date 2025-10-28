import { prisma } from "@/lib/db";

export const userRepo = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  create: (data: { email: string; name?: string; passwordHash: string }) =>
    prisma.user.create({ data }),

  findByIdPublic: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true }
    }),
};
