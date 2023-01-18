import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import {
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common/exceptions';
import { UserCreateDto } from './dto/usercreate.dto';
import {
  Actions,
  CaslPermission,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class UserService {
  constructor(
    private readonly caslPermission: CaslPermission,
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

  async updateUser(id: string, userDetails: UserCreateDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const ability = this.caslPermission.defineAbility(user);
      ForbiddenError.from(ability).throwUnlessCan(Actions.Update, user);

      await this.usersRepository.update(id, userDetails);

      const updatedUser = await this.usersRepository.findOneBy({ id });

      return updatedUser;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException('You are not allowed to do this');
      }

      throw error;
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new BadRequestException('User not found');
      }
      await this.usersRepository.delete(id);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
