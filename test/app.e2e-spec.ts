import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserCreateDto } from '../src/user/dto/usercreate.dto';
import { Repository } from 'typeorm';
import { Post } from '../src/post/entity/post.entity';
import { User } from '../src/user/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostCreateDto } from 'src/post/dto/postCreate.dto';
import { UserUpdateDto } from 'src/user/dto/userUpdate.dto';
import { PostUpdateDto } from 'src/post/dto/postUpdate.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let BASE_URL: string = 'http://localhost:8000';
  let token = '';
  let tempUser: User;
  let tempPost: Post;
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
    await postRepo.delete({});
    await userRep.delete({});
    await app.close();
    console.log('App closed');
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

    describe('signin', () => {
      it('should throw an error if email empty', async () => {
        const userDto: UserCreateDto = {
          email: '',
          password: '123456',
        };
        const reponse = await request(BASE_URL)
          .post('/auth/login')
          .send(userDto);

        console.log(reponse.body);
        expect(reponse.statusCode).toBe(401);
        expect(reponse.body).toHaveProperty('message');
        expect(reponse.body.message).toContain('Unauthorized');
      });

      it('should throw an error if password wrong', async () => {
        const userDto: UserCreateDto = {
          email: 'test@gmail.com',
          password: '1234562',
        };
        const reponse = await request(BASE_URL)
          .post('/auth/login')
          .send(userDto);
        console.log(reponse.body);
        expect(reponse.statusCode).toBe(401);
        expect(reponse.body).toHaveProperty('message');
        expect(reponse.body.message).toContain('Invalid credential');
      });

      it('should return user if creditional correct', async () => {
        const userDto: UserCreateDto = {
          email: 'test@gmail.com',
          password: '1234567',
        };
        const reponse = await request(BASE_URL)
          .post('/auth/login')
          .send(userDto);

        token = reponse.body.access_token;
        console.log(reponse.body);
        expect(reponse.statusCode).toBe(201);
        expect(reponse.body).toMatchObject({
          access_token: expect.any(String),
        });
      });
    });
  });

  describe('User', () => {
    describe('get all users', () => {
      it('should return users array with details', async () => {
        const reponse = await request(BASE_URL).get('/user');

        tempUser = reponse.body[0];
        expect(reponse.statusCode).toBe(200);
        expect(reponse.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              email: expect.any(String),
              password: expect.any(String),
              firstName: expect.any(String),
              lastName: expect.any(String),
              role: expect.any(String),
            }),
          ]),
        );
      });
    });

    describe('get user by id', () => {
      it('should return user with details', async () => {
        const reponse = await request(BASE_URL).get(`/user/${tempUser.id}`);
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

    describe('update user', () => {
      it('should update user', async () => {
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
  });

  describe('Post', () => {
    describe('create', () => {
      it('should create a post ', async () => {
        const postDto: PostCreateDto = {
          content: 'test',
          title: 'test title',
          category: 'test category',
        };
        const reponse = await request(BASE_URL)
          .post('/post')
          .set('Authorization', `Bearer ${token}`)
          .send(postDto);
        expect(reponse.statusCode).toBe(201);
      });
    });

    describe('get all', () => {
      it('should return posts array with details', async () => {
        const reponse = await request(BASE_URL).get('/post');

        tempPost = reponse.body[0];
        expect(reponse.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              title: expect.any(String),
              content: expect.any(String),
              category: expect.any(String),
              authorId: expect.any(String),
            }),
          ]),
        );
      });
    });

    describe('get by id', () => {
      it('should return post with details', async () => {
        const reponse = await request(BASE_URL).get(`/post/${tempPost.id}`);
        console.log(tempPost.id);
        console.log(reponse.body);
        expect(reponse.statusCode).toBe(200);
        expect(reponse.body).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          content: expect.any(String),
          category: expect.any(String),
          authorId: expect.any(String),
        });
      });
    });

    describe('update post', () => {
      it('should update post', async () => {
        const postDto: PostUpdateDto = {
          title: 'test post Updated title',
          content: 'test post Updated content',
          category: 'test post Updated category',
        };
        const reponse = await request(BASE_URL)
          .patch(`/post/${tempPost.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(postDto);

        console.log('update', reponse.body);
        expect(reponse.statusCode).toBe(200);
        expect(reponse.body).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          content: expect.any(String),
          category: expect.any(String),
          authorId: expect.any(String),
        });
      });
    });

    describe('delete post', () => {
      it('should delete post', async () => {
        const reponse = await request(BASE_URL)
          .delete(`/post/${tempPost.id}`)
          .set('Authorization', `Bearer ${token}`);

        console.log('delete', reponse.body);
        expect(reponse.statusCode).toBe(200);
        expect(reponse.body).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          content: expect.any(String),
          category: expect.any(String),
          authorId: expect.any(String),
        });
      });
    });
  });

  describe('delete user', () => {
    it('should delete user', async () => {
      const reponse = await request(BASE_URL)
        .delete(`/user/${tempUser.id}`)
        .set('Authorization', `Bearer ${token}`);

      console.log('delete', reponse.body);
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
});
