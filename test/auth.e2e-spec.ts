import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AuthResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should login a user', async () => {
    const loginInput = {
      username: 'nvh999',
      password: '123456789',
    };

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            login(loginInput: ${JSON.stringify(loginInput)}) {
              user {
                id,
                email,
                username
              },
              accessToken
            }
          }
        `,
      })
      .expect(200);

    // Add assertions for the response
  });

  it('should register a user', async () => {
    const registerInput = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: '12345678',
    };

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            register(registerInput: ${JSON.stringify(registerInput)}) {
              username,
              email,
              id
            }
          }
        `,
      })
      .expect(200);

    // Add assertions for the response
  });

  it('should send forgot password request', async () => {
    const forgotPasswordInput = {
      email: 'admin@gmail.com',
    };

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            forgotPassword(forgotPasswordInput: ${JSON.stringify(
              forgotPasswordInput,
            )}) {
              message
            }
          }
        `,
      })
      .expect(200);

    // Add assertions for the response
  });

  it('should reset user password', async () => {
    const resetPasswordInput = {
      forgotPasswordToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1c2VybmFtZSI6Im52aDk5OSIsImVtYWlsIjoibnZhbmh1eS5pdEBnbWFpbC5jb20ifSwiaWF0IjoxNzAyMjg2MDAzLCJleHAiOjE3MDIyODYzMDN9.7ZLyi6MlnfW3lb2eG2FXCTTGW6oCWPtPVdhLdDXGfoQ',
      password: '123456789',
    };

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            resetPassword(resetPasswordInput: ${JSON.stringify(
              resetPasswordInput,
            )}) {
              message
            }
          }
        `,
      })
      .expect(200);

    // Add assertions for the response
  });
});
