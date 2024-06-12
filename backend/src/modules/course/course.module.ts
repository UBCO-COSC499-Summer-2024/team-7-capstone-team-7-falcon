import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, UserService],
  exports: [CourseService],
})
export class CourseModule {}
