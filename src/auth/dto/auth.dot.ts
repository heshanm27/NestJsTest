import { IsEmail, IsNotEmpty,IsOptional,IsString, Min, MinLength} from "class-validator";


export class AuthDto{

@IsEmail()
@IsNotEmpty()
email: string;

@IsString()
@IsNotEmpty()
@MinLength(6)
password: string;

@IsString()
@IsOptional()
firstName?: string;

@IsString()
@IsOptional()
lastName?: string;

}