import { hash } from "bcryptjs";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUseCase: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("should be able to authenticate an user", async () => {
    const user = await usersRepository.create({
      name: "User test",
      email: "user@test.com",
      password: "123123",
    });

    const authUser = await authenticateUseCase.execute({
      email: user.email,
      password: "123123",
    });

    expect(authUser).toHaveProperty("token");
  });

  it("should not be able to authenticate an user not exists ", async () => {
    expect(async () => {
      await authenticateUseCase.execute({
        email: "user@test.com",
        password: "123123",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate an user password incorrect ", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: "User test",
        email: "user@test.com",
        password: "123123",
      });

      await authenticateUseCase.execute({
        email: user.email,
        password: "incorrect",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
