import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { User } from 'src/user/entity/user.entity';
import { UserCreateDto } from 'src/user/dto/usercreate.dto';
import * as httpMocks from 'node-mocks-http';

describe('Auth Controller', () => {
  let controller: AuthController;
  const mockRequest = httpMocks.createRequest();
  mockRequest.user = {
    id: 'Id1',
    email: 'test@gmail.com',
    password: '123456',
    firstName: 'test',
    lastName: 'testlastname',
    role: 'reader',
  };
  const mockAuthService = {
    login: jest.fn((user: User) => {
      return Promise.resolve({ access_token: 'test' });
    }),
    signUp: jest.fn((user: UserCreateDto) =>
      Promise.resolve({
        id: 1,
        email: 'test@gmail.com',
        password: 'test',
      }),
    ),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = moduleRef.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return access_token', async () => {
    const result = await controller.login(mockRequest);
  });
});
