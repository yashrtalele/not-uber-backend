import { PrismaClient, VehicleType } from "@prisma/client";

const prisma = new PrismaClient();

interface DriverProfile {
  id: number;
  firstName: string;
  lastName: string;
}
interface Vehicle {
  id: number;
  capacity: number;
  color: string;
  licensePlate: string;
  vehicleType: keyof typeof VehicleType;
}
interface DriverWithProfile {
  driver: {
    id: number;
    email: string;
    phoneNumber: string;
  } | null;
  driverProfile: DriverProfile | null;
  vehicle: Vehicle | null;
}
export const getDriver = async (phoneNumber: string): Promise<DriverWithProfile> => {
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
        capacity: true,
        color: true,
        licensePlate: true,
        brand: true,
        model: true,
        vehicleType: true,
      },
    });

    return { driver, driverProfile, vehicle };
  } catch (error) {
    console.error("Error fetching driver or profile:", error);
    throw new Error("Failed to retrieve driver data");
  }
};
