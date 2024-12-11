import { createUser } from "../prisma/queries/createUser";
import { prismaMock } from "../singleton";

test("should create new user ", async () => {
  const user = {
    id: 9,
    username: "abc",
    password: "yash",
    phoneNumber: "7912323123",
  };
  const userProfile = {
    id: 7,
    firstName: "yash",
    lastName: "talele",
    email: "yash97@gmail.com",
  };

  prismaMock.user.create.mockResolvedValue(user);

  await expect(
    createUser(
      user.username,
      user.password,
      user.phoneNumber,
      userProfile.firstName,
      userProfile.lastName,
      userProfile.email
    )
  ).resolves.toEqual({
    user: {
      id: expect.any(Number),
      username: user.username,
      phoneNumber: user.phoneNumber,
    },
    userProfile: {
      id: expect.any(Number),
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
    },
  });
});
