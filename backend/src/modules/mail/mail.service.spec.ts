import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import {
  TestConfigModule,
  TestTypeOrmModule,
} from '../../../test/utils/testUtils';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../user/user.service';
import { UserModel } from '../user/entities/user.entity';
import { TokenService } from '../token/token.service';

describe('MailService', () => {
  let mailService: MailService;

  beforeEach(async () => {
    const mockMailerService = {
      sendMail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        TokenService,
        MailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
      imports: [TestTypeOrmModule, TestConfigModule],
    }).compile();

    mailService = module.get<MailService>(MailService);
  });

  describe('sendUserConfirmation', () => {
    it('should send a user confirmation email', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await expect(
        mailService.sendUserConfirmation(user, 'token'),
      ).resolves.not.toThrow();
    });
  });

  describe('sendUserPasswordReset', () => {
    it('should send a user password reset email', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await expect(
        mailService.sendPasswordReset(user, 'token'),
      ).resolves.not.toThrow();
    });
  });
});
