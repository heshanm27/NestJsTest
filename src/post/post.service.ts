import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PostDto } from './dto/post.dto';
import {
  Actions,
  CaslAbilityFactory,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { User } from 'src/user/entity/user.entity';
import { subject } from '@casl/ability';

export type PostDoc = {
  id: number;
  title: string;
  content: string;
  category?: string[];
  authorId: number;
};

@Injectable()
export class PostService {
  constructor(private readonly caslAblity: CaslAbilityFactory) {}

  private posts: PostDoc[] = [
    {
      id: 1,
      title: 'Post 1',
      content: 'Content 1',
      authorId: 1,
    },
    {
      id: 2,
      title: 'Post 2',
      content: 'Content 2',
      authorId: 2,
    },
    {
      id: 3,
      title: 'Post 3',
      content: 'Content 3',
      authorId: 3,
    },
    {
      id: 4,
      title: 'Post 4',
      content: 'Content 4',
      authorId: 4,
    },
  ];

  create(createPostDto: PostDto) {
    const newPost = {
      id: this.posts.length + 1,
      title: createPostDto.title,
      content: createPostDto.content,
      authorId: createPostDto.authorId,
    };
    return this.posts.push(newPost);
  }

  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    return this.posts.find((post) => post.id === id);
  }

  update(id: number, updatePostDto: PostDto, user: User) {
    //find and remove the post from array
    const postIndex: number = this.posts.findIndex((post) => post.id === id);
    this.posts.splice(postIndex, 0);
    console.log(this.posts[postIndex]);
    console.log('updatePostDto', updatePostDto);
    const ability = this.caslAblity.defineAbility(user);
    const isAllowed = ability.can(Actions.Update, user);
    console.log(isAllowed);

    if (!isAllowed) {
      throw new UnauthorizedException('not enough permissions');
    }
    const updatePost = {
      id: id,
      title: updatePostDto.title,
      content: updatePostDto.content,
      authorId: updatePostDto.authorId,
    };

    console.log('updatePost', updatePost);
    return this.posts.push(updatePost);
  }

  remove(id: number) {
    const withoutPost: number = this.posts.findIndex((post) => post.id === id);
    return this.posts.splice(withoutPost, 1);
  }
}
