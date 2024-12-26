import express from "express";
import { createServer, Server as HTTPServer } from "http";
import dotenv from "dotenv";
import { initializeSocket } from "./controllers/socketController";
import mqConnection from "./config/rabbitmq";

dotenv.config();
const app = express();
const server: HTTPServer = createServer(app);
const PORT = process.env.PORT || 9760;

initializeSocket(server);
mqConnection.connect();

server.listen(PORT, () => {
  console.log("🚀 Notfication Service Server started at http://localhost:" + PORT);
});
