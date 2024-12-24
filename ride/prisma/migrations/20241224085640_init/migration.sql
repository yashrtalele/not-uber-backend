-- CreateEnum
CREATE TYPE "Status" AS ENUM ('requested', 'accepted', 'started', 'completed');

-- CreateTable
CREATE TABLE "Ride" (
    "id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'requested',
    "pickup" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);
