import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getBlacklistedToken = async (token: string): Promise<boolean> => {
  const gotToken = await prisma.blacklistTokens.findFirst({
    where: {
      token,
    },
  });
  if (gotToken) {
    return true;
  }
  return false;
};
