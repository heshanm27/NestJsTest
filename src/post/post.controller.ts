import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { PostService } from './post.service';
import { PostCreateDto } from './dto/postCreate.dto';
import { jwtAuthGuard } from '../auth/guards/jwt.guard';
import { Role } from '../auth/authorization/role.enum';
import { Roles } from '../auth/authorization/roles.decorator';
import { RolesGuard } from '../auth/authorization/role.guard';
import { User } from '../user/entity/user.entity';
import { PostUpdateDto } from './dto/postUpdate.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll() {
    return await this.postService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postService.findOne(id);

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return post;
  }

  @Post()
  @Roles(Role.Writer, Role.Admin, Role.Editor)
  @UseGuards(jwtAuthGuard, RolesGuard)
  async create(@Req() req: Request, @Body() createPostDto: PostCreateDto) {
    return await this.postService.create(createPostDto, req.user as User);
  }

  @Patch(':id')
  // @Roles(Role.Writer, Role.Admin, Role.Editor, Role.Reader)
  @UseGuards(jwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: PostUpdateDto,
    @Req() req: Request,
  ) {
    return await this.postService.update(id, updatePostDto, req.user as User);
  }

  @Delete(':id')
  @Roles(Role.Writer, Role.Admin, Role.Editor)
  @UseGuards(jwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: string, @Req() req: Request) {
    return await this.postService.delete(id, req.user as User);
  }
}
