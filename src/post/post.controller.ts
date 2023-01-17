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
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PostService } from './post.service';
import { PostCreateDto } from './dto/postCreate.dto';
import { jwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Role } from 'src/auth/authorization/role.enum';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { RolesGuard } from 'src/auth/authorization/role.guard';
import {
  Actions,
  CaslAbilityFactory,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { User } from 'src/user/entity/user.entity';
import { PostUpdateDto } from './dto/postUpdate.dto';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly caslAblity: CaslAbilityFactory,
  ) {}

  @Get()
  async findAll() {
    return await this.postService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postService.findOne(id);
  }

  @Post()
  @Roles(Role.Writer, Role.Admin, Role.Editor)
  @UseGuards(jwtAuthGuard, RolesGuard)
  async create(@Req() req: Request, @Body() createPostDto: PostCreateDto) {
    const ability = this.caslAblity.defineAbility(req.user as User);
    const isAllowed = ability.can(Actions.Create, req.user as User);
    if (!isAllowed) {
      throw new UnauthorizedException('not enough permissions');
    }
    return await this.postService.create(createPostDto, req.user as User);
  }

  @Patch(':id')
  @Roles(Role.Writer, Role.Admin, Role.Editor)
  @UseGuards(jwtAuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() updatePostDto: PostUpdateDto) {
    return await this.postService.update(id, {
      ...updatePostDto,
    });
  }

  @Delete(':id')
  @Roles(Role.Writer, Role.Admin, Role.Editor)
  @UseGuards(jwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: string) {
    return await this.postService.delete(id);
  }
}
