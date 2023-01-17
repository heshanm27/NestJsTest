import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { PostModule } from './post/post.module';
import { CaslModule } from './casl/casl.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
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
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nestjs',
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
