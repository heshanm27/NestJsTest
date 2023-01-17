import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import {
  Actions,
  CaslAbilityFactory,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { User } from 'src/user/entity/user.entity';
import { subject, defineAbility, ForbiddenError } from '@casl/ability';
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

  async update(
    id: string,
    updatePostDto: PostUpdateDto,
    user: User,
  ): Promise<string> {
    try {
      const post = await this.postRepository.findOneBy({ id });

      if (!post) {
        throw new UnauthorizedException('Post not found');
      }

      const ability = this.caslAblity.defineAbility(user);

      ForbiddenError.from(ability).throwUnlessCan(Actions.Update, post);

      await this.postRepository.update(id, updatePostDto);

      return 'Post updated';
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException('Not authorized to update post');
      }
    }
  }

  async delete(id: string, user: User) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new UnauthorizedException('Post not found');
    }
    await this.postRepository.delete(id);
    return 'Post deleted';
  }
}
