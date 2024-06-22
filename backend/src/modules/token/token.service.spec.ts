import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import {
  TestConfigModule,
  TestTypeOrmModule,
} from '../../../test/utils/testUtils';
import { TokenTypeEnum } from '../../enums/token-type.enum';

describe('TokenService', () => {
  let tokenService: TokenService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [TokenService],
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
});
