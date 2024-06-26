import { TokenModule } from '../src/modules/token/token.module';
import { setUpIntegrationTests } from './utils/testUtils';
import { UserModel } from '../src/modules/user/entities/user.entity';
import { TokenModel } from '../src/modules/token/entities/token.entity';

describe('Token Integration', () => {
  const supertest = setUpIntegrationTests(TokenModule);

  beforeEach(async () => {
    await TokenModel.delete({});
    await UserModel.delete({});

    await UserModel.query('ALTER SEQUENCE user_model_id_seq RESTART WITH 1');
    await TokenModel.query('ALTER SEQUENCE token_model_id_seq RESTART WITH 1');
  });

  describe('PATCH /token', () => {
    it('should return 400 when token body is invalid', async () => {
      const response = await supertest().patch('/token').send({});

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        error: 'Bad Request',
        message: [
          'token must be longer than or equal to 5 characters',
          'token must be a string',
        ],
        statusCode: 400,
      });
    });

    it('should return 400 when token is invalid', async () => {
      const response = await supertest()
        .patch('/token')
        .send({ token: '123456' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid token');
    });

    it('should return 400 when token has expired', async () => {
      const token = await TokenModel.create({
        expires_at: 1_000_000,
        created_at: 1_000_000_000,
      }).save();

      const response = await supertest()
        .patch('/token')
        .send({ token: token.token });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Token has expired');
    });

    it('should return 200 when token is valid', async () => {
      const token = await TokenModel.create({
        expires_at: parseInt(new Date().getTime().toString()) + 3_000_000,
        created_at: 1_000_000_000,
      }).save();

      await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        tokens: [token],
      }).save();

      const response = await supertest()
        .patch('/token')
        .send({ token: token.token });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('ok');
    });
  });

  describe('GET /token/:id/validate', () => {
    it('should return 400 when token is invalid', async () => {
      const response = await supertest().get('/token/1/validate');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid token');
    });

    it('should return 400 when token is expired', async () => {
      const token = await TokenModel.create({
        expires_at: 1_000_000,
        created_at: 1_000_000_000,
      }).save();

      const response = await supertest().get(`/token/${token.token}/validate`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Token has expired');
    });

    it('should return 302 when token is valid', async () => {
      const token = await TokenModel.create({
        expires_at: parseInt(new Date().getTime().toString()) + 3_000_000,
        created_at: 1_000_000_000,
      }).save();

      const response = await supertest().get(`/token/${token.token}/validate`);

      expect(response.status).toBe(302);
    });
  });
});
