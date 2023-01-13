import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  username: string;
  password: string;
};

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  test() {
    return 'test';
  }
  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  findAll(): User[] {
    return this.users;
  }
}
