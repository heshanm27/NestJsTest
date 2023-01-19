import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../user/entity/user.entity';

//Local Strategy
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  //Inject the AuthService
  //Pass the options to the PassportStrategy Super Class
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  //Validate the payload
  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
