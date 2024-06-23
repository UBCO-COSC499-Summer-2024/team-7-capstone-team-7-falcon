import { TestingModuleBuilder } from '@nestjs/testing';
import { AuthModule } from '../src/modules/auth/auth.module';
import { setUpIntegrationTests, signJwtToken } from './utils/testUtils';
import { AuthService } from '../src/modules/auth/auth.service';
import {
  OAuthGoogleErrorException,
  UserAlreadyExistsException,
} from '../src/common/errors';
import { HttpStatus } from '@nestjs/common';
import { UserModel } from '../src/modules/user/entities/user.entity';
import { faker } from '@faker-js/faker';
import { TokenModel } from '../src/modules/token/entities/token.entity';
import { StudentUserModel } from '../src/modules/user/entities/student-user.entity';
import { EmployeeUserModel } from '../src/modules/user/entities/employee-user.entity';

const mockAuthService = {
  // We need to mock the signInWithGoogle method to avoid calling the Google API
  signInWithGoogle: async (code: string) => {
    switch (code) {
      case 'code':
        return { access_token: 'access' };
      case 'oauth_error':
        throw new OAuthGoogleErrorException();
      case 'user_exists':
        throw new UserAlreadyExistsException();
      default:
        throw new Error();
    }
  },
};

describe('Auth Integration', () => {
  const supertest = setUpIntegrationTests(
    AuthModule,
    (t: TestingModuleBuilder) =>
      t.overrideProvider(AuthService).useValue(mockAuthService),
  );

  beforeEach(async () => {
    await TokenModel.delete({});
    await UserModel.delete({});
    await StudentUserModel.delete({});
    await EmployeeUserModel.delete({});

    await UserModel.query('ALTER SEQUENCE user_model_id_seq RESTART WITH 1');
    await StudentUserModel.query(
      'ALTER SEQUENCE student_user_model_id_seq RESTART WITH 1',
    );
    await EmployeeUserModel.query(
      'ALTER SEQUENCE employee_user_model_id_seq RESTART WITH 1',
    );
    await TokenModel.query('ALTER SEQUENCE token_model_id_seq RESTART WITH 1');
  });

  describe('POST register', () => {
    it('should return status 400 when body is invalid', () => {
      return supertest().post('/auth/register').expect(HttpStatus.BAD_REQUEST);
    });

    it('should return status 400 when password and confirm password do not match', async () => {
      const request = await supertest().post('/auth/register').send({
        first_name: 'John',
        last_name: 'Doe',
        email: faker.internet.email(),
        password: 'p@ssw0rD',
        confirm_password: 'password1',
      });

      expect(request.status).toBe(HttpStatus.BAD_REQUEST);
      expect(request.body).toStrictEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Password and confirmation password do not match'],
        error: 'Bad Request',
      });
    });

    it('should return status 201 when body is valid', async () => {
      const password = 'p@ssw0rD';
      const request = await supertest().post('/auth/register').send({
        first_name: 'John',
        last_name: 'Doe',
        email: faker.internet.email(),
        password: password,
        confirm_password: password,
        student_id: 1,
      });

      expect(request.status).toBe(HttpStatus.CREATED);
    });

    it('should return status 409 when user already exists', async () => {
      const password = 'p@ssw0rD';
      const email = faker.internet.email();

      await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: email,
        password: password,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const request = await supertest().post('/auth/register').send({
        first_name: 'John',
        last_name: 'Doe',
        email: email,
        password: password,
        confirm_password: password,
        student_id: 1,
      });

      expect(request.status).toBe(HttpStatus.CONFLICT);
    });

    it('should return status 400 when student id already exists', async () => {
      const password = 'p@ssw0rD';
      const email = faker.internet.email();

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: email,
        password: password,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await StudentUserModel.create({
        student_id: 1,
        user: user,
      }).save();

      const request = await supertest().post('/auth/register').send({
        first_name: 'John',
        last_name: 'Doe',
        email: faker.internet.email(),
        password: password,
        confirm_password: password,
        student_id: 1,
      });

      expect(request.status).toBe(HttpStatus.BAD_REQUEST);
      expect(request.body).toStrictEqual({
        error: 'Student ID already exists',
      });
    });

    it('should return status 400 when employee id already exists', async () => {
      const password = 'p@ssw0rD';
      const email = faker.internet.email();

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: email,
        password: password,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 1,
        user: user,
      }).save();

      const request = await supertest().post('/auth/register').send({
        first_name: 'John',
        last_name: 'Doe',
        email: faker.internet.email(),
        password: password,
        confirm_password: password,
        employee_id: 1,
      });

      expect(request.status).toBe(HttpStatus.BAD_REQUEST);
      expect(request.body).toStrictEqual({
        error: 'Employee ID already exists',
      });
    });
  });

  describe('GET oauth/:provider', () => {
    it('should return status 400 when provider is not supported', () => {
      return supertest()
        .get('/auth/oauth/unknown')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should redirect to google oauth url', async () => {
      const response = await supertest().get('/auth/oauth/google');

      expect(response.status).toBe(302);
      expect(response.header.location).toContain('accounts.google.com');
    });
  });

  describe('GET oauth/:provider/callback', () => {
    it('should return status 400 when provider is not supported', () => {
      return supertest()
        .get('/auth/oauth/unknown/callback')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return status 400 when code is not provided', () => {
      return supertest()
        .get('/auth/oauth/google/callback')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return status 302 and redirect to frontend url', async () => {
      const response = await supertest()
        .get('/auth/oauth/google/callback')
        .query({ code: 'code' });

      expect(response.status).toBe(302);
      expect(response.get('Set-Cookie')[0]).toContain('auth_token=access');
      expect(response.header.location).toContain('localhost');
    });

    it('should return status 401 when google oauth fails', () => {
      return supertest()
        .get('/auth/oauth/google/callback')
        .query({ code: 'oauth_error' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 409 when user already exists', () => {
      return supertest()
        .get('/auth/oauth/google/callback')
        .query({ code: 'user_exists' })
        .expect(HttpStatus.CONFLICT);
    });

    it('should return status 500 when an error occurs', () => {
      return supertest()
        .get('/auth/oauth/google/callback')
        .query({ code: 'error' })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('GET logout', () => {
    it('should return status 401 when no token is provided', () => {
      return supertest().get('/auth/logout').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 403 when user email is not verified', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      return supertest()
        .get('/auth/logout')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should return status 204 when token is provided', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      return supertest()
        .get('/auth/logout')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.FOUND)
        .expect('Location', `${process.env.FRONTEND_URL}/login`);
    });
  });
});
