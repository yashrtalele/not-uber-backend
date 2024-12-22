/*
  Warnings:

  - You are about to drop the column `userId` on the `DriverProfile` table. All the data in the column will be lost.
  - Added the required column `driverId` to the `DriverProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DriverProfile" DROP CONSTRAINT "DriverProfile_userId_fkey";

-- AlterTable
ALTER TABLE "DriverProfile" DROP COLUMN "userId",
ADD COLUMN     "driverId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DriverProfile" ADD CONSTRAINT "DriverProfile_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
