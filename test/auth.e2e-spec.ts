import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthService (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const definedEmail = 'test@examaaple.com';
    return request(app.getHttpServer())
      .post('/users/signup')
      .send({email: definedEmail, password: 'test'})
      .expect(201)
      .then(res => {
          const { email, id } = res.body;
          expect(id).toBeDefined();
          expect(email).toEqual(definedEmail);
      });
  });

  it('handles a signup request and logs in new user', async () => {
    const definedEmail = 'test2@examaaple.com';
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send({email: definedEmail, password: 'test'})

    const cookie = res.get('set-cookie');
    const { body } = await request(app.getHttpServer())
        .get('/users/whoami')
        .set('Cookie', cookie)
        .expect(200);

    expect(body.email).toEqual(definedEmail);
    
  });
});

