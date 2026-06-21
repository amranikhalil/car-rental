/*
  Warnings:

  - You are about to drop the column `deletedAT` on the `Airport` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAT` on the `Car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Airport" DROP COLUMN "deletedAT",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "deletedAT",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
