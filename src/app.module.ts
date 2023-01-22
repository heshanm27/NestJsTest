import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { CaslModule } from './casl/casl.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { dataSourceOptions } from '../db/data-source';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PostModule,
    CaslModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      dropSchema: Boolean(process.env.TYPEORM_DROP_SCHEMA),
      autoLoadEntities: true,
    }),
  ],
  providers: [JwtService],
})
export class AppModule {}
