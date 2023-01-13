import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [],
  providers: [UserService],
})
export class AppModule {}
