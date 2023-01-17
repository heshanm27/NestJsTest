import { Controller, Get, Param, Patch, Body, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { Post } from 'src/post/entity/post.entity';

@Controller('user')
export class UserController {
  // Inject User Service class
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params) {
    const user = await this.userService.findOneById(params.id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  @Patch(':id')
  async update(@Param() params, @Body() body) {
    const user = await this.userService.updateUser(params.id, body);
    return user;
  }

  @Delete(':id')
  async delete(@Param() params) {
    const user = await this.userService.deleteUser(params.id);
    return user;
  }
}
