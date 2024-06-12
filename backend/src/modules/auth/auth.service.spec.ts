import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  TestConfigModule,
  TestTypeOrmModule,
} from '../../../test/utils/testUtils';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService],
      imports: [TestTypeOrmModule, TestConfigModule],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('signInWithGoogle', () => {
    it('should throw an error when the payload is undefined', async () => {
      const code = 'code';
      const tokens = { id_token: 'id_token' };
      const ticket = { getPayload: jest.fn() };
      const payload = undefined;
      const verifyIdToken = jest.fn().mockResolvedValue(ticket);
      const getToken = jest.fn().mockResolvedValue({ tokens });
      authService.client.verifyIdToken = verifyIdToken;
      authService.client.getToken = getToken;
      ticket.getPayload = jest.fn().mockReturnValue(payload);

      await expect(authService.signInWithGoogle(code)).rejects.toThrow(
        'Error authenticating with Google',
      );
    });

    it('should throw an error when the email is not verified', async () => {
      const code = 'code';
      const tokens = { id: 'id', id_token: 'id_token' };
      const ticket = { getPayload: jest.fn() };
      const payload = { email_verified: false };
      const verifyIdToken = jest.fn().mockResolvedValue(ticket);
      const getToken = jest.fn().mockResolvedValue({ tokens });
      authService.client.verifyIdToken = verifyIdToken;
      authService.client.getToken = getToken;
      ticket.getPayload = jest.fn().mockReturnValue(payload);

      await expect(authService.signInWithGoogle(code)).rejects.toThrow(
        'Email not verified',
      );
    });

    it('should return the access token', async () => {
      const code = 'code';
      const tokens = { id: 'id', id_token: 'id_token' };

      const ticket = { getPayload: jest.fn() };
      const payload = {
        email_verified: true,
        email: 'email',
        given_name: 'first_name',
        family_name: 'family_name',
      };

      const verifyIdToken = jest.fn().mockResolvedValue(ticket);
      const getToken = jest.fn().mockResolvedValue({ tokens });
      authService.client.verifyIdToken = verifyIdToken;
      authService.client.getToken = getToken;
      ticket.getPayload = jest.fn().mockReturnValue(payload);

      jwtService.sign = jest.fn().mockReturnValue('access_token');

      const result = await authService.signInWithGoogle(code);
      expect(result).toHaveProperty('access_token');
    });
  });
});
