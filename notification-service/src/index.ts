import express from "express";
import { createServer, Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
const server = createServer(app);

const users: Socket[] = [];
const drivers: Socket[] = [];

function initializeSocket(server: HTTPServer) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("registerUser", ({ userId }) => {
      users[userId] = socket;
      console.log(`User ${userId} registered: ${socket.id}`);
    });

    socket.on("registerDriver", ({ userId }) => {
      drivers[userId] = socket;
      console.log(`Driver ${userId} registered: ${socket.id}`);
    });

    socket.on("rideRequest", ({ driverId, userId }) => {
      if (drivers[driverId]) {
        io.to(drivers[driverId].id).emit("newRideRequest", { userId });
        console.log(`Ride request sent to driver ${driverId}: ${socket.id}`);
      }
    });

    socket.on("rideAccepted", ({ driverId, userId }) => {
      if (users[userId]) {
        io.to(users[userId].id).emit("rideAccepted", { driverId });
        console.log(`Ride accepted by user ${userId}: ${socket.id}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
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
    });
  });
}

initializeSocket(server);

server.listen(3004, () => {
  console.log("Notification service is running on port 3004");
});
