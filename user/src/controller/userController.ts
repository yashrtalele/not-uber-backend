import { Request, Response } from "express";
import { HTTP_STATUS } from "../utils/constants";
import { createUser } from "../prisma/queries/createUser";
import { getUser } from "../prisma/queries/getUser";
import { UserSignUpSchema } from "../schemas/user.signup.schema";
import { UserSignInSchema } from "../schemas/user.signin.schema";
import { hashPassword, validatePassword } from "../services/passwordService";
import { blacklistToken } from "../prisma/queries/blacklistTokens";
import { AuthRequest } from "../utils/types";
import { getUserByPhoneNumber } from "../prisma/queries/getUserByPhoneNumber";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

const signUp = async (req: Request, res: Response): Promise<void> => {
  const { success } = UserSignUpSchema.safeParse(req.body);
  if (!success) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Invalid request body",
    });
    return;
  }
  const { username, password, phoneNumber, firstName, lastName, email } = req.body;
  const hashedPassword = await hashPassword(password);
  try {
    if (await getUser(username)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "User already exists",
      });
      return;
    }
    const { user, userProfile } = await createUser(username, hashedPassword, phoneNumber, firstName, lastName, email);
    const userId: number = user.id;

    const token = jwt.sign({ userId }, JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    res.status(HTTP_STATUS.CREATED).json({
      message: "User created successfully",
      token: token,
      user,
      userProfile,
    });
    return;
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: (error as Error).message,
    });
    return;
  }
};

const signIn = async (req: Request, res: Response): Promise<void> => {
  const { success } = UserSignInSchema.safeParse(req.body);
  if (!success) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Invalid request body",
    });
    return;
  }
  const { username, password } = req.body;
  try {
    const { user, userProfile } = await getUser(username);
    if (user === null) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "User does not exist",
      });
      return;
    }
    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "Invalid password",
      });
      return;
    }
    const userId: number = user.id;

    const token = jwt.sign({ userId }, JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.cookie("token", token);

    res.status(HTTP_STATUS.OK).json({
      message: "User logged in successfully",
      token,
      user,
      userProfile,
    });
    return;
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: (error as Error).message,
    });
    return;
  }
};

const signOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.token;
    await blacklistToken(token);
    res.clearCookie("token");
    res.send({ message: "User logged out successfully!" });
    return;
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: (error as Error).message,
    });
    return;
  }
};

const getUserDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.send(req.user);
    return;
  } catch (error) {
    res.send(HTTP_STATUS.BAD_REQUEST).json({ error });
  }
};

const checkIfUserExist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      res.status(HTTP_STATUS.BAD_REQUEST).send({
        message: "Phone number is required",
      });
      return;
    }

    const user = await getUserByPhoneNumber(phoneNumber);

    if (user.user) {
      res.status(HTTP_STATUS.OK).send({
        message: "User exists",
        found: true,
        user,
      });
    } else {
      res.status(HTTP_STATUS.OK).send({
        message: "User not found",
        found: false,
      });
    }
  } catch (error) {
    console.error("Error checking if user exists:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      message: "An error occurred while checking user",
    });
  }
};

export { checkIfUserExist, getUserDetails, signIn, signOut, signUp };
