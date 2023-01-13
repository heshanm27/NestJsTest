import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  username: string;
  password: string;
  role: string;
};

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      role: 'admin',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      role: 'user',
    },
    {
      userId: 3,
      username: 'test',
      password: 'test',
      role: 'user',
    },
    {
      userId: 4,
      username: 'test2',
      password: 'test2',
      role: 'user',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  findAll(): User[] {
    return this.users;
  }

  createUser(username: string, password: string): User {
    const user: User = {
      userId: this.users.length + 1,
      username,
      password,
      role: 'user',
    };

    this.users.push(user);

    return user;
  }
}
