import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Request, Response } from 'express';
import { User } from '../user/entity/user.entity';
import { UserCreateDto } from '../user/dto/usercreate.dto';
import { GoogleAuthGuard } from './guards/google.guard';
@Controller('auth')
export class AuthController {
  //Inject the AuthService
  constructor(private readonly authService: AuthService) {}

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
  async refresh(@Req() req: Request, @Res() res: Response) {
    console.log(req.user);
    return res.status(HttpStatus.OK).json(req.user);
  }
}
