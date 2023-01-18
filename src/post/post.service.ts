import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { User } from 'src/user/entity/user.entity';
import { subject, defineAbility, ForbiddenError } from '@casl/ability';
import { Post } from './entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { PostCreateDto } from './dto/postCreate.dto';
import { PostUpdateDto } from './dto/postUpdate.dto';
import {
  Actions,
  CaslPermission,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
@Injectable()
export class PostService {
  constructor(
    private readonly caslPermission: CaslPermission,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: PostCreateDto, user: User): Promise<Post> {
    try {
      const newPost = this.postRepository.create({
        ...createPostDto,
        authorId: user.id,
      });
      return await this.postRepository.save(newPost);
    } catch (err) {}
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

      if (!post) {
        console.log('post not found');
        throw new UnauthorizedException('Post not found');
      }

      const ability = this.caslPermission.defineAbility(user);

      ForbiddenError.from(ability).throwUnlessCan(Actions.Update, post);

      await this.postRepository.update(id, updatePostDto);

      const updatedPost = await this.postRepository.findOneBy({ id });

      return updatedPost;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException('You are not allowed to do this');
      }

      throw error;
    }
  }

  async delete(id: string, user: User): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new UnauthorizedException('Post not found');
    }
    await this.postRepository.delete(id);
    return post;
  }
}
