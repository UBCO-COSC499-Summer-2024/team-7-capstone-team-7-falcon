/* eslint-disable prettier/prettier */
import { CourseModel } from '../src/modules/course/entities/course.entity';
import { CourseModule } from '../src/modules/course/course.module';
import { CourseUserModel } from '../src/modules/course/entities/course-user.entity';
import { setUpIntegrationTests, signJwtToken } from './utils/testUtils';
import { UserModel } from '../src/modules/user/entities/user.entity';
import { SemesterModel } from '../src/modules/semester/entities/semester.entity';
import { CourseRoleEnum, UserRoleEnum } from '../src/enums/user.enum';
import { ExamModel } from '../src/modules/exam/entities/exam.entity';

describe('Course Integration', () => {
  const supertest = setUpIntegrationTests(CourseModule);

  beforeEach(async () => {
    // Delete dependent rows first
    await ExamModel.delete({});
    await CourseUserModel.delete({});
    await CourseModel.delete({});
    await UserModel.delete({});
    await SemesterModel.delete({});

    await CourseModel.query(
      'ALTER SEQUENCE course_model_id_seq RESTART WITH 1',
    );
    await UserModel.query('ALTER SEQUENCE user_model_id_seq RESTART WITH 1');
    await SemesterModel.query(
      'ALTER SEQUENCE semester_model_id_seq RESTART WITH 1',
    );
    await CourseUserModel.query(
      'ALTER SEQUENCE course_user_model_id_seq RESTART WITH 1',
    );
    await ExamModel.query('ALTER SEQUENCE exam_model_id_seq RESTART WITH 1');
  });

  describe('GET /course/:cid', () => {
    it('should return 401 if not authenticated', async () => {
      await supertest().get('/course/1').expect(401);
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
        .get(`/course/${course.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return course if course is found', async () => {
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
        user,
        course,
      }).save();

      const result = await supertest()
        .get(`/course/${course.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.body).toMatchSnapshot();

      expect(result.status).toBe(200);
    });
  });

  describe('GET /course/:cid/public', () => {
    it('should return 401 if not authenticated', async () => {
      await supertest().get('/course/1/public').expect(401);
    });

    it('should return course if course is found', async () => {
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
        user,
        course,
      }).save();

      const result = await supertest()
        .get(`/course/${course.id}/public`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.body).toMatchSnapshot();

      expect(result.status).toBe(200);
    });

    it('should return 404 if course is not found', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const result = await supertest()
        .get('/course/1/public')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(404);
    });

    it('should return 400 if course id is not a number', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await supertest()
        .get('/course/abc/public')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400);
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
        email_verified: true,
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
        email_verified: true,
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
        email_verified: true,
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
        email_verified: true,
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
        email_verified: true,
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
        email_verified: true,
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

  describe('POST /course/create', () => {
    it('should return 401 if not authenticated', async () => {
      await supertest().post('/course/create').expect(401);
    });

    it('should return 401 if user is not professor', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      return supertest()
        .post('/course/create')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if course code is not provided', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
        role: UserRoleEnum.PROFESSOR,
      }).save();

      return supertest()
        .post('/course/create')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400)
        .expect({
          message: [
            'course_code must be longer than or equal to 2 characters',
            'course_code must be a string',
            'course_name must be a string',
            'section_name must be a string',
            'semester_id must be a number conforming to the specified constraints',
          ],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should return 400 if semester is not found', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
        role: UserRoleEnum.PROFESSOR,
      }).save();

      await supertest()
        .post('/course/create')
        .send({
          course_code: 'COSC 499',
          course_name: 'Capstone Project',
          section_name: '001',
          semester_id: 1,
        })
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400)
        .expect({
          message: 'Semester not found',
        });
    });

    it('should return 200 if course is created', async () => {
      const semester = await SemesterModel.create({
        name: 'Semester 1',
        starts_at: 1_000_000_000,
        ends_at: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      await supertest()
        .post('/course/create')
        .send({
          course_code: 'COSC 499',
          course_name: 'Capstone Project',
          section_name: '001',
          semester_id: semester.id,
        })
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(200)
        .expect({
          message: 'ok',
        });

      const course = await CourseModel.findOne({
        where: {
          course_code: 'COSC 499',
        },
        relations: ['semester'],
      });

      expect(course).toBeDefined();

      delete course.created_at;
      delete course.updated_at;
      delete course.invite_code;
      expect(course).toMatchSnapshot();
    });
  });

  describe('DELETE /course/:cid/member/:uid', () => {
    it('should return 401 if not authenticated', async () => {
      await supertest().delete('/course/1/member/1').expect(401);
    });

    it('should return 401 if user is not professor', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      return supertest()
        .delete('/course/1/member/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if course id is not a number', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      return supertest()
        .delete('/course/abc/member/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400)
        .expect({
          message: 'Bad Request',
          statusCode: 400
        });
    });

    it('should return 400 if user id is not a number', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
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
        user,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      return supertest()
        .delete('/course/1/member/abc')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400)
        .expect({
          message: 'Validation failed (numeric string is expected)',
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('it should return 404 if student is not found in course', async () => {
      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      const student = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe1@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
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
        user: professor,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      return supertest()
        .delete(`/course/${course.id}/member/${student.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`])
        .expect(404)
        .expect({
          message: 'User is not enrolled in the course',
        });
    });

    it('should return 404 if student is enrolled in a different course but professor is not', async () => {
      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      const student = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe1@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
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

      const courseTwo = await CourseModel.create({
        course_code: 'COSC 498',
        course_name: 'Software Engineering',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        user: student,
        course: courseTwo,
        course_role: CourseRoleEnum.STUDENT,
      }).save();

      await CourseUserModel.create({
        user: professor,
        course: course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      return supertest()
        .delete(`/course/${course.id}/member/${student.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`])
        .expect(404)
        .expect({
          message: 'User is not enrolled in the course',
        });
    });

    it('should return 401 if professor is not enrolled in the same course as student', async () => {
      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      const student = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe1@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
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

      const courseTwo = await CourseModel.create({
        course_code: 'COSC 498',
        course_name: 'Software Engineering',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        user: student,
        course: course,
        course_role: CourseRoleEnum.STUDENT,
      }).save();

      await CourseUserModel.create({
        user: professor,
        course: courseTwo,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      return supertest()
        .delete(`/course/${course.id}/member/${student.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`])
        .expect(401);
    });

    it('should return 200 if student is removed from course', async () => {
      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      const student = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe1@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
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
        user: student,
        course,
      }).save();

      await CourseUserModel.create({
        user: professor,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      await supertest()
        .delete(`/course/${course.id}/member/${student.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`])
        .expect(200)
        .expect({
          message: 'ok',
        });

      const courseRoaster = await CourseUserModel.count();

      expect(courseRoaster).toBe(1);
    });
  });

  describe('GET /course/:cid/members', () => {
    it('should return 401 if not authenticated', async () => {
      await supertest().get('/course/1/members').expect(401);
    });

    it('should return 401 if user is not professor', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      return supertest()
        .get('/course/1/members')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 200 if user is professor with default query parameters', async () => {
      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '1',
      }).save();

      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'professor@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await CourseUserModel.create({
        user: professor,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      for (let i = 0; i < 10; i++) {
        const user = await UserModel.create({
          first_name: 'John',
          last_name: `Doe-${Math.abs(i - 1)}`,
          email: `john.doe-${i}@test.com`,
          password: 'password',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          email_verified: true,
        }).save();

        await CourseUserModel.create({
          user: user,
          course,
        }).save();
      }

      const result = await supertest()
        .get(`/course/${course.id}/members`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`]);

      expect(result.body).toMatchSnapshot();
    });

    it('should throw 400 if page is not a number', async () => {
      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '1',
      }).save();

      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'professor@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await CourseUserModel.create({
        user: professor,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      await supertest()
        .get(`/course/${course.id}/members?page=abc`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`])
        .expect(400)
    });

    it('should return 200 if user is professor with 2 members', async () => {
      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '1',
      }).save();

      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'professor@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await CourseUserModel.create({
        user: professor,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      for (let i = 0; i < 9; i++) {
        const user = await UserModel.create({
          first_name: 'John',
          last_name: `Doe-${Math.abs(i - 1)}`,
          email: `john.doe-${i}@test.com`,
          password: 'password',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          email_verified: true,
        }).save();

        await CourseUserModel.create({
          user: user,
          course,
        }).save();
      }

      const result = await supertest()
        .get(`/course/${course.id}/members?take=2&page=1`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`]);

      expect(result.body).toMatchSnapshot();
    });
  });

  describe('GET /course/:cid/exams', () => {
    it('should return 401 if not authenticated', async () => {
      await supertest().get('/course/1/exams').expect(401);
    });

    it('should return 401 if user is not enrolled in course', async () => {
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
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '123',
      }).save();

      return await supertest()
        .get(`/course/${course.id}/exams`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401)
        .expect({
          message: 'Unauthorized',
          statusCode: 401,
        });
    });

    it('should return 401 if course is archived', async () => {
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
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '123',
        is_archived: true,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      return await supertest()
        .get(`/course/${course.id}/exams`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401)
        .expect({
          message: 'Unauthorized',
          statusCode: 401,
        });
    });

    it('should return 200 if user is enrolled with default query parameters', async () => {
      let course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '1',
      }).save();

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      course = await CourseModel.findOne({
        where: {
          id: course.id,
        },
        relations: ['exams'],
      });

      for (let i = 0; i < 10; i++) {
        const exam = await ExamModel.create({
          name: `Exam ${i}`,
          exam_date: 1_000_000_000 + i,
          course,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
        }).save();

        course.exams.push(exam);
      }

      await course.save();

      const result = await supertest()
        .get(`/course/${course.id}/exams`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.body).toMatchSnapshot();
    });

    it('should throw 400 if page is not a number', async () => {
      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '1',
      }).save();

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      await supertest()
        .get(`/course/${course.id}/exams?page=abc`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400)
    });

    it('should return 200 when only two exams are requested', async () => {
      let course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '1',
      }).save();

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      course = await CourseModel.findOne({
        where: {
          id: course.id,
        },
        relations: ['exams'],
      });

      for (let i = 0; i < 10; i++) {
        const exam = await ExamModel.create({
          name: `Exam ${i}`,
          exam_date: 1_000_000_000 + i,
          course,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
        }).save();

        course.exams.push(exam);
      }

      await course.save();

      const result = await supertest()
        .get(`/course/${course.id}/exams?take=2&page=1`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.body).toMatchSnapshot();
    });
  });

  describe('GET /course/:cid/exams/upcoming', () => {
    it('should return 401 if not authenticated', async () => {
      await supertest().get('/course/1/exams/upcoming').expect(401);
    });

    it('should return 401 if user is not enrolled in course', async () => {
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
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '123',
      }).save();

      return await supertest()
        .get(`/course/${course.id}/exams`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401)
        .expect({
          message: 'Unauthorized',
          statusCode: 401,
        });
    });

    it('should return 401 if course is archived', async () => {
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
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '123',
        is_archived: true,
      }).save();

      return await supertest()
        .get(`/course/${course.id}/exams`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401)
        .expect({
          message: 'Unauthorized',
          statusCode: 401,
        });
    });

    it('should return 204 if no exams are upcoming', async () => {
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
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      const result = await supertest()
        .get(`/course/${course.id}/exams/upcoming`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(204);
    });

    it('should return 200 and upcoming exams', async () => {
      let course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '1',
      }).save();

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      course = await CourseModel.findOne({
        where: {
          id: course.id,
        },
        relations: ['exams'],
      });

      for (let i = 0; i < 10; i++) {
        const exam = await ExamModel.create({
          name: `Exam ${i}`,
          exam_date: parseInt(new Date().getTime().toString()) + 1_000,
          course,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
        }).save();

        course.exams.push(exam);
      }

      await course.save();

      const result = await supertest()
        .get(`/course/${course.id}/exams/upcoming`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      result.body.forEach((exam: ExamModel) => {
        delete exam.exam_date;
      });

      expect(result.body).toMatchSnapshot();
    });
  });

  describe('GET /course/:cid/exams/graded', () => {
    it('should return 401 if not authenticated', async () => {
      await supertest().get('/course/1/exams/graded').expect(401);
    });

    it('should return 401 if user is not enrolled in course', async () => {
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
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '123',
      }).save();

      return await supertest()
        .get(`/course/${course.id}/exams/graded`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401)
        .expect({
          message: 'Unauthorized',
          statusCode: 401,
        });
    });

    it('should return 401 if course is archived', async () => {
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
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '123',
        is_archived: true,
      }).save();

      return await supertest()
        .get(`/course/${course.id}/exams/graded`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401)
        .expect({
          message: 'Unauthorized',
          statusCode: 401,
        });
    });

    it('should return 204 if no exams are graded', async () => {
      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '1',
      }).save();

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      const result = await supertest()
        .get(`/course/${course.id}/exams/graded`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(204);
    });

    it('should return 200 and graded exams', async () => {
      let course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '1',
      }).save();

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      course = await CourseModel.findOne({
        where: {
          id: course.id,
        },
        relations: ['exams'],
      });

      for (let i = 0; i < 10; i++) {
        const exam = await ExamModel.create({
          name: `Exam ${i}`,
          exam_date: 1_000_000_000,
          course,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
          grades_released_at: parseInt(new Date().getTime().toString()),
        }).save();

        course.exams.push(exam);
      }

      await course.save();

      const result = await supertest()
        .get(`/course/${course.id}/exams/graded`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      result.body.forEach((exam: ExamModel) => {
        delete exam.grades_released_at;
      });
      expect(result.status).toBe(200);
      expect(result.body).toMatchSnapshot();
    });
  });
});
