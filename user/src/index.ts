import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as userRouter } from "./routes/user";
import "./jobs/cleanupExpiredTokens";

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 9757;
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", userRouter);

app.listen(PORT, () => {
  console.log(`User service listening on port ${PORT}`);
});
