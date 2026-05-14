import { z } from "zod";

export const createCarSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  pricePerDay: z.number().positive(),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]),
  fuel: z.enum(["ESSENCE", "DIESEL", "ELECTRIQUE"]),
  seats: z.number().int().min(2).max(9),
  photos: z.array(z.string().url()).default([]),
  airportId: z.number().int().positive(),
  isAvailable: z.boolean().default(true),
});

export const updateCarSchema = createCarSchema.partial();

export type CreateCarInput = z.infer<typeof createCarSchema>;
export type UpdateCarInput = z.infer<typeof updateCarSchema>;
