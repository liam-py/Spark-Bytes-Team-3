import { z } from 'zod'

export const createReservationSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
<<<<<<< HEAD
  foodItemId: z.string().optional(),
=======
  foodItemId: z.string().min(1, "Food item ID is required"),
>>>>>>> bc462f422b0c6a09b358738db66beaf94bfb33e4
  quantity: z.number().int().positive('Quantity must be positive').default(1),
})

