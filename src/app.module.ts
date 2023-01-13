import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { CaslModule } from './casl/casl.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [UserModule, AuthModule, CaslModule, PostModule],
  controllers: [],
  providers: [UserService],
})
export class AppModule {}
