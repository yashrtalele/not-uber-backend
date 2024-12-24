/*
  Warnings:

  - Made the column `destination` on table `Ride` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Ride" ALTER COLUMN "driverId" DROP NOT NULL,
ALTER COLUMN "destination" SET NOT NULL;
