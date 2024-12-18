import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface UserWithProfile {
  user: {
    id: number;
    username: string;
    password: string;
    phoneNumber: string;
  } | null;
  userProfile: UserProfile | null;
}

export const getUserByPhoneNumber = async (phoneNumber: string): Promise<UserWithProfile> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        phoneNumber,
      },
      select: {
        id: true,
        username: true,
        password: true,
        phoneNumber: true,
      },
    });

    if (!user) {
      return { user: null, userProfile: null };
    }

    const userProfile = await prisma.userProfile.findFirst({
      where: {
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
  } catch (error) {
    console.error("Error fetching user or profile:", error);
    throw new Error("Failed to retrieve user data");
  }
};
