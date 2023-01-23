import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserCreateDto } from '../src/user/dto/usercreate.dto';
import { Post } from '../src/post/entity/post.entity';
import { User } from '../src/user/entity/user.entity';
import { PostCreateDto } from '../src/post/dto/postCreate.dto';
import { UserUpdateDto } from '../src/user/dto/userUpdate.dto';
import { PostUpdateDto } from '../src/post/dto/postUpdate.dto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Post Controller (e2e)', () => {
  let app: INestApplication;
  let BASE_URL: string = process.env.BASE_URL;
  let token = '';
  let tempPost: Post;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    // await app.init();
    await app.listen(process.env.PORT);
  });

  afterAll(async () => {
    const postRepo = app.get<Repository<Post>>(getRepositoryToken(Post));
    await postRepo.delete({});
    await app.close();
    console.log('App closed');
  });

  describe('Sign In', () => {
    it('should return access Token if creditional correct', async () => {
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
  });

  describe('Post', () => {
    describe('create', () => {
      it('should create a post ', async () => {
        const postDto: PostCreateDto = {
          content: 'test',
          title: 'test title',
          category: 'test category',
        };
        console.log(token);
        const reponse = await request(BASE_URL)
          .post('/post')
          .set('Authorization', `Bearer ${token}`)
          .send(postDto);
        console.log(reponse.body);
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
});
