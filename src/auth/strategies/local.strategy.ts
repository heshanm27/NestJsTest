import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { User } from "src/user/user.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService:AuthService ){
        super()
    }

    validate (email:string, password:string):User{
            console.log(email, password)
        const user = this.authService.validateUser(email, password);

        if(!user){
            throw new UnauthorizedException('Invalid credentials')
        }

        return user
    }
}