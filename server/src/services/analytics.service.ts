import { prisma } from '../lib/db'

export const analyticsService = {
  async getOverview() {
    const [
      totalEvents,
      totalReservations,
      totalUsers,
      eventsWithDietaryOptions,
      eventsByOrganizer,
    ] = await Promise.all([
      prisma.event.count(),
      prisma.reservation.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count(),
      prisma.event.count({
        where: {
          foodItems: {
            some: {
              dietaryInfo: {
                isEmpty: false,
              },
            },
          },
        },
      }),
      prisma.event.groupBy({
        by: ['createdBy'],
        _count: {
          id: true,
        },
      }),
    ])

    // Get organizer names
    const organizerStats = await Promise.all(
      eventsByOrganizer.map(async (stat) => {
        const user = await prisma.user.findUnique({
          where: { id: stat.createdBy },
          select: { name: true, email: true },
        })
        return {
          organizerId: stat.createdBy,
          organizerName: user?.name || user?.email || 'Unknown',
          eventCount: stat._count.id,
        }
      })
    )

    return {
      totalEvents,
      totalReservations,
      totalUsers,
      eventsWithDietaryOptions,
      organizerStats,
    }
  },
}

