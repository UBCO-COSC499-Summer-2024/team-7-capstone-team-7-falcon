import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from './modules/datasource/typeorm.module';
import { AuthModule } from './modules/auth/auth.module';
import { CourseModule } from './modules/course/course.module';
import { SemesterModule } from './modules/semester/semester.module';
import QueueModule from './modules/queue/queue.module';
import { ExamModule } from './modules/exam/exam.module';
import { TokenModule } from './modules/token/token.module';
import { MailModule } from './modules/mail/mail.module';
import { FileModule } from './modules/file/file.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule,
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    CourseModule,
    SemesterModule,
    QueueModule,
    ExamModule,
    TokenModule,
    MailModule,
    FileModule,
    TasksModule,
  ],
})
export class AppModule {}
