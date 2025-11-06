import { prisma } from '../lib/db'

export const feedbackRepo = {
  create: (data: {
    userId: string
    eventId: string
    rating: number
    comment?: string
  }) => {
    return prisma.feedback.create({
      data: {
        userId: data.userId,
        eventId: data.eventId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })
  },

  findByEvent: (eventId: string) => {
    return prisma.feedback.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  findByUserAndEvent: (userId: string, eventId: string) => {
    return prisma.feedback.findFirst({
      where: {
        userId,
        eventId,
      },
    })
  },
}

