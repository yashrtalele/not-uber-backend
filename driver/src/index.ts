import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as driverRouter } from "./routes/driver";
import "./jobs/cleanupExpiredTokens";
import { router as twilioRouter } from "./routes/twilio";

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 9758;
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", driverRouter);
app.use("/verify", twilioRouter);

app.listen(PORT, () => {
  console.log(`Driver service listening on port ${PORT}`);
});
