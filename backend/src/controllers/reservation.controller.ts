import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { createReservationSchema, updateStatusSchema } from '../schemas/reservation.schema'

const PROTECTION_FEE_PER_DAY = 500 // DZD

function calcDays(start: Date, end: Date) {
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
}

export async function getReservations(req: Request, res: Response): Promise<void> {
  const { status } = req.query

  const reservations = await prisma.reservation.findMany({
    where: status ? { status: status as string } : undefined,
    include: {
      car: { include: { airport: true } },
    },
    orderBy: { createdAt: 'desc' },
  } as Parameters<typeof prisma.reservation.findMany>[0])

  res.json(reservations)
}

export async function getReservationById(req: Request, res: Response): Promise<void> {
  const reservation = await prisma.reservation.findUnique({
    where: { id: Number(req.params.id) },
    include: { car: { include: { airport: true } } },
  })

  if (!reservation) {
    res.status(404).json({ message: 'Reservation not found' })
    return
  }

  res.json(reservation)
}

export async function createReservation(req: Request, res: Response): Promise<void> {
  const result = createReservationSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors })
    return
  }

  const { carId, startDate, endDate, protection, ...rest } = result.data
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (end <= start) {
    res.status(400).json({ message: 'endDate must be after startDate' })
    return
  }

  const car = await prisma.car.findUnique({ where: { id: carId } })
  if (!car) {
    res.status(404).json({ message: 'Car not found' })
    return
  }

  // check for conflicting reservations
  const conflict = await prisma.reservation.findFirst({
    where: {
      carId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      AND: [{ startDate: { lt: end } }, { endDate: { gt: start } }],
    },
  })

  if (conflict) {
    res.status(409).json({ message: 'Car already booked for these dates' })
    return
  }

  const days = calcDays(start, end)
  const totalPrice =
    days * Number(car.pricePerDay) + (protection === 'BASIC' ? days * PROTECTION_FEE_PER_DAY : 0)

  const reservation = await prisma.reservation.create({
    data: {
      ...rest,
      carId,
      startDate: start,
      endDate: end,
      protection,
      totalPrice: totalPrice.toString(),
    },
    include: { car: { include: { airport: true } } },
  })

  res.status(201).json(reservation)
}

export async function updateReservationStatus(req: Request, res: Response): Promise<void> {
  const result = updateStatusSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors })
    return
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: Number(req.params.id) },
  })

  if (!reservation) {
    res.status(404).json({ message: 'Reservation not found' })
    return
  }

  const updated = await prisma.reservation.update({
    where: { id: Number(req.params.id) },
    data: { status: result.data.status },
    include: { car: { include: { airport: true } } },
  })

  res.json(updated)
}

export async function deleteReservation(req: Request, res: Response): Promise<void> {
  const reservation = await prisma.reservation.findUnique({
    where: { id: Number(req.params.id) },
  })

  if (!reservation) {
    res.status(404).json({ message: 'Reservation not found' })
    return
  }

  if (reservation.status !== 'CANCELLED') {
    res.status(400).json({ message: 'Only CANCELLED reservations can be deleted' })
    return
  }

  await prisma.reservation.delete({ where: { id: Number(req.params.id) } })
  res.status(204).send()
}
