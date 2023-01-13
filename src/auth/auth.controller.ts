import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('/signin')
  async signIn(@Body() body) {
    return await this.authservice.validateUser(body.username, body.password);
  }

  @Post('/signup')
  async signUp(@Body() body) {
    return await this.authservice.createUser(body.username, body.password);
  }
}
