import { Test, TestingModule } from '@nestjs/testing';
import * as httpMocks from 'node-mocks-http';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('Auth Controller', () => {
  let controller: PostController;
  const mockRequest = httpMocks.createRequest();

  mockRequest.user = {
    id: 'Id1',
    email: 'test@gmail.com',
    password: '123456',
    firstName: 'test',
    lastName: 'testlastname',
    role: 'reader',
  };

  const mockPostService = {
    findAll: jest.fn(() => Promise.resolve([])),
    findOne: jest.fn(() => Promise.resolve({})),
    create: jest.fn(() => Promise.resolve({})),
    update: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve({})),
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

  //   it('should return access_token', async () => {
  //     const result = await controller.login(mockRequest);
  //     console.log(result);
  //     expect(result).toEqual({ access_token: 'test' });
  //   });
  //   it('should return user', async () => {
  //     const user: UserCreateDto = {
  //       email: 'email@gmail.com',
  //       password: '123456',
  //     };
  //     const result = await controller.signUp(user);
  //     expect(mockAuthService.signUp).toBeCalledWith(user);
  //     expect(result).toEqual({
  //       id: 1,
  //       email: 'test@gmail.com',
  //       password: 'test',
  //     });
  //   });
});
