import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CaslModule } from 'src/casl/casl.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [CaslModule, AuthModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
