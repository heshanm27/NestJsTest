import {
  IsString,
  IsOptional,
  MinLength,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class UserCreateDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // // @IsOptional()
  // // @IsString()
  // // firstName: string;

  // // @IsOptional()
  // // @IsString()
  // // lastName: string;

  // @IsOptional()
  // @IsString()
  // role: string;
}
