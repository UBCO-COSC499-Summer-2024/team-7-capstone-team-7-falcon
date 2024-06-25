import { UserModel } from '../src/modules/user/entities/user.entity';
import { ExamModule } from '../src/modules/exam/exam.module';
import { setUpIntegrationTests, signJwtToken } from './utils/testUtils';
import { CourseModel } from '../src/modules/course/entities/course.entity';
import { ExamModel } from '../src/modules/exam/entities/exam.entity';
import { CourseUserModel } from '../src/modules/course/entities/course-user.entity';
import { CourseRoleEnum } from '../src/enums/user.enum';

describe('Exam Integration', () => {
  const supertest = setUpIntegrationTests(ExamModule);

  beforeEach(async () => {
    await CourseUserModel.delete({});
    await ExamModel.delete({});
    await CourseModel.delete({});
    await UserModel.delete({});

    await ExamModel.query(`ALTER SEQUENCE exam_model_id_seq RESTART WITH 1`);
    await CourseModel.query(
      `ALTER SEQUENCE course_model_id_seq RESTART WITH 1`,
    );
    await UserModel.query(`ALTER SEQUENCE user_model_id_seq RESTART WITH 1`);
    await CourseUserModel.query(
      'ALTER SEQUENCE course_user_model_id_seq RESTART WITH 1',
    );
  });

  describe('POST /exam/:cid/create', () => {
    it('should return 401 if not authenticated', async () => {
      await supertest().post('/exam/1/create').expect(401);
    });

    it('should return 401 if user not enrolled in course', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await supertest()
        .post(`/exam/${course.id}/create`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 401 if user not professor', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        course,
        user,
        course_role: CourseRoleEnum.STUDENT,
      }).save();

      await supertest()
        .post(`/exam/${course.id}/create`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if exam date is in past', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        course,
        user,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      await supertest()
        .post(`/exam/${course.id}/create`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({
          exam_date: 1_000_000_000,
          exam_name: 'Test Exam',
        })
        .expect(400);
    });

    it('should return 200 if exam is created', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        course,
        user,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      const currentTime: number =
        parseInt(new Date().getTime().toString()) + 2_000;

      await supertest()
        .post(`/exam/${course.id}/create`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({
          exam_date: currentTime,
          exam_name: 'Test Exam',
        })
        .expect(200);
    });

    it('should return 400 if POST body is invalid', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        course,
        user,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      const response = await supertest()
        .post(`/exam/${course.id}/create`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
        message: [
          'exam_name must be longer than or equal to 2 characters',
          'exam_name must be a string',
          'exam_date must be an integer number',
        ],
        statusCode: 400,
      });
    });
  });
});
