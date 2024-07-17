import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CourseService } from '../course/course.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TasksService, CourseService],
})
export class TasksModule {}
