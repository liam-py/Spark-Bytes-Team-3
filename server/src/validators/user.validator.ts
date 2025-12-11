import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email().refine((email) => email.endsWith('@bu.edu'), {
    message: 'Only BU email addresses (@bu.edu) are allowed',
  }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

