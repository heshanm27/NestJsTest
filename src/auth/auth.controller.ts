import { Controller, Post, Body, Req,UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dot';
import { LocalAuthGuard } from './guards/local.guard';
import { Request } from 'express';
import { User } from 'src/user/entity/user.entity';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req:Request) {
    console.log('login')
    return this.authService.login(req.user as User);
  }

  @Post('/signup')
  async signUp(@Body() body:AuthDto) {
    return await this.authService.signUp(body.email, body.password);
  }
}
