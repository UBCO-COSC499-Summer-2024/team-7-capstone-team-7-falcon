import { SeedModule } from '../src/modules/seed/seed.module';
import { setUpIntegrationTests } from './utils/testUtils';
import { SubmissionModel } from '../src/modules/exam/entities/submission.entity';
import { TokenModel } from '../src/modules/token/entities/token.entity';
import { CourseUserModel } from '../src/modules/course/entities/course-user.entity';
import { ExamModel } from '../src/modules/exam/entities/exam.entity';
import { CourseModel } from '../src/modules/course/entities/course.entity';
import { UserModel } from '../src/modules/user/entities/user.entity';
import { StudentUserModel } from '../src/modules/user/entities/student-user.entity';
import { EmployeeUserModel } from '../src/modules/user/entities/employee-user.entity';
import { SemesterModel } from '../src/modules/semester/entities/semester.entity';

describe('Seed Integration', () => {
  const supertest = setUpIntegrationTests(SeedModule);

  beforeEach(async () => {
    await SubmissionModel.delete({});
    await TokenModel.delete({});
    await CourseUserModel.delete({});
    await ExamModel.delete({});
    await CourseModel.delete({});
    await UserModel.delete({});
    await StudentUserModel.delete({});
    await EmployeeUserModel.delete({});
    await SemesterModel.delete({});

    await SemesterModel.query(
      'ALTER SEQUENCE semester_model_id_seq RESTART WITH 1',
    );
    await ExamModel.query(`ALTER SEQUENCE exam_model_id_seq RESTART WITH 1`);
    await CourseModel.query(
      'ALTER SEQUENCE course_model_id_seq RESTART WITH 1',
    );
    await UserModel.query('ALTER SEQUENCE user_model_id_seq RESTART WITH 1');
    await CourseUserModel.query(
      'ALTER SEQUENCE course_user_model_id_seq RESTART WITH 1',
    );
    await TokenModel.query('ALTER SEQUENCE token_model_id_seq RESTART WITH 1');
    await StudentUserModel.query(
      'ALTER SEQUENCE student_user_model_id_seq RESTART WITH 1',
    );
    await EmployeeUserModel.query(
      'ALTER SEQUENCE employee_user_model_id_seq RESTART WITH 1',
    );
    await SubmissionModel.query(
      `ALTER SEQUENCE submission_model_id_seq RESTART WITH 1`,
    );
  });

  describe('GET /seed', () => {
    it('should seed the database and return 200', async () => {
      const response = await supertest().get('/seed').expect(200);

      expect(response.body).toEqual({ message: 'Database seeded' });

      const users = await UserModel.find();
      expect(users).toHaveLength(4);

      const courses = await CourseModel.find();
      expect(courses).toHaveLength(1);

      const semesters = await SemesterModel.find();
      expect(semesters).toHaveLength(1);

      const exams = await ExamModel.find();
      expect(exams).toHaveLength(2);

      const courseUsers = await CourseUserModel.find();
      expect(courseUsers).toHaveLength(3);

      const studentUsers = await StudentUserModel.find();
      expect(studentUsers).toHaveLength(2);

      const employeeUsers = await EmployeeUserModel.find();
      expect(employeeUsers).toHaveLength(2);

      const submissions = await SubmissionModel.find();
      expect(submissions).toHaveLength(2);
    });

    it('should return 404 when application is running in production mode', async () => {
      process.env.NODE_ENV = 'production';

      await supertest().get('/seed').expect(404);

      process.env.NODE_ENV = 'test';
    });
  });

  describe('GET /seed/reset', () => {
    it('should reset the database and return 200', async () => {
      await supertest().get('/seed').expect(200);

      let users = await UserModel.find();
      expect(users).toHaveLength(4);

      let courses = await CourseModel.find();
      expect(courses).toHaveLength(1);

      let semesters = await SemesterModel.find();
      expect(semesters).toHaveLength(1);

      let exams = await ExamModel.find();
      expect(exams).toHaveLength(2);

      let courseUsers = await CourseUserModel.find();
      expect(courseUsers).toHaveLength(3);

      let studentUsers = await StudentUserModel.find();
      expect(studentUsers).toHaveLength(2);

      let employeeUsers = await EmployeeUserModel.find();
      expect(employeeUsers).toHaveLength(2);

      let submissions = await SubmissionModel.find();
      expect(submissions).toHaveLength(2);

      const response = await supertest().get('/seed/reset').expect(200);

      expect(response.body).toEqual({ message: 'Database reset' });

      users = await UserModel.find();
      expect(users).toHaveLength(0);

      courses = await CourseModel.find();
      expect(courses).toHaveLength(0);

      semesters = await SemesterModel.find();
      expect(semesters).toHaveLength(0);

      exams = await ExamModel.find();
      expect(exams).toHaveLength(0);

      courseUsers = await CourseUserModel.find();
      expect(courseUsers).toHaveLength(0);

      studentUsers = await StudentUserModel.find();
      expect(studentUsers).toHaveLength(0);

      employeeUsers = await EmployeeUserModel.find();
      expect(employeeUsers).toHaveLength(0);

      submissions = await SubmissionModel.find();
      expect(submissions).toHaveLength(0);
    });

    it('should return 404 when application is running in production mode', async () => {
      process.env.NODE_ENV = 'production';

      await supertest().get('/seed/reset').expect(404);

      process.env.NODE_ENV = 'test';
    });
  });
});
