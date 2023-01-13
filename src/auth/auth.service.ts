import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  //check recieved username and password match
  async validateUser(username: string, pass: string): Promise<any> {
    //find user
    const user = await this.userService.findOne(username);

    if (user && user.password === pass) {
      const { password, ...values } = user;
      return values;
    }

    throw new UnauthorizedException();
  }
}
