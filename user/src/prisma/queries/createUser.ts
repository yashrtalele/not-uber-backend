import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (
  username: string,
  password: string,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  email: string
) => {
  const user = await prisma.user.create({
    data: {
      username,
      password,
      phoneNumber,
    },
    select: {
      id: true,
      username: true,
      phoneNumber: true,
    },
  });
  const userProfile = await prisma.userProfile.create({
    data: {
      firstName,
      lastName,
      email,
      userId: user.id,
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
