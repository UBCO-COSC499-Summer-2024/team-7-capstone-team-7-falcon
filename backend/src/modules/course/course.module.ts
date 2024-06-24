import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, UserService, TokenService],
  exports: [CourseService],
})
export class CourseModule {}
