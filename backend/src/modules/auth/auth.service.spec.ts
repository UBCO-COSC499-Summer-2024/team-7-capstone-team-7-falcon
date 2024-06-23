import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  TestConfigModule,
  TestTypeOrmModule,
} from '../../../test/utils/testUtils';
import { TokenService } from '../token/token.service';
import { UserModel } from '../user/entities/user.entity';
import { AuthTypeEnum } from '../../enums/user.enum';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService, TokenService],
      imports: [TestTypeOrmModule, TestConfigModule],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  afterEach(async () => {
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

  describe('signInWithCredentials', () => {
    it('should throw an error when the user is not found', async () => {
      await expect(
        authService.signInWithCredentials('email', 'password'),
      ).rejects.toThrow('User not found');
    });

    it('should throw an error when account auth type is not email', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        auth_type: AuthTypeEnum.GOOGLE_OAUTH,
      }).save();

      await expect(
        authService.signInWithCredentials(user.email, 'password'),
      ).rejects.toThrow('Invalid auth method');
    });

    it('should throw an error when email is not verified', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await expect(
        authService.signInWithCredentials(user.email, 'password'),
      ).rejects.toThrow('Email not verified');
    });

    it('should throw an error when the password is incorrect', async () => {
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: hashedPassword,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await expect(
        authService.signInWithCredentials(user.email, 'incorrect_password'),
      ).rejects.toThrow('Invalid password');
    });

    it('should return the access token', async () => {
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: hashedPassword,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      jwtService.sign = jest.fn().mockReturnValue('access_token');

      const result = await authService.signInWithCredentials(
        user.email,
        password,
      );

      expect(result).toHaveProperty('access_token');
    });
  });
});
