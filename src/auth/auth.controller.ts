import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('/signIn')
  async signIn(@Body() body) {
    return await this.authservice.validateUser(body.username, body.password);
  }
}
