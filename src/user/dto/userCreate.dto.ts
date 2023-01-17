import { IsString, IsOptional, MinLength } from 'class-validator';

export class UserCreateDto {
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  role: string;
}
