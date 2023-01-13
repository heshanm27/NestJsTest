import { Module } from '@nestjs/common';

@Module({
  exports: [RoleModule],
})
export class RoleModule {}
