import { Server, Socket } from "socket.io";

type Users = Record<string, Socket>;
type Drivers = Record<string, Socket>;

const notifyRideAcceptance = (
  driverId: string,
  userId: string,
  rideId: number,
  users: Users,
  drivers: Drivers,
  io: Server
) => {
  const user = users[userId];
  if (user) {
    io.to(user.id).emit("ride_accepted", { driverId, userId });
    console.log(`User ${userId} notified that driver ${driverId} accepted the ride: ` + rideId);
  }
};

export { notifyRideAcceptance };
