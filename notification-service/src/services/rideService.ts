import { notifyRideAcceptance } from "./notificationService";
import { checkIfDriverIsWithinRadius } from "../utils/checkIfDriverIsWithinRadius";
import { Server, Socket } from "socket.io";
import mqConnection from "../config/rabbitmq";

const users: Record<string, Socket> = {};
const drivers: Record<string, Socket> = {};

const registerUser = (socket: Socket, userId: string) => {
  users[userId] = socket;
  console.log(`User ${socket.id} registered`);
};

const registerDriver = (socket: Socket, driverId: string) => {
  drivers[driverId] = socket;
  console.log(`Driver ${socket.id} registered`);
  mqConnection.subscribe("rideRequests", (data: any) => {
    const rideRequest = JSON.parse(data);
    const userSocket = users[rideRequest.userId];
    for (const driver in drivers) {
      if (drivers[driver] === socket && userSocket && checkIfDriverIsWithinRadius(drivers[driver], userSocket)) {
        console.log(`Driver ${drivers[driver].id} is within radius for user ${userSocket.id}`);
        drivers[driver].emit("rideRequest", {
          driverId: drivers[driver].id,
          userId: userSocket.id,
          rideId: rideRequest.rideId,
        });
      }
    }
  });
};

const requestRide = (socket: Socket, userId: string, rideId: number) => {
  const user = users[userId];
  console.log(user, userId, rideId);
  if (user) {
    const rideRequest = { userId, rideId };
    mqConnection.publish("rideRequests", rideRequest);
    console.log(`Ride request for the ride ${rideRequest.rideId} published for user ${user.id}`);
  }
};

const acceptRide = (
  driverId: string,
  userId: string,
  rideId: number,
  users: Record<string, Socket>,
  driver: Record<string, Socket>,
  io: Server
) => {
  notifyRideAcceptance(driverId, userId, rideId, users, driver, io);
};

export { acceptRide, registerDriver, registerUser, requestRide };
