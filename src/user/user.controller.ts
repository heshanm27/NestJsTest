import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

@Controller('user')
export class UserController {
  // Inject User Service class
  constructor(private readonly userService: UserService) {}

  // Get all users
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // Get user by username
  @Get(':username')
  async findOne(@Param() params) {
    const user = await this.userService.findOne(params.username);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }
}
