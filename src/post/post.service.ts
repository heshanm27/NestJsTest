import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { User } from '../user/entity/user.entity';
import { ForbiddenError } from '@casl/ability';
import { Post } from './entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { PostCreateDto } from './dto/postCreate.dto';
import { PostUpdateDto } from './dto/postUpdate.dto';
import {
  Actions,
  CaslPermission,
} from '../casl/casl-ability.factory/casl-ability.factory';
@Injectable()

//Inject CaslPermission Class to use it in the service
//Inject postRepository to use database operations(TypeOrm)
export class PostService {
  constructor(
    private readonly caslPermission: CaslPermission,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  //Create a new post
  async create(createPostDto: PostCreateDto, user: User): Promise<Post> {
    try {
      const newPost = this.postRepository.create({
        ...createPostDto,
        authorId: user.id,
      });
      return await this.postRepository.save(newPost);
    } catch (err) {
      throw err;
    }
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async findOne(id: string): Promise<Post> {
    return await this.postRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updatePostDto: PostUpdateDto,
    user: User,
  ): Promise<Post> {
    try {
      const post = await this.postRepository.findOneBy({ id });

      // if (!post) {
      //   throw new UnauthorizedException('Post not found');
      // }

      //Check if the user is allowed to update the post
      const ability = this.caslPermission.defineAbility(user);
      ForbiddenError.from(ability).throwUnlessCan(Actions.Update, post);

      //Update the post
      await this.postRepository.update(id, updatePostDto);
      //Return the updated post
      const updatedPost = await this.postRepository.findOneBy({ id });
      return updatedPost;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException('You are not allowed to do this');
      }

      throw error;
    }
  }

  //Delete a post
  async delete(id: string, user: User): Promise<Post> {
    //check if the user exists
    const post = await this.postRepository.findOneBy({ id });

    //Check if the user is allowed to update the post
    const ability = this.caslPermission.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Actions.Delete, post);

    //user not found throw an error
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    await this.postRepository.delete(id);
    return post;
  }
}
