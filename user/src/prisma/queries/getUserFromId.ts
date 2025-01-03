import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserFromId = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      password: true,
      phoneNumber: true,
    },
  });
  const userProfile = await prisma.userProfile.findFirst({
    where: {
      userId: user?.id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });
  return { user, userProfile };
};
