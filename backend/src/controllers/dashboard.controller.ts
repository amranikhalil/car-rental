import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function getStats(req: Request, res: Response): Promise<void> {
  const [
    totalCars,
    availableCars,
    statusGroups,
    revenueAgg,
    recentReservations,
  ] = await Promise.all([
    prisma.car.count({ where: { deletedAt: null } }),
    prisma.car.count({ where: { deletedAt: null, isAvailable: true } }),
    prisma.reservation.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.reservation.aggregate({
      _sum: { totalPrice: true },
      where: { status: { in: ["CONFIRMED", "RETURNED"] } },
    }),
    prisma.reservation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { car: { include: { airport: true } } },
    }),
  ]);

  const byStatus = { PENDING: 0, CONFIRMED: 0, RETURNED: 0, CANCELLED: 0 };
  for (const g of statusGroups) {
    byStatus[g.status as keyof typeof byStatus] = g._count._all;
  }

  const totalReservations =
    byStatus.PENDING + byStatus.CONFIRMED + byStatus.RETURNED + byStatus.CANCELLED;

  res.json({
    totalCars,
    availableCars,
    totalReservations,
    reservationsByStatus: byStatus,
    revenue: Number(revenueAgg._sum.totalPrice ?? 0),
    recentReservations,
  });
}
