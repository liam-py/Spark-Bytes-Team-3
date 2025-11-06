import { feedbackRepo } from '../repositories/feedback.repo'
import { reservationRepo } from '../repositories/reservation.repo'

export const feedbackService = {
  async createFeedback(
    userId: string,
    data: {
      eventId: string
      rating: number
      comment?: string
    }
  ) {
    // Check if user reserved this event
    const reservation = await reservationRepo.findByEventAndUser(data.eventId, userId)
    if (!reservation) {
      throw new Error('NOT_RESERVED')
    }

    // Check if feedback already exists
    const existing = await feedbackRepo.findByUserAndEvent(userId, data.eventId)
    if (existing) {
      throw new Error('FEEDBACK_EXISTS')
    }

    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('INVALID_RATING')
    }

    return feedbackRepo.create({
      userId,
      eventId: data.eventId,
      rating: data.rating,
      comment: data.comment,
    })
  },

  async getEventFeedback(eventId: string) {
    return feedbackRepo.findByEvent(eventId)
  },
}

