import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserCreateDto } from 'src/user/dto/usercreate.dto';
import * as httpMocks from 'node-mocks-http';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/user.entity';

describe('Auth Controller', () => {
  let service: AuthService;
  let userService: UserService;
  let mockUser: User = {
    id: 'Id1',
    email: 'test@gmail.com',
    password: '123456',
    role: 'reader',
    firstName: '',
    lastName: '',
  };

  let mockUsersService = {
    createUser: jest.fn((user: UserCreateDto) => {
      return Promise.resolve(mockUser);
    }),
    findOneByEmail: jest.fn((email: string) => {
      return Promise.resolve(mockUser);
    }),
  };

  let mockJwtService = {
    sign: jest.fn((payload: any) => 'test'),
  };
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUsersService },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
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
    expect(mockUsersService.findOneByEmail).toHaveBeenCalled();
    expect(user).toEqual(mockUser);
  });

  it('should return null after validate', async () => {
    const user = await service.validateUser(mockUser.email, '123');
    expect(mockUsersService.findOneByEmail).toHaveBeenCalled();
    expect(user).toBeNull();
  });

  it('should return access_token', async () => {
    const result = await service.login(mockUser);
    console.log(result);
    expect(result).toMatchObject({
      access_token: 'test',
    });
  });

  it('should return user after signup', async () => {
    const mockUserDto: UserCreateDto = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    };
    const result = await service.signUp(mockUserDto);
    expect(mockUsersService.createUser).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });
});
