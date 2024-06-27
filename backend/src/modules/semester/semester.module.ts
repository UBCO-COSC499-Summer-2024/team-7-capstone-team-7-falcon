import { Module } from '@nestjs/common';
import { SemesterController } from './semester.controller';
import { SemesterService } from './semester.service';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [SemesterController],
  providers: [SemesterService, UserService, TokenService, MailService],
  exports: [SemesterService],
})
export class SemesterModule {}
