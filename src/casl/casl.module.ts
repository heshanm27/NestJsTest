import { Module } from '@nestjs/common';
import { CaslPermission } from './casl-ability.factory/casl-ability.factory';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [CaslPermission],
  exports: [CaslPermission],
})
export class CaslModule {}
