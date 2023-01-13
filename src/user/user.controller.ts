import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';

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
    return await this.userService.findOne(params.username);
  }
}
