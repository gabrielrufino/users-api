import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';

import { server } from '../../src/http.server';
import { orm } from '../../src/start/database';

describe('Testing the users lifecycle', () => {
  // let app: any
  let token: string;

  beforeEach(() => {
    // process.env.APP_ENV = 'testing'
    // process.env.DB_MONGODB_URI = process.env.MONGO_URL
    // process.env.TOKEN_SECRET = faker.datatype.string()

    // const { server } = await import('../../src/http.server')
    // app = server
  });

  afterAll(async () => {
    await orm.close();
  });

  const user = {
    name: faker.name.fullName(),
    email: faker.internet.email().toLowerCase(),
    username: faker.internet.userName().toLowerCase(),
    password: faker.internet.password(),
  };

  test('Should create an user', () => supertest(server)
    .post('/api/users')
    .send(user)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(201));

  test('Should create an token for authentication', async () => {
    const { body } = await supertest(server)
      .post('/api/tokens')
      .send({
        username: user.username,
        password: user.password,
      })
      .set('Accept', 'application/json')
      .expect(201);

    expect(body).toEqual({
      Authorization: expect.stringMatching(/^Bearer [A-Za-z0-9-._~+/]+=*(?:\.[A-Za-z0-9-._~+/]+=*)*$/),
    });

    token = body.Authorization;
  });

  test('Should list a page of users', async () => {
    const { body } = await supertest(server)
      .get('/api/users')
      .set('Authorization', token)
      .expect(200);

    expect(body).toMatchObject({
      meta: {
        page: expect.any(Number),
        size: expect.any(Number),
        total: expect.any(Number),
      },
      data: [
        {
          id: expect.any(String),
          name: user.name,
          username: user.username.toLowerCase(),
          email: user.email.toLowerCase(),
        },
      ],
    });
  });

  test('Should detail the user', async () => {
    const id = jwt.decode(token.split(' ')[1])?.sub;

    const { body } = await supertest(server)
      .get(`/api/users/${id}`)
      .set('Authorization', token)
      .expect(200);

    expect(body).toMatchObject({
      name: user.name,
      email: user.email.toLowerCase(),
      username: user.username.toLowerCase(),
    });
  });

  test('Should delete the user', () => {
    const id = jwt.decode(token.split(' ')[1])?.sub;

    return supertest(server)
      .delete(`/api/users/${id}`)
      .set('Authorization', token)
      .expect(204);
  });
});
