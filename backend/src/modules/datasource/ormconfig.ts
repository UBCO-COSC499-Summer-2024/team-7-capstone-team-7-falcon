import { config } from 'dotenv';
import { EmployeeUserModel } from '../user/entities/employee-user.entity';
import { StudentUserModel } from '../user/entities/student-user.entity';
import { UserModel } from '../user/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { ExamModel } from '../exam/entities/exam.entity';
import { SubmissionModel } from '../exam/entities/submission.entity';
import { CourseModel } from '../course/entities/course.entity';
import { CourseUserModel } from '../course/entities/course-user.entity';
import { SemesterModel } from '../semester/entities/semester.entity';
import { TokenModel } from '../token/entities/token.entity';
import { SubmissionDisputeModel } from '../exam/entities/submission-dispute.entity';

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
    CourseUserModel,
    SemesterModel,
    TokenModel,
    SubmissionDisputeModel,
  ],
  migrations: [path.join(__dirname, '..', '..', '..', 'migrations', '*')],
};

export const dataSource = new DataSource(ormconfig);
