import { hash } from "bcryptjs";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

let authenticateUseCase: AuthenticateUserUseCase;
let usersRepository: IUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("should be able to authenticate an user", async () => {
    const user = await usersRepository.create({
      name: "User Test",
      email: "test@test.com",
      password: await hash("123", 8),
    });

    const authUser = await authenticateUseCase.execute({
      email: user.email,
      password: "123",
    });

    expect(authUser).toHaveProperty("token");
  });
});
