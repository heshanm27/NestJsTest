import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserCreateDto } from 'src/user/dto/usercreate.dto';
import * as httpMocks from 'node-mocks-http';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('Auth Controller', () => {
  let service: AuthService;
  let userService: UserService;
  let mockUser = {
    id: 'Id1',
    email: 'test@gmail.com',
    password: '123456',
    role: 'reader',
  };

  let mockUsersService = {
    createUser: jest.fn((user: UserCreateDto) => {
      return Promise.resolve(mockUser);
    }),
    findOneByEmail: jest.fn((email: string) => {
      return Promise.resolve(mockUser);
    }),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUsersService },
        JwtService,
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return user after validate', async () => {
    const user = await service.validateUser(mockUser.email, mockUser.password);
    expect(user).toEqual(mockUser);
  });

  it('should return null after validate', async () => {
    const user = await service.validateUser(mockUser.email, '123');
    expect(user).toBeNull();
  });
});
