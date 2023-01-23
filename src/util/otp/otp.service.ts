import { Global, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { Repository } from 'typeorm';
import * as otpGenerator from 'otp-generator';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
  ) {}

  async createOtp(userID: string): Promise<Otp> {
    const otpGenCode = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const newOtp = await this.otpRepository.create({
      otp: otpGenCode,
      userID,
    });
    return await this.otpRepository.save(newOtp);
  }
}
