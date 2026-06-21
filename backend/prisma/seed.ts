import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);
  await prisma.reservation.deleteMany({})
  await prisma.car.deleteMany({})
  await prisma.airport.deleteMany({});
  await prisma.user.upsert({
    where: { email: "admin@airsline.dz" },
    update: {},
    create: { email: "admin@airsline.dz", password, role: "ADMIN" },
  });

  const airports = [
    { name: "Aéroport Houari Boumédiène", city: "Alger", code: "ALG" },
    { name: "agence", city: "Bouira", code: "AGENCE" },
 
  ];

  for (const airport of airports) {
    await prisma.airport.upsert({
      where: { code: airport.code },
      update: {},
      create: airport,
    });
  }

  console.log("Seed complete — admin: admin@airsline.dz / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
