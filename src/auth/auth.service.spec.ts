import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entity/user.entity';
import { Console } from 'console';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    findOneByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user if validation is successful', async () => {
    const mockuser = {
      email: 'test@gmail.com',
      password: 'test123',
    };

    jest.spyOn(mockUserService, 'findOneByEmail').mockResolvedValue(mockuser);

    const result = await service.validateUser(
      mockuser.email,
      mockuser.password,
    );
    expect(result).toEqual(mockuser);
  });

  it('should return a user if signup is successful', async () => {
    const mockuser: User = {
      email: 'test@gmail.com',
      password: 'test123',
      id: '1',
      firstName: 'test',
      lastName: 'test',
      role: 'user',
    };

    jest.spyOn(mockUserService, 'createUser').mockResolvedValue(mockuser);

    const result = await service.signUp(mockuser);
    expect(result).toEqual(mockuser);
  });

  //   it('should return a token if login is successful', async () => {
  //     const mockuser: User = {
  //       email: 'test@gmail.com',
  //       password: 'test123',
  //       id: '1',
  //       firstName: 'test',
  //       lastName: 'test',
  //       role: 'user',
  //     };

  //     jest.spyOn(mockJwtService, 'sign').mockResolvedValue(mockuser);

  //     const result = await service.signUp(mockuser);
  //     expect(result).toEqual(mockuser);
  //   });

  // describe('validateUser', () => {
  //     it('should return a user if validation is successful', async () => {
  //         const email = ''
  //         const password = ''
  //     })
});
