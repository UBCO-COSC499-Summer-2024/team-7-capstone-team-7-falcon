/* eslint-disable prettier/prettier */
import { CourseModel } from '../src/modules/course/entities/course.entity';
import { CourseModule } from '../src/modules/course/course.module';
import { CourseUserModel } from '../src/modules/course/entities/course-user.entity';
import { setUpIntegrationTests, signJwtToken } from './utils/testUtils';
import { UserModel } from '../src/modules/user/entities/user.entity';
import { SemesterModel } from '../src/modules/semester/entities/semester.entity';
import { CourseRoleEnum, UserRoleEnum } from '../src/enums/user.enum';
import { ExamModel } from '../src/modules/exam/entities/exam.entity';
import { StudentUserModel } from '../src/modules/user/entities/student-user.entity';
import { EmployeeUserModel } from '../src/modules/user/entities/employee-user.entity';
import { SubmissionModel } from '../src/modules/exam/entities/submission.entity';

describe('Course Integration', () => {
  const supertest = setUpIntegrationTests(CourseModule);

  beforeEach(async () => {
    // Delete dependent rows first
    await ExamModel.delete({});
    await CourseUserModel.delete({});
    await CourseModel.delete({});
    await UserModel.delete({});
    await SemesterModel.delete({});
    await StudentUserModel.delete({});
    await EmployeeUserModel.delete({});
    await SubmissionModel.delete({});

    await SubmissionModel.query(
      'ALTER SEQUENCE submission_model_id_seq RESTART WITH 1',
    );
    await StudentUserModel.query(
      'ALTER SEQUENCE student_user_model_id_seq RESTART WITH 1',
    );
    await EmployeeUserModel.query(
      'ALTER SEQUENCE employee_user_model_id_seq RESTART WITH 1',
    );
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
    await StudentUserModel.query(
      'ALTER SEQUENCE student_user_model_id_seq RESTART WITH 1',
    );
    await EmployeeUserModel.query(
      'ALTER SEQUENCE employee_user_model_id_seq RESTART WITH 1',
    );
  });

  describe('GET /course/:cid', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().get('/course/1').expect(401);
    });

    it('should return 401 if user not enrolled in course', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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
    it('should return 401 if user not authenticated', async () => {
      await supertest().get('/course/1/public').expect(401);
    });

    it('should return course if course is found', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      const result = await supertest()
        .get('/course/1/public')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(404);
    });

    it('should return 400 if course id is not a number', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      await supertest()
        .get('/course/abc/public')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400);
    });
  });

  describe('POST /course/:cid/enroll', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().post('/course/1/enroll').expect(401);
    });

    it('should return 400 if course id is not a number', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      const result = await supertest()
        .post('/course/abc/enroll')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe(
        'Validation failed (numeric string is expected)',
      );
    });

    it('should return 400 if invite code is not provided', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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
    it('should return 401 if user not authenticated', async () => {
      await supertest().post('/course/create').expect(401);
    });

    it('should return 401 if user is not professor', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      return supertest()
        .post('/course/create')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if course code is not provided', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
        role: UserRoleEnum.PROFESSOR,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

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
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
        role: UserRoleEnum.PROFESSOR,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

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

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

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
    it('should return 401 if user not authenticated', async () => {
      await supertest().delete('/course/1/member/1').expect(401);
    });

    it('should return 401 if user is not professor', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      return supertest()
        .delete('/course/1/member/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if course id is not a number', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      return supertest()
        .delete('/course/abc/member/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400)
        .expect({
          message: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should return 400 if user id is not a number', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

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
      let professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: professor,
        employee_id: 1,
      }).save();

      professor = await UserModel.findOne({
        where: { id: professor.id },
        relations: ['employee_user'],
      });

      professor.employee_user = employeeUser;
      await professor.save();

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
      let professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: professor,
        employee_id: 1,
      }).save();

      professor = await UserModel.findOne({
        where: { id: professor.id },
        relations: ['employee_user'],
      });

      professor.employee_user = employeeUser;
      await professor.save();

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
      let professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: professor,
        employee_id: 1,
      }).save();

      professor = await UserModel.findOne({
        where: { id: professor.id },
        relations: ['employee_user'],
      });

      professor.employee_user = employeeUser;
      await professor.save();

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
      let professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: professor,
        employee_id: 1,
      }).save();

      professor = await UserModel.findOne({
        where: { id: professor.id },
        relations: ['employee_user'],
      });

      professor.employee_user = employeeUser;
      await professor.save();

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
    it('should return 401 if user not authenticated', async () => {
      await supertest().get('/course/1/members').expect(401);
    });

    it('should return 401 if user is not professor', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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

      let professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'professor@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: professor,
        employee_id: 1,
      }).save();

      professor = await UserModel.findOne({
        where: { id: professor.id },
        relations: ['employee_user'],
      });

      professor.employee_user = employeeUser;
      await professor.save();

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

      let professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'professor@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: professor,
        employee_id: 1,
      }).save();

      professor = await UserModel.findOne({
        where: { id: professor.id },
        relations: ['employee_user'],
      });

      professor.employee_user = employeeUser;
      await professor.save();

      await CourseUserModel.create({
        user: professor,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      await supertest()
        .get(`/course/${course.id}/members?page=abc`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`])
        .expect(400);
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

      let professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'professor@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: professor,
        employee_id: 1,
      }).save();

      professor = await UserModel.findOne({
        where: { id: professor.id },
        relations: ['employee_user'],
      });

      professor.employee_user = employeeUser;
      await professor.save();

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
    it('should return 401 if user not authenticated', async () => {
      await supertest().get('/course/1/exams').expect(401);
    });

    it('should return 401 if user is not enrolled in course', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      await supertest()
        .get(`/course/${course.id}/exams?page=abc`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400);
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

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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
      let user = await UserModel.create({
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

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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
      let user = await UserModel.create({
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

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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
      let user = await UserModel.create({
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

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

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

  describe('PATCH /course/:cid', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().patch('/course/1').expect(401);
    });

    it('should return 401 if user is not course professor or system admin', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: user,
      }).save();

      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '1',
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      return await supertest()
        .patch(`/course/${course.id}`)
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
        email_verified: true,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: user,
      }).save();

      return await supertest()
        .patch('/course/abc')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400)
        .expect({
          message: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should return 400 if request body is invalid', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: user,
      }).save();

      return await supertest()
        .patch('/course/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({
          course_code: 123,
        })
        .expect(400)
        .expect({
          message: [
            'courseCode must be longer than or equal to 2 characters',
            'courseCode must be a string',
            'courseName must be a string',
            'semesterId must be a number conforming to the specified constraints',
            'inviteCode must be longer than or equal to 5 characters',
            'inviteCode must be a string',
          ],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should return 204 if course is updated when user is a professor in a course', async () => {
      const semester = await SemesterModel.create({
        name: 'Semester 1',
        starts_at: 1_000_000_000,
        ends_at: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '123',
        semester,
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

      await EmployeeUserModel.create({
        employee_id: 123,
        user: user,
      }).save();

      await CourseUserModel.create({
        user,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      return await supertest()
        .patch(`/course/${course.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({
          courseCode: 'COSC 498',
          courseName: 'Software Engineering',
          semesterId: semester.id,
          inviteCode: '12345',
        })
        .expect(204);
    });

    it('should return 204 if course is update when user is a system admin', async () => {
      const semester = await SemesterModel.create({
        name: 'Semester 1',
        starts_at: 1_000_000_000,
        ends_at: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '123',
        semester,
      }).save();

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: user,
      }).save();

      return await supertest()
        .patch(`/course/${course.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({
          courseCode: 'COSC 498',
          courseName: 'Software Engineering',
          semesterId: semester.id,
          inviteCode: '12345',
        })
        .expect(204);
    });
  });

  describe('PATCH /course/:cid/archive', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().patch('/course/1/archive').expect(401);
    });

    it('should return 401 if user is not course professor or system admin', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: user,
      }).save();

      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        invite_code: '1',
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      return await supertest()
        .patch(`/course/${course.id}/archive`)
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
        email_verified: true,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: user,
      }).save();

      return await supertest()
        .patch('/course/abc/archive')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400)
        .expect({
          message: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should return 400 if request body is invalid', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: user,
      }).save();

      return await supertest()
        .patch('/course/1/archive')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({})
        .expect(400)
        .expect({
          message: ['archive must be a boolean value'],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should return 204 if course is archived when user is a professor in a course', async () => {
      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
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

      await EmployeeUserModel.create({
        employee_id: 123,
        user: user,
      }).save();

      await CourseUserModel.create({
        user,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      return await supertest()
        .patch(`/course/${course.id}/archive`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({
          archive: true,
        })
        .expect(204);
    });

    it('should return 204 if course is archived when user is a system admin', async () => {
      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        section_name: '001',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
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
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: user,
      }).save();

      return await supertest()
        .patch(`/course/${course.id}/archive`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({
          archive: true,
        })
        .expect(204);
    });
  });

  describe('GET /course/all/count', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().get('/course/all/count').expect(401);
    });

    it('should return 401 if user is not a system admin', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      return await supertest()
        .get('/course/all/count')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 200 and count of all courses', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      for (let i = 0; i < 10; i++) {
        await CourseModel.create({
          course_code: 'COSC 499',
          course_name: 'Capstone Project',
          section_name: '001',
          invite_code: '123',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();
      }

      const result = await supertest()
        .get('/course/all/count')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.body).toMatchSnapshot();
    });

    it('should return 200 and count of all courses that are not archived', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      for (let i = 0; i < 10; i++) {
        await CourseModel.create({
          course_code: 'COSC 499',
          course_name: 'Capstone Project',
          section_name: '001',
          invite_code: '123',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          is_archived: i % 2 === 0,
        }).save();
      }

      const result = await supertest()
        .get('/course/all/count')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.body.count).toBe(5);
    });
  });

  describe('GET /course/all', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().get('/course/all').expect(401);
    });

    it('should return 401 if user is not a system admin', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      return await supertest()
        .get('/course/all')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 200 and empty array if there are no courses', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      const result = await supertest()
        .get('/course/all')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.body).toEqual([]);
    });

    it('should return 200 and all courses', async () => {
      const userAdmin = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: userAdmin,
      }).save();

      const semester = await SemesterModel.create({
        name: 'Spring 2024',
        starts_at: parseInt(new Date('2021-01-01').getTime().toString()),
        ends_at:
          parseInt(new Date('2021-01-01').getTime().toString()) +
          1000 * 60 * 60 * 24 * 90,
        created_at: parseInt(new Date('2021-01-01').getTime().toString()),
        updated_at: parseInt(new Date('2021-01-01').getTime().toString()),
      }).save();

      for (let i = 0; i < 10; i++) {
        const user = await UserModel.create({
          first_name: 'John',
          last_name: `Doe`,
          email: `john.doe${i}@mail.com`,
          email_verified: true,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();

        const professor = await UserModel.create({
          first_name: 'Jane',
          last_name: `Doe`,
          email: `professor.doe${i}@mail.com`,
          email_verified: true,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();

        let course = await CourseModel.create({
          course_code: 'CS101',
          course_name: 'Introduction to Computer Science',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          section_name: '001',
          invite_code: '123',
          semester,
        }).save();

        const courseUser = await CourseUserModel.create({
          user,
          course,
        }).save();

        const courseUserProfessor = await CourseUserModel.create({
          user: professor,
          course,
          course_role: CourseRoleEnum.PROFESSOR,
        }).save();

        course = await CourseModel.findOne({
          where: { id: course.id },
          relations: ['users'],
        });

        course.users.push(courseUser);
        course.users.push(courseUserProfessor);
        await course.save();
      }

      const result = await supertest()
        .get('/course/all')
        .set('Cookie', [`auth_token=${signJwtToken(userAdmin.id)}`]);

      expect(result.body).toMatchSnapshot();
    });
  });

  describe('GET /course/:cid/analytics', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().get('/course/1/analytics').expect(401);
    });

    it('should return 401 if user is not course professor or TA', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      return await supertest()
        .get(`/course/${course.id}/analytics`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if course id is not a number', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      return await supertest()
        .get('/course/abc/analytics')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400);
    });

    it('should return 200 and only courseMembersStats if course has no exams or submissions', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      let course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
      }).save();

      await CourseUserModel.create({
        user,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['users'],
      });

      for (let i = 0; i < 10; i++) {
        const user = await UserModel.create({
          first_name: 'John',
          last_name: 'Doe',
          email: `john.doe+${i}@mail.com`,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();

        const courseUserModel = await CourseUserModel.create({
          user,
          course,
          course_role: CourseRoleEnum.STUDENT,
        }).save();

        course.users.push(courseUserModel);
      }
      await course.save();

      const result = await supertest()
        .get(`/course/${course.id}/analytics`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.body).toMatchSnapshot();
    });

    it('should return 200 and courseMembersSize, examCount if course has students, exams, but no submissions', async () => {
      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: professor,
      }).save();

      let course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
      }).save();

      await CourseUserModel.create({
        user: professor,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['users', 'exams'],
      });

      for (let i = 0; i < 3; i++) {
        const user = await UserModel.create({
          first_name: 'John',
          last_name: 'Doe',
          email: `john.doe+${i}@mail.com`,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();

        const courseUserModel = await CourseUserModel.create({
          user,
          course,
          course_role: CourseRoleEnum.STUDENT,
        }).save();

        course.users.push(courseUserModel);
      }
      await course.save();

      for (let i = 0; i < 4; i++) {
        const exam = await ExamModel.create({
          course,
          exam_date: 1_000_000_000,
          name: `Exam-${i}`,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
        }).save();
        course.exams.push(exam);
      }
      await course.save();

      const result = await supertest()
        .get(`/course/${course.id}/analytics`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`]);

      expect(result.body).toMatchSnapshot();
    });

    it('should return 200 and courseMembersSize, examCount, submissionCount if course has students, exams, and submissions', async () => {
      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: professor,
      }).save();

      let course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
      }).save();

      await CourseUserModel.create({
        user: professor,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['users', 'exams'],
      });

      const studentUsers = [];

      for (let i = 0; i < 3; i++) {
        const user = await UserModel.create({
          first_name: 'John',
          last_name: 'Doe',
          email: `john.doe${i}@mail.com`,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();

        const studentUser = await StudentUserModel.create({
          user,
          student_id: 12345 + i,
        }).save();

        studentUsers.push(studentUser);

        await user.save();

        const courseUserModel = await CourseUserModel.create({
          user,
          course,
          course_role: CourseRoleEnum.STUDENT,
        }).save();

        course.users.push(courseUserModel);
      }
      await course.save();

      for (let i = 0; i < 4; i++) {
        let exam = await ExamModel.create({
          course,
          exam_date: 1_000_000_000,
          name: `Exam-${i}`,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
        }).save();
        course.exams.push(exam);

        await course.save();

        exam = await ExamModel.findOne({
          where: { id: exam.id },
          relations: ['submissions'],
        });

        for (let j = 0; j < 3; j++) {
          const submission = await SubmissionModel.create({
            exam,
            student: studentUsers[j],
            answers: {},
            created_at: 1_000_000_000,
            updated_at: 1_000_000_000,
            document_path: 'path',
            score: -1,
          }).save();
          exam.submissions.push(submission);
        }
        await exam.save();
      }
      await course.save();

      const result = await supertest()
        .get(`/course/${course.id}/analytics`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`]);

      expect(result.body).toMatchSnapshot();
    });
  });
});
