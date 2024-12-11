import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { HTTP_STATUS } from "../utils/constants";
import { getBlacklistedToken } from "../prisma/queries/getBlacklistedToken";
import { getUserFromId } from "../prisma/queries/getUserFromId";
import { AuthRequest } from "../utils/types";
const JWT_SECRET = process.env.JWT_SECRET;

export const userAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
      return;
    }
    const isTokenBlacklisted = await getBlacklistedToken(token);
    if (isTokenBlacklisted) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
      return;
    }
    const decodedToken = jwt.verify(token, JWT_SECRET as string) as {
      userId: number;
    };

    if (!decodedToken) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
      return;
    }
    const user = await getUserFromId(decodedToken.userId);
    if (!user) {
      res.send(HTTP_STATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    console.log((error as Error).message);
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }
};
