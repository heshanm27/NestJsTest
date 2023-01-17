import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: 1,
      email: 'john@gmail.com',
      password: '123456',
      role: 'writer',
    },
    {
      id: 2,
      email: 'maria@gmail.com',
      password: 'test',
      role: 'user',
    },
    {
      id: 3,
      email: 'test',
      password: 'test@gmail.com',
      role: 'user',
    },
  ];

  findOneById(id: number): User {
    return this.users.find((user) => user.id === id);
  }

  findOneByEmail(email: string): User {
    return this.users.find((user) => user.email === email);
  }
  findAll(): User[] {
    return this.users;
  }

  createUser(email: string, password: string): User {
    const user: User = {
      id: this.users.length + 1,
      email,
      password,
      role: 'user',
    };

    this.users.push(user);

    return user;
  }
}
