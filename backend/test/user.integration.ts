import { HttpStatus } from '@nestjs/common';
import { UserModel } from '../src/modules/user/entities/user.entity';
import { UserModule } from '../src/modules/user/user.module';
import { setUpIntegrationTests, signJwtToken } from './utils/testUtils';

describe('User Integration', () => {
  const supertest = setUpIntegrationTests(UserModule);

  beforeEach(async () => {
    // Clear user table
    await UserModel.delete({});
    // Reset user id sequence (also known as auto increment)
    await UserModel.query('ALTER SEQUENCE user_model_id_seq RESTART WITH 1');
  });

  describe('GET /', () => {
    it('should return status 401 when no token is provided', () => {
      return supertest().get('/user').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 200 and user object', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const response = await supertest()
        .get('/user')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  describe('GET /:uid', () => {
    it('should return status 401 when no token is provided', () => {
      return supertest().get('/user/1').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 400 when uid is not a number', () => {
      return supertest()
        .get('/user/abc')
        .set('Cookie', [`auth_token=${signJwtToken(1)}`])
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: 'Validation failed (numeric string is expected)',
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
    });

    it('should return status 200 and user object', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const response = await supertest()
        .get(`/user/${user.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(1)}`]);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchSnapshot();
    });

    it("should return status 404 when user id doesn't exist", () => {
      return supertest()
        .get('/user/100')
        .set('Cookie', [`auth_token=${signJwtToken(1)}`])
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          message: 'User not found',
        });
    });
  });
});
