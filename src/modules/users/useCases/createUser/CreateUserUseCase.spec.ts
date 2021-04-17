import { CreateUserUseCase } from "./CreateUserUseCase";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "test",
      email: "test@test.com",
      password: "123123",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with existent email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "test",
        email: "test@test.com",
        password: "123123",
      });

      await createUserUseCase.execute({
        name: "test",
        email: "test@test.com",
        password: "123123",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
