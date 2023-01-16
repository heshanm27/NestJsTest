import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { PostModule } from './post/post.module';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [UserModule, AuthModule, PostModule, CaslModule],
  providers: [UserService],
})
export class AppModule {}
