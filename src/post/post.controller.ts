import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';

import { UseGuards } from '@nestjs/common/decorators';
import { PostDto } from './dto/post.dto';
import { jwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Role } from 'src/auth/authorization/role.enum';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { RolesGuard } from 'src/auth/authorization/role.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Roles(Role.Writer, Role.Admin,Role.Writer)
  @UseGuards(jwtAuthGuard,RolesGuard)
  create(@Body() createPostDto: PostDto) {
    return this.postService.create(createPostDto);
  }



  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Writer, Role.Admin,Role.Writer)
  @UseGuards(jwtAuthGuard,RolesGuard)
  update(@Param('id') id: string, @Body() updatePostDto: PostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @Roles(Role.Writer, Role.Admin,Role.Writer)
  @UseGuards(jwtAuthGuard,RolesGuard)
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
