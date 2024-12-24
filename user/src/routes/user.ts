import express, { Request, Response, Router } from "express";
import { userAuth } from "../middleware/userAuth";
import { checkIfUserExist, getUserDetails, signIn, signOut, signUp } from "../controller/userController";
const router: Router = express.Router();

router.get("/", (req: Request, res: Response): void => {
  res.send("User service is up and running! 🚀");
  return;
});

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);
router.get("/getUserDetails", userAuth, getUserDetails);
router.post("/checkIfUserExists", checkIfUserExist);

export { router };
