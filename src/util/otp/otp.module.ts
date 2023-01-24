import { Module, Global } from '@nestjs/common';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { MailModule } from '../mail/mail.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Otp]), MailModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
