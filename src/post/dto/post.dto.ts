import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export class PostDto {
  static readonly collectionName = 'PostDto';
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  category?: string[];

  @IsNotEmpty()
  @IsNumber()
  authorId: number;
}
