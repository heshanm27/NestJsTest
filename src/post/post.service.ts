import { Injectable } from '@nestjs/common';
import { PostDto } from './dto/post.dto';

export type PostDoc = {
  id: number;
  title: string;
  content: string;
  category?: string[];
  authorId: number;
};

@Injectable()
export class PostService {
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

  update(id: number, updatePostDto: PostDto) {

    //find and remove the post from array
    const postIndex: number = this.posts.findIndex((post) => post.id === id);
    this.posts.splice(postIndex, 1);

    const updatePost = {
      id: id,
      title: updatePostDto.title,
      content: updatePostDto.content,
      authorId: updatePostDto.authorId,
    };
    return this.posts.push(updatePost);
  }

  remove(id: number) {
    const withoutPost: number = this.posts.findIndex((post) => post.id === id);
    return this.posts.splice(withoutPost, 1);
  }
}
