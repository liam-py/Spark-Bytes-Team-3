import { reservationRepo } from '../repositories/reservation.repo'
import { eventRepo } from '../repositories/event.repo'
import { prisma } from '../lib/db'

export const reservationService = {
  async createReservation(
    userId: string,
    data: {
      eventId: string
      foodItemId?: string
      quantity: number
    }
  ) {
    // Check if user already reserved this event
    const existing = await reservationRepo.findByEventAndUser(data.eventId, userId)
    if (existing) {
      throw new Error('ALREADY_RESERVED')
    }

    // Get event and check availability
    const event = await eventRepo.findById(data.eventId)
    if (!event) {
      throw new Error('EVENT_NOT_FOUND')
    }

    if (data.foodItemId) {
      const foodItem = event.foodItems.find((item) => item.id === data.foodItemId)
      if (!foodItem) {
        throw new Error('FOOD_ITEM_NOT_FOUND')
      }
      if (foodItem.reserved + data.quantity > foodItem.quantity) {
        throw new Error('INSUFFICIENT_QUANTITY')
      }

      // Update food item reserved count
      await prisma.foodItem.update({
        where: { id: data.foodItemId },
        data: { reserved: { increment: data.quantity } },
      })
    } else {
      // Reserve from any available food item
      const availableItem = event.foodItems.find(
        (item) => item.reserved < item.quantity
      )
      if (!availableItem) {
        throw new Error('NO_AVAILABLE_FOOD')
      }
      if (availableItem.reserved + data.quantity > availableItem.quantity) {
        throw new Error('INSUFFICIENT_QUANTITY')
      }

      await prisma.foodItem.update({
        where: { id: availableItem.id },
        data: { reserved: { increment: data.quantity } },
      })
    }

    return reservationRepo.create({
      userId,
      eventId: data.eventId,
      foodItemId: data.foodItemId,
      quantity: data.quantity,
    })
  },

  async getUserReservations(userId: string) {
    return reservationRepo.findByUser(userId)
  },

  async cancelReservation(reservationId: string, userId: string) {
    const reservation = await reservationRepo.findById(reservationId)
    if (!reservation) {
      throw new Error('RESERVATION_NOT_FOUND')
    }
    if (reservation.userId !== userId) {
      throw new Error('UNAUTHORIZED')
    }

    // Decrement food item reserved count
    if (reservation.foodItemId) {
      await prisma.foodItem.update({
        where: { id: reservation.foodItemId },
        data: { reserved: { decrement: reservation.quantity } },
      })
    }

    return reservationRepo.updateStatus(reservationId, 'CANCELLED')
  },
}

