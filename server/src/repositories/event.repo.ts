import { prisma } from '../lib/db'

export const eventRepo = {
  create: (data: {
    title: string
    description?: string
    location: string
    startTime: Date
    endTime: Date
    imagePath?: string
    createdBy: string
    foodItems: Array<{
      name: string
      description?: string
      quantity: number
      dietaryInfo: string[]
    }>
  }) => {
    return prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        startTime: data.startTime,
        endTime: data.endTime,
        imagePath: data.imagePath,
        createdBy: data.createdBy,
        foodItems: {
          create: data.foodItems,
        },
      },
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
    })
  },

  findById: (id: string) => {
    return prisma.event.findUnique({
      where: { id },
      include: {
        foodItems: true,
        creator: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        feedbacks: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    })
  },

  findAll: (filters?: {
    location?: string
    search?: string
    dietaryFilters?: string[]
  }) => {
    const where: any = {}
    
    if (filters?.location) {
      where.location = { contains: filters.location, mode: 'insensitive' }
    }
    
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters?.dietaryFilters && filters.dietaryFilters.length > 0) {
      where.foodItems = {
        some: {
          dietaryInfo: {
            hasSome: filters.dietaryFilters,
          },
        },
      }
    }

    return prisma.event.findMany({
      where,
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
      orderBy: {
        startTime: 'asc',
      },
    })
  },

  findByCreator: (userId: string, options?: { pastOnly?: boolean }) => {
    const where: any = {
      createdBy: userId,
    }

    // If pastOnly is true, only return events that have ended
    if (options?.pastOnly) {
      where.endTime = {
        lt: new Date(),
      }
    }

    return prisma.event.findMany({
      where,
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
      orderBy: {
        startTime: 'desc', // Most recent first for past events
      },
    })
  },

  update: (id: string, data: {
    title?: string
    description?: string
    location?: string
    startTime?: Date
    endTime?: Date
    imagePath?: string
  }) => {
    return prisma.event.update({
      where: { id },
      data,
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
    })
  },

  delete: (id: string) => {
    return prisma.event.delete({
      where: { id },
    })
  },
}

