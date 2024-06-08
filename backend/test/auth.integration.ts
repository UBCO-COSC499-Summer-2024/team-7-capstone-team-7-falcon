import { TestingModuleBuilder } from '@nestjs/testing';
import { AuthModule } from '../src/modules/auth/auth.module';
import { setUpIntegrationTests } from './utils/testUtils';
import { AuthService } from '../src/modules/auth/auth.service';
import {
  OAuthGoogleErrorException,
  UserAlreadyExistsException,
} from '../src/common/errors';

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

  describe('GET oauth/:provider', () => {
    it('should return status 400 when provider is not supported', () => {
      return supertest().get('/auth/oauth/unknown').expect(400);
    });

    it('should redirect to google oauth url', async () => {
      const response = await supertest().get('/auth/oauth/google');

      expect(response.status).toBe(302);
      expect(response.header.location).toContain('accounts.google.com');
    });
  });

  describe('GET oauth/:provider/callback', () => {
    it('should return status 400 when provider is not supported', () => {
      return supertest().get('/auth/oauth/unknown/callback').expect(400);
    });

    it('should return status 400 when code is not provided', () => {
      return supertest().get('/auth/oauth/google/callback').expect(400);
    });

    it('should return status 302 and redirect to frontend url', async () => {
      const response = await supertest()
        .get('/auth/oauth/google/callback')
        .query({ code: 'code' });

      expect(response.status).toBe(302);
      expect(response.header.location).toContain('localhost');
    });

    it('should return status 401 when google oauth fails', () => {
      return supertest()
        .get('/auth/oauth/google/callback')
        .query({ code: 'oauth_error' })
        .expect(401);
    });

    it('should return status 409 when user already exists', () => {
      return supertest()
        .get('/auth/oauth/google/callback')
        .query({ code: 'user_exists' })
        .expect(409);
    });

    it('should return status 500 when an error occurs', () => {
      return supertest()
        .get('/auth/oauth/google/callback')
        .query({ code: 'error' })
        .expect(500);
    });
  });
});
