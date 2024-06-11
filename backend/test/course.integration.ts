/* eslint-disable prettier/prettier */
import { CourseModel } from '../src/modules/course/entities/course.entity';
import { CourseModule } from '../src/modules/course/course.module';
import { CourseUserModel } from '../src/modules/course/entities/course-user.entity';
import { setUpIntegrationTests, signJwtToken } from './utils/testUtils';
import { UserModel } from '../src/modules/user/entities/user.entity';
import { SemesterModel } from '../src/modules/semesters/entities/semester.entity';

describe('Course Integration', () => {
  const supertest = setUpIntegrationTests(CourseModule);

  beforeEach(async () => {
    // Delete dependent rows first
    await CourseUserModel.delete({});
    await CourseModel.delete({});
    await UserModel.delete({});
    await SemesterModel.delete({});

    await CourseModel.query('ALTER SEQUENCE course_model_id_seq RESTART WITH 1');
    await UserModel.query('ALTER SEQUENCE user_model_id_seq RESTART WITH 1');
    await SemesterModel.query('ALTER SEQUENCE semester_model_id_seq RESTART WITH 1');
    await CourseUserModel.query('ALTER SEQUENCE course_user_model_id_seq RESTART WITH 1');
  });

  describe('GET /course/:cid', () => {
    it('should return 401 if not authenticated', async () => {
      await supertest().get('/course/1').expect(401);
    });

    it('should return 404 if course is not found', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await supertest()
        .get('/course/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(404);
    });

    it('should return course if course is found', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      const result = await supertest()
        .get(`/course/${course.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])

      expect(result.body).toMatchSnapshot();

      expect(result.status).toBe(200);
    });
  });

  describe('POST /course/:cid/enroll', () => {
    it('should return 401 if not authenticated', async () => {
      await supertest().post('/course/1/enroll').expect(401);
    });

    it('should return 400 if course id is not a number', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const result = await supertest()
        .post('/course/abc/enroll')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe(
        'Validation failed (numeric string is expected)',
      );
    });

    it('should return 400 if invite code is not provided', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      return await supertest()
        .post('/course/1/enroll')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400)
        .expect({
          message: ['Invite code is required', 'invite_code must be a string'],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should return 404 if course is not found', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      return await supertest()
        .post('/course/1/enroll')
        .send({ invite_code: '123' })
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(404)
        .expect({
          message: 'Course not found',
        });
    });

    it('should return 400 if invite code is invalid', async () => {
      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      return await supertest()
        .post(`/course/${course.id}/enroll`)
        .send({ invite_code: '456' })
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400)
        .expect({
          message: 'Invalid invite code',
        });
    });

    it('should return 200 if user is already enrolled', async () => {
      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      return await supertest()
        .post(`/course/${course.id}/enroll`)
        .send({ invite_code: '123' })
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(200)
        .expect({
          message: 'ok',
        });
    });

    it('should return 200 if user is not already enrolled', async () => {
      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await supertest()
        .post(`/course/${course.id}/enroll`)
        .send({ invite_code: '123' })
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(200)
        .expect({
          message: 'ok',
        });

      const courseUser = await CourseUserModel.findOne({
        where: {
          user,
          course,
        },
        relations: ['user', 'course'],
      });

      expect(courseUser).toBeDefined();
      expect(courseUser).toMatchSnapshot();
    });
  });
});
