import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { UserService } from '../user/user.service';
import { CourseService } from '../course/course.service';
import { TokenService } from '../token/token.service';

@Module({
  controllers: [ExamController],
  providers: [ExamService, CourseService, UserService, TokenService],
  exports: [ExamService],
})
export class ExamModule {}
