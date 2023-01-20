import { Test, TestingModule } from '@nestjs/testing';
import * as httpMocks from 'node-mocks-http';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostUpdateDto } from './dto/postUpdate.dto';
import { User } from 'src/user/entity/user.entity';
import { PostCreateDto } from './dto/postCreate.dto';

describe('Post Controller', () => {
  let controller: PostController;
  const mockRequest = httpMocks.createRequest();

  mockRequest.user = {
    id: 'Id1',
    email: 'test@gmail.com',
    password: '123456',
    firstName: 'test',
    lastName: 'testlastname',
    role: 'writer',
  };

  const mockPostService = {
    findAll: jest.fn(() => Promise.resolve([])),
    findOne: jest.fn((id: string) => Promise.resolve({})),
    create: jest.fn((createPostDto: PostCreateDto, user: User) =>
      Promise.resolve({
        ...createPostDto,
        id: '1',
        authorId: user.id,
      }),
    ),
    update: jest.fn((id: string, updatePostDto: PostUpdateDto, user: User) =>
      Promise.resolve({ ...updatePostDto }),
    ),
    delete: jest.fn((id: string, user: User) => Promise.resolve({})),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostService],
    })
      .overrideProvider(PostService)
      .useValue(mockPostService)
      .compile();

    controller = moduleRef.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all post', async () => {
    const result = await controller.findAll();
    expect(mockPostService.findAll).toBeCalled();
    expect(result).toEqual([]);
  });

  it('should return one post', async () => {
    const result = await controller.findOne('1');
    expect(mockPostService.findOne).toBeCalledWith('1');
    expect(result).toEqual({});
  });
  it('should  create post', async () => {
    const post: PostCreateDto = {
      content: 'content',
      title: 'title',
      category: 'category',
    };

    const newPost = await controller.create(mockRequest, post);
    console.log(newPost);
    expect(mockPostService.create).toBeCalledWith(post, mockRequest.user);
    expect(newPost).toEqual({
      ...post,
      id: '1',
      authorId: 'Id1',
    });
  });

  it('should update post', async () => {
    const updatedpost: PostUpdateDto = {
      content: 'content',
      title: 'title',
      category: 'category',
    };
    const result = await controller.update('1', updatedpost, mockRequest);
    expect(mockPostService.update).toBeCalledWith(
      '1',
      updatedpost,
      mockRequest.user,
    );
    expect(result).toEqual(updatedpost);
  });

  it('should delete post', async () => {
    const result = await controller.remove('1', mockRequest);
    expect(mockPostService.delete).toBeCalledWith('1', mockRequest.user);
    expect(result).toEqual({});
  });
});
