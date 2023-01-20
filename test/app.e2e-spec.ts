import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserCreateDto } from '../src/user/dto/usercreate.dto';
import { Repository } from 'typeorm';
import { Post } from '../src/post/entity/post.entity';
import { User } from '../src/user/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let BASE_URL: string = 'http://localhost:8000';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.listen(process.env.PORT || 8000);
  });

  afterAll(async () => {
    const postRepo = app.get<Repository<Post>>(getRepositoryToken(Post));
    const userRep = app.get<Repository<User>>(getRepositoryToken(User));
    await userRep.delete({});
    await postRepo.delete({});
    await app.close();
  });

  describe('Auth', () => {
    describe('signup', () => {
      it('should throw an error if email empty', async () => {
        const userDto: UserCreateDto = {
          email: '',
          password: '123456',
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
        };
        const reponse = await await request(BASE_URL)
          .post('/auth/signup')
          .send(userDto);

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
  });
});
