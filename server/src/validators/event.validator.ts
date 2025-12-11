import { z } from 'zod'

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  imagePath: z.string().optional(),
  foodItems: z.array(
    z.object({
      name: z.string().min(1, 'Food name is required'),
      description: z.string().optional(),
      quantity: z.number().int().positive('Quantity must be positive'),
      dietaryInfo: z.array(z.string()),
    })
  ).min(1, 'At least one food item is required'),
})

export const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  location: z.string().min(1).optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  imagePath: z.string().optional(),
})

