import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserCreateDto } from 'src/user/dto/usercreate.dto';
import {} from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let BASE_URL: string = 'http://localhost:8000';
  let connection: any;
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
    await app.close();
  });

  describe('Auth', () => {
    const userDto: UserCreateDto = {
      email: '',
      password: '',
    };
    describe('signup', () => {
      it('should throw an error if email empty', async () => {
        const reponse = await await request(BASE_URL)
          .post('/auth/signup')
          .send(userDto);

        expect(reponse.statusCode).toBe(400);
        expect(reponse.body).toHaveProperty('message');
        expect(reponse.body.message).toContain('email should not be empty');
      });
    });
  });
});
