import { eventRepo } from '../repositories/event.repo'
import { userRepo } from '../repositories/user.repo'
import { notificationService } from './notification.service'

export const eventService = {
  async createEvent(
    userId: string,
    data: {
      title: string
      description?: string
      location: string
      startTime: Date
      endTime: Date
      imagePath?: string
      foodItems: Array<{
        name: string
        description?: string
        quantity: number
        dietaryInfo: string[]
      }>
    }
  ) {
    const user = await userRepo.findById(userId)
    if (!user || (user.role !== 'ADMIN' && !user.isOrganizer)) {
      throw new Error('UNAUTHORIZED')
    }
    const event = await eventRepo.create({
      ...data,
      createdBy: userId,
    })

<<<<<<< HEAD
    // Send notifications to users who opted in
    notificationService.sendEventNotification(event.id, event.title).catch((err) => {
      console.error('Failed to send notifications:', err)
    })

=======
    console.log('\n🎉 ===== EVENT CREATED =====')
    console.log('🎉 Event ID:', event.id)
    console.log('🎉 Event Title:', event.title)
    console.log('🎉 Created by User ID:', userId)
    console.log('🎉 Triggering notifications...')

    // Send notifications with event details
    notificationService.sendEventNotification(event.id, event.title, {
      location: event.location,
      startTime: event.startTime,
      description: event.description || undefined,
    }).catch((err) => {
      console.error('🎉 ❌ Failed to send event notifications:', err)
      console.error('🎉 Error stack:', err.stack)
    })

    console.log('🎉 =========================\n')
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
    return event
  },

  async getEvent(id: string) {
    return eventRepo.findById(id)
  },

  async listEvents(filters?: {
    location?: string
    search?: string
    dietaryFilters?: string[]
  }) {
    return eventRepo.findAll(filters)
  },

  async updateEvent(
    eventId: string,
    userId: string,
    data: {
      title?: string
      description?: string
      location?: string
      startTime?: Date
      endTime?: Date
      imagePath?: string
    }
  ) {
    const event = await eventRepo.findById(eventId)
    if (!event) {
      throw new Error('EVENT_NOT_FOUND')
    }
    const user = await userRepo.findById(userId)
    // Allow admin to edit any event, or creator to edit their own
    if (user?.role !== 'ADMIN' && event.createdBy !== userId) {
      throw new Error('UNAUTHORIZED')
    }
    return eventRepo.update(eventId, data)
  },

  async deleteEvent(eventId: string, userId: string) {
    const event = await eventRepo.findById(eventId)
    if (!event) {
      throw new Error('EVENT_NOT_FOUND')
    }
    const user = await userRepo.findById(userId)
    // Allow admin to delete any event, or creator to delete their own
    if (user?.role !== 'ADMIN' && event.createdBy !== userId) {
      throw new Error('UNAUTHORIZED')
    }
    return eventRepo.delete(eventId)
  },
}
