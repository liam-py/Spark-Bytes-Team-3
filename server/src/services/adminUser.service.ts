import { prisma } from '../lib/db'
import { UserRole } from '@prisma/client'

type AllowedRole = Extract<UserRole, 'ADMIN' | 'STUDENT'>

const validRoles: AllowedRole[] = ['ADMIN', 'STUDENT']

const ensureValidRole = (role: string): role is AllowedRole => {
  return validRoles.includes(role as AllowedRole)
}

export const adminUserService = {
  async listUsers() {
    const [users, eventCounts, reservationCounts] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.event.groupBy({
        by: ['createdBy'],
        _count: { id: true },
      }),
      prisma.reservation.groupBy({
        by: ['userId'],
        _count: { id: true },
      }),
    ])

    const eventCountMap = new Map(eventCounts.map((item) => [item.createdBy, item._count.id]))
    const reservationCountMap = new Map(
      reservationCounts.map((item) => [item.userId, item._count.id])
    )

    return users.map((user) => ({
      ...user,
      createdEventsCount: eventCountMap.get(user.id) || 0,
      reservationsCount: reservationCountMap.get(user.id) || 0,
    }))
  },

  async getUserDetails(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }

    const [createdEvents, reservations] = await Promise.all([
      prisma.event.findMany({
        where: { createdBy: userId },
        select: {
          id: true,
          title: true,
          location: true,
          startTime: true,
          endTime: true,
        },
        orderBy: { startTime: 'desc' },
      }),
      prisma.reservation.findMany({
        where: { userId },
        select: {
          id: true,
          eventId: true,
          reservedAt: true,
          event: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { reservedAt: 'desc' },
      }),
    ])

    return {
      ...user,
      createdEventsCount: createdEvents.length,
      reservationsCount: reservations.length,
      createdEvents,
      reservations: reservations.map((reservation) => ({
        id: reservation.id,
        eventId: reservation.eventId,
        eventTitle: reservation.event.title,
        createdAt: reservation.reservedAt,
      })),
    }
  },

  async updateUserRole(userId: string, role: string) {
    if (!ensureValidRole(role)) {
      throw new Error('INVALID_ROLE')
    }

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } })
      if (!user) {
        throw new Error('USER_NOT_FOUND')
      }

      if (user.role === role) {
        return user
      }

      if (user.role === 'ADMIN' && role !== 'ADMIN') {
        const adminCount = await tx.user.count({ where: { role: 'ADMIN' } })
        if (adminCount <= 1) {
          throw new Error('LAST_ADMIN')
        }
      }

      return tx.user.update({
        where: { id: userId },
        data: { role: role as AllowedRole },
      })
    })
  },

  async deleteUser(userId: string) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } })
      if (!user) {
        throw new Error('USER_NOT_FOUND')
      }

      if (user.role === 'ADMIN') {
        const adminCount = await tx.user.count({ where: { role: 'ADMIN' } })
        if (adminCount <= 1) {
          throw new Error('LAST_ADMIN')
        }
      }

      const events = await tx.event.findMany({
        where: { createdBy: userId },
        select: { id: true },
      })
      const eventIds = events.map((event) => event.id)

      if (eventIds.length > 0) {
        await tx.reservation.deleteMany({
          where: { eventId: { in: eventIds } },
        })
        await tx.event.deleteMany({
          where: { id: { in: eventIds } },
        })
      }

      await tx.reservation.deleteMany({ where: { userId } })
      await tx.user.delete({ where: { id: userId } })

      return { deletedUserId: userId }
    })
  },
}
