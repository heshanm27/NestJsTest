import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserCreateDto } from '../src/user/dto/usercreate.dto';
import { Post } from '../src/post/entity/post.entity';
import { User } from '../src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserUpdateDto } from 'src/user/dto/userUpdate.dto';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication;
  let BASE_URL: string = process.env.BASE_URL;
  let token = '';
  let tempUser: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    await app.listen(process.env.PORT);
    const userRep = app.get<Repository<User>>(getRepositoryToken(User));
    await userRep.delete({});
  });

  afterAll(async () => {
    await app.close();
    console.log('App closed');
  });

  describe('signup', () => {
    it('should throw an error if email empty', async () => {
      const userDto: UserCreateDto = {
        email: '',
        password: '123456',
        firstName: '',
        lastName: '',
      };
      const reponse = await await request(BASE_URL)
        .post('/auth/signup')
        .send(userDto);

      expect(reponse.statusCode).toBe(400);
      expect(reponse.body).toHaveProperty('message');
      expect(reponse.body.message).toContain('email should not be empty');
    });

    it('should throw an error if password empty', async () => {
      const userDto: UserCreateDto = {
        email: 'test@gmail.com',
        password: '',
        firstName: '',
        lastName: '',
      };
      const reponse = await await request(BASE_URL)
        .post('/auth/signup')
        .send(userDto);

      expect(reponse.statusCode).toBe(400);
      expect(reponse.body).toHaveProperty('message');
      expect(reponse.body.message).toContain('password should not be empty');
    });

    it('should return user', async () => {
      const userDto: UserCreateDto = {
        email: 'test@gmail.com',
        password: '1234567',
        firstName: 'test',
        lastName: 'test',
      };
      const reponse = await await request(BASE_URL)
        .post('/auth/signup')
        .send(userDto);
      tempUser = reponse.body;
      expect(reponse.statusCode).toBe(201);

      expect(reponse.body).toMatchObject({
        id: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
        role: expect.any(String),
      });
    });

    it('should throw an error if email already exists', async () => {
      const userDto: UserCreateDto = {
        email: 'test@gmail.com',
        password: '1234567',
        firstName: 'test',
        lastName: 'test',
      };
      const reponse = await await request(BASE_URL)
        .post('/auth/signup')
        .send(userDto);

      expect(reponse.statusCode).toBe(400);
      expect(reponse.body).toMatchObject({
        statusCode: expect.any(Number),
        message: expect.any(String),
        error: expect.any(String),
      });
    });
  });

  describe('signin', () => {
    it('should throw an error if email empty', async () => {
      const userDto: UserCreateDto = {
        email: '',
        password: '123456',
        firstName: '',
        lastName: '  ',
      };
      const reponse = await request(BASE_URL).post('/auth/login').send(userDto);

      console.log(reponse.body);
      expect(reponse.statusCode).toBe(401);
      expect(reponse.body).toHaveProperty('message');
      expect(reponse.body.message).toContain('Unauthorized');
    });

    it('should throw an error if password wrong', async () => {
      const userDto: UserCreateDto = {
        email: 'test@gmail.com',
        password: '1234562',
        firstName: '',
        lastName: '',
      };
      const reponse = await request(BASE_URL).post('/auth/login').send(userDto);
      console.log(reponse.body);
      expect(reponse.statusCode).toBe(401);
      expect(reponse.body).toHaveProperty('message');
      expect(reponse.body.message).toContain('Invalid credential');
    });

    it('should return user if creditional correct', async () => {
      const userDto: UserCreateDto = {
        email: 'test@gmail.com',
        password: '1234567',
        firstName: 'test',
        lastName: 'test',
      };
      const reponse = await request(BASE_URL).post('/auth/login').send(userDto);

      token = reponse.body.access_token;
      console.log(reponse.body);
      expect(reponse.statusCode).toBe(201);
      expect(reponse.body).toMatchObject({
        access_token: expect.any(String),
      });
    });

    it('should update user role to admin', async () => {
      const userDto: UserUpdateDto = {
        ...tempUser,
        firstName: 'test',
        lastName: 'test',
        role: 'admin',
      };
      const reponse = await request(BASE_URL)
        .patch(`/user/${tempUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(userDto);
      console.log('update', reponse.body);
      expect(reponse.statusCode).toBe(200);
      expect(reponse.body).toMatchObject({
        id: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        role: expect.any(String),
      });
    });
  });

  //   describe('delete user', () => {
  //     it('should delete user', async () => {
  //       const reponse = await request(BASE_URL)
  //         .delete(`/user/${tempUser.id}`)
  //         .set('Authorization', `Bearer ${token}`);

  //       console.log('delete', reponse.body);
  //       expect(reponse.statusCode).toBe(200);
  //       expect(reponse.body).toMatchObject({
  //         id: expect.any(String),
  //         email: expect.any(String),
  //         password: expect.any(String),
  //         firstName: expect.any(String),
  //         lastName: expect.any(String),
  //         role: expect.any(String),
  //       });
  //     });
  //   });
});
