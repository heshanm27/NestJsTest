import {  IsNotEmpty,IsString,IsNumber,IsArray} from "class-validator";


export class PostDto{


    @IsNotEmpty()
    @IsString()
    title: string;


    @IsNotEmpty()
    @IsString()
    content: string;


    @IsNotEmpty()
    @IsArray()
    category?: string[];

    @IsNotEmpty()
    @IsNumber()
    authorId?: number;
}
