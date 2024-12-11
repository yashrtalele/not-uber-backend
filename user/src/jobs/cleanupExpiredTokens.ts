import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prisma = new PrismaClient();

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const expirationTime = new Date(now.getTime() - 3600 * 1000);
  await prisma.blacklistTokens.deleteMany({
    where: {
      createdAt: {
        lt: expirationTime,
      },
    },
  });
  console.log("Expired tokens removed");
});
