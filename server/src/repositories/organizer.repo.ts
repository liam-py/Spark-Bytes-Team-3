import { prisma } from '../lib/db'

export const organizerRepo = {
  requestOrganizerStatus: async (userId: string) => {
    return prisma.user.update({
      where: { id: userId },
      data: { isVerified: false }, // Request pending
    })
  },

  approveOrganizer: async (userId: string) => {
    return prisma.user.update({
      where: { id: userId },
      data: { isOrganizer: true, isVerified: true },
    })
  },

  rejectOrganizer: async (userId: string) => {
    return prisma.user.update({
      where: { id: userId },
      data: { isOrganizer: false, isVerified: false },
    })
  },

  getPendingRequests: async () => {
    // This would need a separate table in a real system, but for now we'll use a flag
    // In a production system, you'd have an OrganizerRequest model
    return prisma.user.findMany({
      where: {
        isVerified: false,
        role: { in: ['STUDENT', 'ORGANIZER'] },
      },
    })
  },
}

