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
    phoneNumber: string;
  } | null;
  driverProfile: DriverProfile | null;
  vehicle: Vehicle | null;
}

export const createDriver = async (
  email: string,
  password: string,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  brand: string,
  model: string,
  capacity: number,
  color: string,
  vehicleType: string,
  licensePlate: string
): Promise<DriverWithProfile> => {
  try {
    const driver = await prisma.driver.create({
      data: {
        email,
        password,
        phoneNumber,
      },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
      },
    });
    const driverProfile = await prisma.driverProfile.create({
      data: {
        firstName,
        lastName,
        driverId: driver.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
    const vehicle = await prisma.vehicle.create({
      data: {
        driverId: driver.id,
        capacity,
        brand,
        model,
        color,
        licensePlate,
        vehicleType: vehicleType as keyof typeof VehicleType,
      },
    });
    return { driver, driverProfile, vehicle };
  } catch (error) {
    console.log("Throwing error here ", error);
    throw new Error("Failed to create driver data");
  }
};
