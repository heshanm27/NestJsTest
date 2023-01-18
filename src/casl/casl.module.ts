import { Module } from '@nestjs/common';
import { CaslPermission } from './casl-ability.factory/casl-ability.factory';
import { AuthModule } from 'src/auth/auth.module';
import { Global } from '@nestjs/common/decorators';
@Global()
@Module({
  providers: [CaslPermission],
  exports: [CaslPermission],
})
export class CaslModule {}
