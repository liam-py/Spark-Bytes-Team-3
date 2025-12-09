import { z } from 'zod'

export const createReservationSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  foodItemId: z.string().min(1, "Food item ID is required"),
  quantity: z.number().int().positive('Quantity must be positive').default(1),
})

