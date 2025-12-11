import { z } from 'zod'

export const updateDietarySchema = z.object({
  isVegan: z.boolean().optional(),
  isVegetarian: z.boolean().optional(),
  isHalal: z.boolean().optional(),
  isKosher: z.boolean().optional(),
  allergies: z.array(z.string()).optional(),
  otherRestrictions: z.string().optional(),
})

