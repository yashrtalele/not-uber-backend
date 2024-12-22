import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const blacklistToken = async (token: string) => {
  try {
    await prisma.blacklistTokens.create({
      data: {
        token,
      },
    });
  } catch (error) {
    console.log("Throwing error here ", error);
  }
};
