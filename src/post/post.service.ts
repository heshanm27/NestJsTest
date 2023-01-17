import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  Actions,
  CaslAbilityFactory,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { User } from 'src/user/entity/user.entity';
import { subject } from '@casl/ability';
import { Post } from './entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { PostCreateDto } from './dto/postCreate.dto';
import { PostUpdateDto } from './dto/postUpdate.dto';
@Injectable()
export class PostService {
  constructor(
    private readonly caslAblity: CaslAbilityFactory,
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

  async update(id: string, updatePostDto: PostUpdateDto): Promise<string> {
    //find and remove the post from array
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new UnauthorizedException('Post not found');
    }

    await this.postRepository.update(id, updatePostDto);
    return 'Post updated';
  }

  async delete(id: string) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new UnauthorizedException('Post not found');
    }
    await this.postRepository.delete(id);
    return 'Post deleted';
  }
}
