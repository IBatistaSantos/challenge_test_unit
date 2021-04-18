import { OperationType } from "../../entities/Statement";

import { User } from "../../../users/entities/User";
import { GetBalanceError } from "../getBalance/GetBalanceError";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

let getBalanceUseCase: GetBalanceUseCase;
let usersRepository: InMemoryUsersRepository;
let statementRepository: InMemoryStatementsRepository;

describe("Get Balance Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();

    getBalanceUseCase = new GetBalanceUseCase(
      statementRepository,
      usersRepository
    );
  });

  it("should be able to list all balances.", async () => {
    const user: User = await usersRepository.create({
      email: "test@test.com",
      name: "Test",
      password: "123123",
    });

    const statement = await statementRepository.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Iginite",
    });

    const statement2 = await statementRepository.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Iginite",
    });

    const statement3 = await statementRepository.create({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 500,
      description: "Iginite",
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance).toStrictEqual({
      statement: expect.arrayContaining([statement, statement2, statement3]),
      balance: 1500,
    });
  });

  it("should not be able to list a balance with non existing user", async () => {
    await expect(
      getBalanceUseCase.execute({
        user_id: "no-user",
      })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
