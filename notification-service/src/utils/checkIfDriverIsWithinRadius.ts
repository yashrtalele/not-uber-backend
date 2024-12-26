import { Socket } from "socket.io";

const checkIfDriverIsWithinRadius = (driver: Socket, user: Socket) => {
  console.log("Checking if driver: ", driver.id, " is within radius for user", user.id);
  // return Math.random() > 0.5;
  return true;
};

export { checkIfDriverIsWithinRadius };
