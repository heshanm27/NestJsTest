import { Injectable } from '@nestjs/common';

export type PostDoc = {
  id: number;
  title: string;
  content: string;
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

  create(createPostDto: PostDoc) {
    return this.posts.push(createPostDto);
  }

  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    return this.posts.find((post) => post.id === id);
  }

  update(id: number, updatePostDto: PostDoc) {
    const withoutPost: number = this.posts.findIndex((post) => post.id === id);
    this.posts.splice(withoutPost, 1);
    return this.posts.push(updatePostDto);
  }

  remove(id: number) {
    const withoutPost: number = this.posts.findIndex((post) => post.id === id);
    return this.posts.splice(withoutPost, 1);
  }
}
