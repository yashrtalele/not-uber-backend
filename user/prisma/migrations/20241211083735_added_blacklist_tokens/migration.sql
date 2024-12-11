-- CreateTable
CREATE TABLE "BlacklistTokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlacklistTokens_pkey" PRIMARY KEY ("id")
);
