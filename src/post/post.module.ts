import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { RolesGuard } from 'src/role/role.guard';

@Module({
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
