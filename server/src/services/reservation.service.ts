import { reservationRepo } from '../repositories/reservation.repo'
import { eventRepo } from '../repositories/event.repo'
import { prisma } from '../lib/db'
<<<<<<< HEAD
=======
import { notificationService } from './notification.service'
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4

export const reservationService = {
  async createReservation(
    userId: string,
    data: {
      eventId: string
<<<<<<< HEAD
      foodItemId?: string
=======
      foodItemId: string
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
      quantity: number
    }
  ) {
    // Check if user already reserved this event
<<<<<<< HEAD
    const existing = await reservationRepo.findByEventAndUser(data.eventId, userId)
    if (existing) {
      throw new Error('ALREADY_RESERVED')
=======
    const existing = await reservationRepo.findByFoodItemAndUser(data.foodItemId, userId)
    if (existing) {
      throw new Error('ALREADY_RESERVED_THIS_ITEM')
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
    }

    // Get event and check availability
    const event = await eventRepo.findById(data.eventId)
    if (!event) {
      throw new Error('EVENT_NOT_FOUND')
    }

<<<<<<< HEAD
=======
    // Prevent event creators from reserving their own events
    if (event.createdBy === userId) {
      throw new Error('CANNOT_RESERVE_OWN_EVENT')
    }

>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
    if (data.foodItemId) {
      const foodItem = event.foodItems.find((item) => item.id === data.foodItemId)
      if (!foodItem) {
        throw new Error('FOOD_ITEM_NOT_FOUND')
      }
      if (foodItem.reserved + data.quantity > foodItem.quantity) {
<<<<<<< HEAD
        throw new Error('INSUFFICIENT_QUANTITY')
=======
        throw new Error('INSUFFICIENT_QUANTITY') 
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
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

<<<<<<< HEAD
    return reservationRepo.create({
=======
    const reservation = await reservationRepo.create({
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
      userId,
      eventId: data.eventId,
      foodItemId: data.foodItemId,
      quantity: data.quantity,
    })
<<<<<<< HEAD
=======

    console.log('\n🎫 ===== RESERVATION CREATED =====')
    console.log('🎫 Reservation ID:', reservation.id)
    console.log('🎫 User ID:', userId)
    console.log('🎫 User Email:', reservation.user.email)
    console.log('🎫 User Name:', reservation.user.name)
    console.log('🎫 Event Title:', reservation.event.title)
    console.log('🎫 Quantity:', reservation.quantity)

    // Send confirmation email
    if (reservation.user.email) {
      console.log('🎫 User has email, triggering confirmation email...')
      notificationService.sendReservationConfirmation(
        reservation.user.email,
        reservation.user.name || null,
        reservation.event.title,
        reservation.quantity,
        {
          location: reservation.event.location,
          startTime: reservation.event.startTime,
        }
      ).catch((err) => {
        console.error('🎫 ❌ Failed to send reservation confirmation:', err)
        console.error('🎫 Error stack:', err.stack)
      })
    } else {
      console.log('🎫 ⚠️  User has no email address, skipping confirmation email')
    }

    console.log('🎫 ===============================\n')
    return reservation
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
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

