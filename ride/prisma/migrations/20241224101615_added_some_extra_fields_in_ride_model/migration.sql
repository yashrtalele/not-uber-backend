-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'cancelled';

-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "distance" DOUBLE PRECISION,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "fare" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "started_at" TIMESTAMP(3);
