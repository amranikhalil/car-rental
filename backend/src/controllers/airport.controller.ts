import { Request, Response } from 'express'
import prisma from '../lib/prisma'

export async function getAirports(_req: Request, res: Response): Promise<void> {
  const airports = await prisma.airport.findMany({ orderBy: { city: 'asc' } })
  res.json(airports)
}
