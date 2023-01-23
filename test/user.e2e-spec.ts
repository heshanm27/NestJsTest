import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserCreateDto } from '../src/user/dto/usercreate.dto';
import { User } from '../src/user/entity/user.entity';
import { UserUpdateDto } from '../src/user/dto/userUpdate.dto';

describe('User Controller (e2e)', () => {
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
    // await app.init();
    await app.listen(process.env.PORT);
  });

  afterAll(async () => {
    await app.close();
    console.log('App closed');
  });

  describe('signin', () => {
    it('should return token if creditional correct', async () => {
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

  // describe('delete user', () => {
  //   it('should delete user', async () => {
  //     const reponse = await request(BASE_URL)
  //       .delete(`/user/${tempUser.id}`)
  //       .set('Authorization', `Bearer ${token}`);

  //     console.log('delete', reponse.body);
  //     expect(reponse.statusCode).toBe(200);
  //     expect(reponse.body).toMatchObject({
  //       id: expect.any(String),
  //       email: expect.any(String),
  //       password: expect.any(String),
  //       firstName: expect.any(String),
  //       lastName: expect.any(String),
  //       role: expect.any(String),
  //     });
  //   });
  // });
});
