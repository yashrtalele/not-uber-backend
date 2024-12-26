import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import { acceptRide, registerDriver, registerUser, requestRide } from "../services/rideService";

const users: Record<string, Socket> = {};
const drivers: Record<string, Socket> = {};

const initializeSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("register_user", ({ userId }) => {
      users[userId] = socket;
      registerUser(socket, userId);
      console.log(`User ${userId} registered: ${socket.id}`);
    });

    socket.on("register_driver", ({ driverId }) => {
      drivers[driverId] = socket;
      console.log(`Driver ${driverId} registered: ${socket.id}`);
      registerDriver(drivers[driverId], driverId);
    });

    socket.on("request_ride", ({ userId, rideId }) => {
      requestRide(users[userId], userId, rideId);
    });

    socket.on("accept_ride", ({ driverId, userId, rideId }) => {
      acceptRide(driverId, userId, rideId, users, drivers, io);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      handleDisconnection(socket);
    });
  });
};

function handleDisconnection(socket: Socket) {
  for (const user in users) {
    if (users[user] === socket) {
      delete users[user];
      break;
    }
  }
  for (const driver in drivers) {
    if (drivers[driver] === socket) {
      delete drivers[driver];
      break;
    }
  }
}

export { initializeSocket };
