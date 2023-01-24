import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Request, Response } from 'express';
import { User } from '../user/entity/user.entity';
import { UserCreateDto } from '../user/dto/usercreate.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { OtpService } from '../util/otp/otp.service';

@Controller('auth')
export class AuthController {
  //Inject the AuthService
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user as User);
  }

  @Post('/signup')
  async signUp(@Body() body: UserCreateDto) {
    return await this.authService.signUp(body);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google/login')
  async logout(@Req() req: Request) {
    return { msg: 'ok' };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google/redirect')
  refresh(@Req() req: Request, @Res() res: Response) {
    const token = this.authService.login(req.user as User);
    res.json(token);
  }

  @Get('/otp')
  async getOtp(@Res() res: Response) {
    const otp = await this.otpService.createOtp(
      '35c1abb7-5074-4f4c-9867-29f15ca5bebf',
    );
    res.json({ msg: 'ok', otp });
  }

  @Get('/verify')
  async verifyOtp(@Res() res: Response) {
    const otp = await this.otpService.verifyOtp(
      '35c1abb7-5074-4f4c-9867-29f15ca5bebf',
    );
    // console.log(otp);
    res.json({ msg: 'Otp Verified', otp });
  }
}
