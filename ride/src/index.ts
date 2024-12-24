import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router as rideRouter } from "./routes/rides";
import { router as mapRouter } from "./routes/map";

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 9759;
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", rideRouter);
app.use("/map", mapRouter);

app.listen(PORT, () => {
  console.log(`Ride service listening on port ${PORT}`);
});
