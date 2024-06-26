import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import {
  TestConfigModule,
  TestTypeOrmModule,
} from '../../../test/utils/testUtils';
import { TokenTypeEnum } from '../../enums/token-type.enum';
import { UserService } from '../user/user.service';
import { faker } from '@faker-js/faker';
import { UserModel } from '../user/entities/user.entity';
import { TokenModel } from './entities/token.entity';

describe('TokenService', () => {
  let tokenService: TokenService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [TokenService, UserService],
      imports: [TestTypeOrmModule, TestConfigModule],
    }).compile();

    tokenService = moduleRef.get<TokenService>(TokenService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('createToken', () => {
    it('should create a token with the provided type and expiration time', async () => {
      const token = await tokenService.createToken(
        TokenTypeEnum.EMAIL_VERIFICATION,
        1000 * 60 * 60 * 3,
      );
      expect(token).toBeDefined();
      expect(token.type).toBe('EMAIL_VERIFICATION');
      expect(token.expires_at).toBeGreaterThan(token.created_at);
    });
  });

  describe('update', () => {
    it('should update token and verify user email', async () => {
      const token = await tokenService.createToken(
        TokenTypeEnum.EMAIL_VERIFICATION,
      );

      await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        tokens: [token],
      }).save();

      await tokenService.update(token.token);

      const user = await UserModel.findOne({
        where: { email: 'john.doe@test.com' },
      });

      expect(user.email_verified).toBe(true);

      const updatedToken = await TokenModel.findOne({
        where: { token: token.token },
      });

      expect(updatedToken.expires_at).toBe('-1');
    });

    it('should accept tokenResponse if token is null', async () => {
      const token = await tokenService.createToken(
        TokenTypeEnum.EMAIL_VERIFICATION,
      );

      await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        tokens: [token],
      }).save();

      const tokenResponse = await tokenService.findTokenAndUser(token.token);

      await tokenService.update(null, tokenResponse);

      const updatedToken = await TokenModel.findOne({
        where: { token: token.token },
      });

      expect(updatedToken.expires_at).toBe('-1');
    });

    it('should expire token when updating password reset token', async () => {
      const token = await tokenService.createToken(
        TokenTypeEnum.PASSWORD_RESET,
      );

      await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        tokens: [token],
      }).save();

      await tokenService.update(token.token);

      const updatedToken = await TokenModel.findOne({
        where: { token: token.token },
      });

      expect(updatedToken.expires_at).toBe('-1');
    });
  });

  describe('findTokenAndUser', () => {
    it('should throw an error if token is not UUID', async () => {
      await expect(
        tokenService.findTokenAndUser('invalid_token'),
      ).rejects.toThrow('Invalid token');
    });

    it('should throw an error if token is not found', async () => {
      await expect(
        tokenService.findTokenAndUser(faker.string.uuid()),
      ).rejects.toThrow('Invalid token');
    });

    it('should throw an error if token is expired', async () => {
      const token = await tokenService.createToken(
        TokenTypeEnum.EMAIL_VERIFICATION,
        -1,
      );
      await expect(tokenService.findTokenAndUser(token.token)).rejects.toThrow(
        'Token has expired',
      );
    });

    it('should return token and user', async () => {
      const token = await tokenService.createToken(
        TokenTypeEnum.EMAIL_VERIFICATION,
      );
      const tokenModel = await tokenService.findTokenAndUser(token.token);
      expect(tokenModel.token).toBe(token.token);
    });
  });
});
