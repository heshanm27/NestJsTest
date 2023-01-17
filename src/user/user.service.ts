import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { BadRequestException } from '@nestjs/common/exceptions';
import { UserCreateDto } from './dto/usercreate.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneById(id: string): Promise<User> {
    return await this.usersRepository.findOneBy({
      id,
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({
      email,
    });
  }
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async createUser(userDetails: UserCreateDto): Promise<User> {
    const user = await this.usersRepository.create({
      ...userDetails,
    });
    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  async updateUser(id: string, userDetails: UserCreateDto): Promise<string> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.usersRepository.update(id, userDetails);

    return 'user updated';
  }

  async deleteUser(id: string): Promise<string> {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new BadRequestException('User not found');
      }
      await this.usersRepository.delete(id);
      return 'User deleted';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
