import { UserUpdateDto } from './dto/userUpdate.dto';
import { UserCreateDto } from './dto/usercreate.dto';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import * as httpMocks from 'node-mocks-http';
import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('Post Controller', () => {
  let controller: UserController;
  const mockRequest = httpMocks.createRequest();
  mockRequest.user = {
    id: 'Id1',
    email: 'test@gmail.com',
    password: '123456',
    firstName: 'test',
    lastName: 'testlastname',
    role: 'writer',
  };

  const mockUserService = {
    findAll: jest.fn(() => Promise.resolve([])),
    findOneById: jest.fn((id: string) => Promise.resolve(mockRequest.user)),
    create: jest.fn((createUserDto: UserCreateDto, user: User) =>
      Promise.resolve({
        ...createUserDto,
        id: '1',
        authorId: user.id,
      }),
    ),
    updateUser: jest.fn((id: string, updateUserDto: UserUpdateDto) =>
      Promise.resolve({ ...updateUserDto }),
    ),
    deleteUser: jest.fn((id: string, user: User) => Promise.resolve({})),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = moduleRef.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all post', async () => {
    const result = await controller.findAll();
    expect(mockUserService.findAll).toBeCalled();
    expect(result).toEqual([]);
  });

  it('should return one post', async () => {
    const result = await controller.findOne('Id1');
    console.log(result);
    expect(mockUserService.findOneById).toBeCalled();
    expect(result).toEqual(mockRequest.user);
  });

  it('should update post', async () => {
    const updatedUser: UserUpdateDto = {
      email: 'test2@gmail.com',
      lastName: 'testlastname2',
      password: '123456',
      role: 'writer',
      firstName: 'test',
    };
    const result = await controller.update('Id1', updatedUser);
    expect(mockUserService.updateUser).toBeCalled();
    console.log(result);
    expect(result).toEqual(updatedUser);
  });

  it('should delete post', async () => {
    const result = await controller.delete('1');
    expect(mockUserService.deleteUser).toBeCalled();
    expect(result).toEqual({});
  });
});
