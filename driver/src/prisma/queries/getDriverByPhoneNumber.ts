import { PrismaClient, VehicleType } from "@prisma/client";

const prisma = new PrismaClient();

interface DriverProfile {
  id: number;
  firstName: string;
  lastName: string;
}
interface Vehicle {
  id: number;
  brand: string;
  model: string;
  capacity: number;
  color: string;
  licensePlate: string;
  vehicleType: keyof typeof VehicleType;
}
interface DriverWithProfile {
  driver: {
    id: number;
    email: string;
    password: string;
    phoneNumber: string;
  } | null;
  driverProfile: DriverProfile | null;
  vehicle: Vehicle | null;
}

export const getDriverByPhoneNumber = async (phoneNumber: string): Promise<DriverWithProfile> => {
  try {
    const driver = await prisma.driver.findUnique({
      where: {
        phoneNumber,
      },
      select: {
        id: true,
        email: true,
        password: true,
        phoneNumber: true,
      },
    });

    if (!driver) {
      return { driver: null, driverProfile: null, vehicle: null };
    }

    const driverProfile = await prisma.driverProfile.findFirst({
      where: {
        driverId: driver.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        driverId: driver.id,
      },
      select: {
        id: true,
        brand: true,
        model: true,
        capacity: true,
        color: true,
        licensePlate: true,
        vehicleType: true,
      },
    });

    return { driver, driverProfile, vehicle };
  } catch (error) {
    console.error("Error fetching driver profile:", error);
    throw new Error("Failed to retrieve driver data");
  }
};
