import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/user.entity';
import {  UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,private readonly jwtService:JwtService) {}


  //check recieved username and password match
   validateUser(email: string, pass: string): User |null {
   
    const user = this.userService.findOneByEmail(email);
  console.log("validate",user)
    if (!user) {
      return null;
    }
    const passwordIsValid = user.password === pass
    return passwordIsValid ? user : null;
  }


  login(user: User) {
    const payload ={
        email: user.email,
    }

    return {
        access_token: this.jwtService.sign(payload)
    }
  }


  //create new user
  async signUp(email: string, pass: string): Promise<any> {
    //find user
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    return await this.userService.createUser(email, pass);
  }
}
