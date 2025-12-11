import { prisma } from '../lib/db'
import { ReservationStatus } from '@prisma/client'

export const reservationRepo = {
  create: (data: {
    userId: string
    eventId: string
    foodItemId?: string
    quantity: number
  }) => {
    return prisma.reservation.create({
      data: {
        userId: data.userId,
        eventId: data.eventId,
        foodItemId: data.foodItemId,
        quantity: data.quantity,
        status: 'ACTIVE',
      },
      include: {
        event: {
          include: {
            foodItems: true,
          },
        },
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

  findByUser: (userId: string) => {
    return prisma.reservation.findMany({
      where: { userId, status: 'ACTIVE' },
      include: {
        event: {
          include: {
            foodItems: true,
            creator: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        reservedAt: 'desc',
      },
    })
  },

  findByEventAndUser: (eventId: string, userId: string) => {
    return prisma.reservation.findFirst({
      where: {
        eventId,
        userId,
        status: 'ACTIVE',
      },
    })
  },

  findById: (id: string) => {
    return prisma.reservation.findUnique({
      where: { id },
      include: {
        event: {
          include: {
            foodItems: true,
          },
        },
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

  updateStatus: (id: string, status: ReservationStatus) => {
    return prisma.reservation.update({
      where: { id },
      data: { status },
    })
  },
}

