import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { User } from 'src/user/entity/user.entity';
import { UserCreateDto } from 'src/user/dto/usercreate.dto';

describe('Auth Controller', () => {
  let controller: AuthController;
  const mockAuthService = {
    login: jest.fn((user: User) => {
      return { access_token: 'test' };
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
});
