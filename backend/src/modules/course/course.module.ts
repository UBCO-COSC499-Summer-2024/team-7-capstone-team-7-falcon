import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import { ExamService } from '../exam/exam.service';

@Module({
  controllers: [CourseController],
  providers: [
    CourseService,
    UserService,
    TokenService,
    MailService,
    ExamService,
  ],
  exports: [CourseService],
})
export class CourseModule {}
