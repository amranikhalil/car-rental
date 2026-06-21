import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { createCarSchema, updateCarSchema } from "../schemas/car.schema";

export async function getCars(req: Request, res: Response): Promise<void> {
  const { airportId, startDate, endDate } = req.query;

  const where: Record<string, unknown> = { isAvailable: true, deletedAt: null };
  if (airportId) where.airportId = Number(airportId);

  if (startDate && endDate) {
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    where.reservations = {
      none: {
        status: { in: ['PENDING', 'CONFIRMED'] },
        AND: [{ startDate: { lt: end } }, { endDate: { gt: start } }],
      },
    };
  }

  const cars = await prisma.car.findMany({
    where,
    include: { airport: true},
    orderBy: { pricePerDay: 'asc' },
  });

  res.json(cars);
}

export async function getCarById(req: Request, res: Response): Promise<void> {
  const car = await prisma.car.findFirst({
    where: { id: Number(req.params.id), deletedAt: null },
    include: { airport: true},
  });

  if (!car) {
    res.status(404).json({ message: "Car not found" });
    return;
  }

  res.json(car);
}

export async function createCar(req: Request, res: Response): Promise<void> {
  const result = createCarSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }

  const { pricePerDay, ...rest } = result.data;
  const car = await prisma.car.create({
    data: { ...rest, pricePerDay: pricePerDay.toString() },
    include: { airport: true },
  });

  res.status(201).json(car);
}

export async function updateCar(req: Request, res: Response): Promise<void> {
  const result = updateCarSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }

  const exists = await prisma.car.findUnique({ where: { id: Number(req.params.id) } });
  if (!exists) {
    res.status(404).json({ message: "Car not found" });
    return;
  }

  const { pricePerDay, ...rest } = result.data;
  const car = await prisma.car.update({
    where: { id: Number(req.params.id) },
    data: {
      ...rest,
      ...(pricePerDay !== undefined && { pricePerDay: pricePerDay.toString() }),
    },
    include: { airport: true },
  });

  res.json(car);
}

export async function deleteCar(req: Request, res: Response): Promise<void> {
  const exists = await prisma.car.findUnique({ where: { id: Number(req.params.id) } });
  if (!exists) {
    res.status(404).json({ message: "Car not found" });
    return;
  }

  await prisma.car.update({ where: { id: Number(req.params.id) }, 
  data:{deletedAt: new Date()} });

  res.status(204).send();
}
