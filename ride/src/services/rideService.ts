import crypto from "crypto";
import { getDistanceTime } from "./mapService";
import { getRideDetails } from "../prisma/queries/getRideDetails";
import { startRide } from "../prisma/queries/startRide";
import { endRide } from "../prisma/queries/endRide";

const generateOTP = (num: number) => {
  const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
  return otp;
};

export { generateOTP };

const getFare = async (current: string, destination: string) => {
  if (!current || !destination) {
    throw new Error("Current and destination are required");
  }

  const distanceTime = await getDistanceTime(current, destination);

  const baseFare = {
    auto: 30,
    car: 50,
    suv: 60,
    moto: 20,
  };
  const perKmRate = {
    auto: 10,
    car: 15,
    suv: 20,
    moto: 8,
  };
  const perMinuteRate = {
    auto: 2,
    car: 3,
    suv: 4,
    moto: 1.5,
  };
  const fare = {
    auto: Math.round(
      baseFare.auto +
      (distanceTime.distance.value / 1000) * perKmRate.auto +
      (distanceTime.duration.value / 60) * perMinuteRate.auto
    ),
    car: Math.round(
      baseFare.car +
      (distanceTime.distance.value / 1000) * perKmRate.car +
      (distanceTime.duration.value / 60) * perMinuteRate.car
    ),
    suv: Math.round(
      baseFare.suv +
      (distanceTime.distance.value / 1000) * perKmRate.suv +
      (distanceTime.duration.value / 60) * perMinuteRate.suv
    ),
    moto: Math.round(
      baseFare.moto +
      (distanceTime.distance.value / 1000) * perKmRate.moto +
      (distanceTime.duration.value / 60) * perMinuteRate.moto
    ),
  };

  return fare;
};

const startRideService = async (rideId: number, otp: string, driverId: number) => {
  if (!rideId || !otp) {
    throw new Error("Ride id and OTP are required");
  }

  const ride = await getRideDetails(rideId);

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride not accepted");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  await startRide(rideId, otp, driverId);
  return ride;
};

const endRideService = async (rideId: number, driverId: number) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  const ride = await getRideDetails(rideId);
  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "started") {
    throw new Error("Ride not ongoing");
  }

  await endRide(rideId, driverId);
  const rideDetails = await getRideDetails(rideId);
  return rideDetails;
};

export { endRideService, getFare, startRideService };
