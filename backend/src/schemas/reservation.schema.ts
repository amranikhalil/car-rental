import { z } from 'zod'

export const createReservationSchema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(1),
  carId: z.number().int().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  protection: z.enum(['BASIC', 'NONE']).default('NONE'),
})

export const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'RETURNED', 'CANCELLED']),
})

export type CreateReservationInput = z.infer<typeof createReservationSchema>
