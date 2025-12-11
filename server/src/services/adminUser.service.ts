import { prisma } from '../lib/db'

export const adminUserService = {
  async listUsers() {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: {
          select: {
            events: true,
            reservations: true,
          },
        },
      },
    })

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdEventsCount: user._count.events,
      reservationsCount: user._count.reservations,
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
        events: {
          select: {
            id: true,
            title: true,
          },
          orderBy: { startTime: 'desc' },
        },
        reservations: {
          select: {
            id: true,
            eventId: true,
            status: true,
            reservedAt: true,
            event: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { reservedAt: 'desc' },
        },
        _count: {
          select: {
            events: true,
            reservations: true,
          },
        },
      },
    })

    if (!user) return null

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdEventsCount: user._count.events,
      reservationsCount: user._count.reservations,
      createdEvents: user.events,
      reservations: user.reservations.map((reservation) => ({
        id: reservation.id,
        eventId: reservation.eventId,
        eventTitle: reservation.event?.title || 'Unknown event',
        status: reservation.status,
        reservedAt: reservation.reservedAt,
      })),
    }
  },

  async deleteUserAndData(userId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true },
      })

      if (!existing) {
        throw new Error('NOT_FOUND')
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
        await tx.feedback.deleteMany({
          where: { eventId: { in: eventIds } },
        })
      }

      await tx.reservation.deleteMany({ where: { userId } })
      await tx.feedback.deleteMany({ where: { userId } })

      if (eventIds.length > 0) {
        await tx.event.deleteMany({
          where: { id: { in: eventIds } },
        })
      }

      await tx.user.delete({ where: { id: userId } })
    })
  },
}
