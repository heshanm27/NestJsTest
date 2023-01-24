import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { Repository } from 'typeorm';
import * as otpGenerator from 'otp-generator';
import * as jwt from 'jsonwebtoken';
import { MailService } from '../mail/mail.service';
@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    private readonly mailService: MailService,
  ) {}

  async createOtp(userID: string): Promise<string> {
    const otpExsist: Otp = await this.otpRepository.findOneBy({ userID });

    if (otpExsist) {
      await this.otpRepository.delete({ userID });
    }

    const otpGenCode = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const value = jwt.sign({ otpGenCode }, 'secretKey', { expiresIn: '1m' });

    const newOtp = await this.otpRepository.create({
      otp: value,
      userID,
    });

    await this.otpRepository.save(newOtp);

    this.mailService.sendMail('peshalagunasekara9@gmail.com', otpGenCode);
    return otpGenCode;
  }

  async verifyOtp(userID: string): Promise<any> {
    let otp = '';
    const otpObj: Otp = await this.otpRepository.findOneBy({ userID });

    console.log(otpObj.otp);
    if (otpObj) {
      jwt.verify(otpObj.otp, 'secretKey', (err: Error, decoded: any) => {
        console.log(typeof decoded);
        if (err instanceof jwt.TokenExpiredError) {
          throw new BadRequestException('Token Expired');
        }
        otp = decoded.otpGenCode;
      });
    }

    return otp;
  }
}
