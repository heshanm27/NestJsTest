import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt/dist';
// import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  // providers: [AuthService,JwtStrategy,LocalStrategy],
  controllers: [AuthController],
  // imports: [UserModule,PassportModule.register({defaultStrategy: 'jwt'}),JwtModule.register({
  //   secret: 'secretKey',
  //   signOptions: { expiresIn: '3600s' },
  // })],
  imports:[UserModule,PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
