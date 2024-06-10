import { config } from 'dotenv';
import { EmployeeUserModel } from '../user/entities/employee-user.entity';
import { StudentUserModel } from '../user/entities/student-user.entity';
import { UserModel } from '../user/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { ExamModel } from '../exams/entities/exam.entity';
import { SubmissionModel } from '../exams/entities/submission.entity';
import { CourseModel } from '../course/course.entity';
import { CourseUser } from '../course/course_user.entity';

config();

const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [
    UserModel,
    EmployeeUserModel,
    StudentUserModel,
    ExamModel,
    SubmissionModel,
    CourseModel,
    CourseUser,
  ],
  migrations: [path.join(__dirname, '..', '..', '..', 'migrations', '*')],
};

export const dataSource = new DataSource(ormconfig);
