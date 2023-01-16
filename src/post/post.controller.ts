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
import { PostDto } from './dto/post.dto';
import { jwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Role } from 'src/auth/authorization/role.enum';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { RolesGuard } from 'src/auth/authorization/role.guard';
import {
  Actions,
  CaslAbilityFactory,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { User } from 'src/user/entity/user.entity';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly caslAblity: CaslAbilityFactory,
  ) {}

  @Get()
  @Roles(Role.Writer, Role.Admin, Role.Editor)
  @UseGuards(jwtAuthGuard, RolesGuard)
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Post()
  // @Roles(Role.Writer, Role.Admin, Role.Editor)
  @UseGuards(jwtAuthGuard, RolesGuard)
  create(@Req() req: Request, @Body() createPostDto: PostDto) {
    const ability = this.caslAblity.defineAbility(req.user as User);
    const isAllowed = ability.can(Actions.Create, req.user as User);
    if (!isAllowed) {
      throw new UnauthorizedException('not enough permissions');
    }
    return this.postService.create(createPostDto);
  }

  @Patch(':id')
  @Roles(Role.Writer, Role.Admin, Role.Editor)
  @UseGuards(jwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updatePostDto: PostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @Roles(Role.Writer, Role.Admin, Role.Editor)
  @UseGuards(jwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
