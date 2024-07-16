import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { UserService } from '../user/user.service';
import { CourseService } from '../course/course.service';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import { SubmissionsProcessingService } from '../queue/jobs/submissions-processing.service';
import { BullModule } from '@nestjs/bull';

@Module({
  controllers: [ExamController],
  providers: [
    ExamService,
    CourseService,
    UserService,
    TokenService,
    MailService,
    SubmissionsProcessingService,
  ],
  imports: [
    BullModule.registerQueue({
      name: 'omr-submissions-processing',
    }),
  ],
  exports: [ExamService],
})
export class ExamModule {}
