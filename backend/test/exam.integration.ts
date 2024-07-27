import { UserModel } from '../src/modules/user/entities/user.entity';
import { ExamModule } from '../src/modules/exam/exam.module';
import { setUpIntegrationTests, signJwtToken } from './utils/testUtils';
import { CourseModel } from '../src/modules/course/entities/course.entity';
import { ExamModel } from '../src/modules/exam/entities/exam.entity';
import { CourseUserModel } from '../src/modules/course/entities/course-user.entity';
import { CourseRoleEnum, UserRoleEnum } from '../src/enums/user.enum';
import { SubmissionModel } from '../src/modules/exam/entities/submission.entity';
import { StudentUserModel } from '../src/modules/user/entities/student-user.entity';
import * as path from 'path';
import * as fsExtra from 'fs-extra';
import { EmployeeUserModel } from '../src/modules/user/entities/employee-user.entity';
import * as sinon from 'sinon';
import * as fs from 'fs';
import { SubmissionDisputeModel } from '../src/modules/exam/entities/submission-dispute.entity';
import { DisputeStatusEnum } from '../src/enums/exam-dispute.enum';

describe('Exam Integration', () => {
  const supertest = setUpIntegrationTests(ExamModule);

  beforeEach(async () => {
    await SubmissionModel.delete({});
    await CourseUserModel.delete({});
    await ExamModel.delete({});
    await CourseModel.delete({});
    await UserModel.delete({});
    await StudentUserModel.delete({});
    await EmployeeUserModel.delete({});
    await SubmissionDisputeModel.delete({});

    await SubmissionDisputeModel.query(
      `ALTER SEQUENCE submission_dispute_model_id_seq RESTART WITH 1`,
    );
    await ExamModel.query(`ALTER SEQUENCE exam_model_id_seq RESTART WITH 1`);
    await CourseModel.query(
      `ALTER SEQUENCE course_model_id_seq RESTART WITH 1`,
    );
    await UserModel.query(`ALTER SEQUENCE user_model_id_seq RESTART WITH 1`);
    await CourseUserModel.query(
      'ALTER SEQUENCE course_user_model_id_seq RESTART WITH 1',
    );
    await SubmissionModel.query(
      `ALTER SEQUENCE submission_model_id_seq RESTART WITH 1`,
    );
    await StudentUserModel.query(
      'ALTER SEQUENCE student_user_model_id_seq RESTART WITH 1',
    );
    await EmployeeUserModel.query(
      'ALTER SEQUENCE employee_user_model_id_seq RESTART WITH 1',
    );
  });

  describe('DELETE /exam/:eid/:cid', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().delete('/exam/1/1').expect(401);
    });

    it('should return 401 if user not TA or professor of course', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
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
      }).save();

      await supertest()
        .delete(`/exam/1/${course.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 404 if exam not found', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
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

      const result = await supertest()
        .delete(`/exam/1/${course.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(404);
      expect(result.body).toEqual({
        message: 'Exam not found',
      });
    });

    it('should return 204 if exam is deleted successfully', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
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

      let exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
        course: course,
      }).save();

      const result = await supertest()
        .delete(`/exam/${exam.id}/${course.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      exam = await ExamModel.findOne({
        where: { id: exam.id },
      });

      expect(result.status).toBe(204);
      expect(exam).toBeNull();
    });
  });

  describe('POST /exam/:cid/create', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().post('/exam/1/create').expect(401);
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
        .post(`/exam/${course.id}/create`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 401 if user not professor', async () => {
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
          'Exam name is too long',
          'exam_name must be longer than or equal to 2 characters',
          'exam_name must be a string',
          'exam_date must be an integer number',
        ],
        statusCode: 400,
      });
    });
  });

  describe('GET /exam/:cid/:eid/submissions', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().get('/exam/1/1/submissions').expect(401);
    });

    it('should return 401 if user not assigned to the course', async () => {
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
        .get(`/exam/${course.id}/1/submissions`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 401 if user not professor or ta', async () => {
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
        course,
        user,
        course_role: CourseRoleEnum.STUDENT,
      }).save();

      await supertest()
        .get(`/exam/${course.id}/1/submissions`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 200 if exam submissions are returned', async () => {
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
        course,
        user,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      let exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      exam = await ExamModel.findOne({
        where: { id: exam.id },
        relations: ['submissions'],
      });

      for (let i = 0; i < 10; i++) {
        const newUser = await UserModel.create({
          first_name: 'John',
          last_name: 'Doe',
          email: `john.doe-${i}@test.com`,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          email_verified: true,
        }).save();

        const studentUser = await StudentUserModel.create({
          user: newUser,
          student_id: i,
        }).save();

        const submission = await SubmissionModel.create({
          exam,
          student: studentUser,
          answers: {},
          score: i,
          document_path: 'path',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();

        exam.submissions.push(submission);
      }
      exam.save();

      const result = await supertest()
        .get(`/exam/${course.id}/${exam.id}/submissions`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(200);
      expect(result.body).toMatchSnapshot();
    });

    it('should return 200 and empty array if no submissions are found', async () => {
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
        course,
        user,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      const result = await supertest()
        .get(`/exam/${course.id}/1/submissions`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(200);
      expect(result.body).toEqual([]);
    });
  });

  describe('GET /exam/:cid/exam/:eid', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().get('/exam/1/exam/1').expect(401);
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

      await supertest()
        .get('/exam/1/exam/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 401 if user not professor or ta', async () => {
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
        course,
        user,
        course_role: CourseRoleEnum.STUDENT,
      }).save();

      await supertest()
        .get(`/exam/${course.id}/exam/1`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 404 if exam not found', async () => {
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
        course,
        user,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      const result = await supertest()
        .get(`/exam/${course.id}/exam/1`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(404);
      expect(result.body).toEqual({
        message: 'Exam not found',
      });
    });

    it('should return 200 if exam is found', async () => {
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
        course,
        user,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      const result = await supertest()
        .get(`/exam/${course.id}/exam/${exam.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(200);
      expect(result.body).toMatchSnapshot();
    });
  });

  describe('GET /exam/upcoming', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().get('/exam/upcoming').expect(401);
    });

    it('should return 204 if no exams are found', async () => {
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
        course,
        user,
        course_role: CourseRoleEnum.STUDENT,
      }).save();

      const result = await supertest()
        .get('/exam/upcoming')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(204);
      expect(result.body).toStrictEqual({});
    });

    it('should return 204 if user is not enrolled in any courses', async () => {
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
        .get('/exam/upcoming')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(204);
      expect(result.body).toStrictEqual({});
    });

    it('should return 200 if exams are found for user', async () => {
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

      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      for (let i = 0; i < 10; i++) {
        const exam = await ExamModel.create({
          name: `Exam ${i}`,
          exam_date: parseInt(new Date().getTime().toString()) + 1000 * (i + 1),
          course,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
        }).save();

        course.exams.push(exam);
      }
      await course.save();

      const result = await supertest()
        .get('/exam/upcoming')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      result.body.forEach((course) => {
        course.exams.forEach((exam) => {
          delete exam.examDate;
        });
      });
      expect(result.status).toBe(200);
      expect(result.body).toMatchSnapshot();
    });
  });

  describe('GET /exam/graded', () => {
    it('should return 401 if not authenticated', async () => {
      await supertest().get('/exam/graded').expect(401);
    });

    it('should return 204 if no exams are found', async () => {
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
        .get('/exam/graded')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(204);
    });

    it('should return 204 if no graded exams are found for user', async () => {
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

      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      for (let i = 0; i < 10; i++) {
        const exam = await ExamModel.create({
          name: `Exam ${i}`,
          exam_date: parseInt(new Date().getTime().toString()) + 1000 * (i + 1),
          course,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
        }).save();

        course.exams.push(exam);
      }

      await course.save();

      const result = await supertest()
        .get('/exam/graded')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(204);
    });

    it('should return 200 if graded exams are found for user', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      let studentUser = await StudentUserModel.create({
        user,
        student_id: 1,
      }).save();

      studentUser = await StudentUserModel.findOne({
        where: { id: studentUser.id },
        relations: ['submissions'],
      });

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      for (let i = 0; i < 10; i++) {
        const exam = await ExamModel.create({
          name: `Exam ${i}`,
          exam_date: 1_000_000_000 + i,
          grades_released_at: parseInt(new Date().getTime().toString()),
          course,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
        }).save();

        const submission = await SubmissionModel.create({
          exam,
          student: studentUser,
          answers: {},
          score: i,
          document_path: 'path',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();

        course.exams.push(exam);
        studentUser.submissions.push(submission);
      }
      await course.save();
      await studentUser.save();

      const result = await supertest()
        .get('/exam/graded')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(200);

      result.body.forEach((course) => {
        course.exams.forEach((exam) => {
          delete exam.examReleasedAt;
        });
      });
      expect(result.body).toMatchSnapshot();
    });
  });

  describe('GET /exam/:eid/:cid/user/:uid/grade', () => {
    it('should return 401 if not authenticated', async () => {
      await supertest().get('/exam/1/1/user/1/grade').expect(401);
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

      await supertest()
        .get('/exam/1/1/user/1/grade')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 401 if user id in a request is not the same as the authenticated user id', async () => {
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
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      const userTwo = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe-1@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      await CourseUserModel.create({
        user: userTwo,
        course,
      }).save();

      return supertest()
        .get(`/exam/1/1/user/${userTwo.id}/grade`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 404 if user is a professor or TA, but user is not enrolled in the course', async () => {
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
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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

      const userTwo = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe-1@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      return supertest()
        .get(`/exam/1/1/user/${userTwo.id}/grade`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(404);
    });

    it('should return 401 if course has been archived for requested exam', async () => {
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

      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
        is_archived: true,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        course,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      course.exams.push(exam);
      await course.save();

      return supertest()
        .get(`/exam/1/${course.id}/user/${user.id}/grade`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 404 if exam has no submissions for the user', async () => {
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

      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        course,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        grades_released_at: 1_000_000_000,
        questions: {},
      }).save();

      course.exams.push(exam);
      await course.save();

      return supertest()
        .get(`/exam/${exam.id}/${course.id}/user/${user.id}/grade`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(404)
        .expect({
          message: 'User submission not found',
        });
    });

    it('should return 200 if exam submission is found for the user', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      const userModel = await StudentUserModel.create({
        user,
        student_id: 1,
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      let exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        course,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        grades_released_at: 1_000_000_000,
        questions: {},
      }).save();

      exam = await ExamModel.findOne({
        where: { id: exam.id },
        relations: ['submissions'],
      });

      const currentUserSubmission = await SubmissionModel.create({
        exam,
        student: userModel,
        answers: {},
        score: 10,
        document_path: 'path',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      exam.submissions.push(currentUserSubmission);
      await exam.save();

      for (let i = 3; i <= 10; i++) {
        const user = await UserModel.create({
          first_name: 'John',
          last_name: 'Doe',
          email: `john.doe+${i}@test.com`,
          password: 'password',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          email_verified: true,
        }).save();

        const studentUser = await StudentUserModel.create({
          user,
          student_id: i,
        }).save();

        const submission = await SubmissionModel.create({
          exam,
          student: studentUser,
          answers: {},
          score: i,
          document_path: 'path',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();

        exam.submissions.push(submission);
      }
      await exam.save();

      const result = await supertest()
        .get(`/exam/${exam.id}/${course.id}/user/${user.id}/grade`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(200);
      expect(result.body).toMatchSnapshot();
    });
  });

  describe('GET /exam/:cid/submission/:sid/user/:uid', () => {
    it('should return 401 if not authenticated', async () => {
      await supertest().get('/exam/1/submission/1/user/1').expect(401);
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

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      await supertest()
        .get('/exam/1/submission/1/user/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 401 if user id in a request is not the same as the authenticated user id', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      const userTwo = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe-1@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      await CourseUserModel.create({
        user: userTwo,
        course,
      }).save();

      await supertest()
        .get(`/exam/${course.id}/submission/1/user/${userTwo.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 404 if user is a professor or TA, but user is not enrolled in the course', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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

      await supertest()
        .get(`/exam/${course.id}/submission/1/user/2`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(404);
    });

    it('should return 404 if submission is not found for the user and exam in the course', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      const submission = await SubmissionModel.create({
        answers: {},
        score: 0,
        document_path: 'path',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await supertest()
        .get(`/exam/${course.id}/submission/${submission.id}/user/${user.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(404)
        .expect({
          message: 'File not found',
        });
    });

    it('should return 200 if submission is found for the user and exam in the course', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      const submission = await SubmissionModel.create({
        answers: {},
        score: 0,
        document_path: `submission.pdf`,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const tempFilePath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        'exams',
        'processed_submissions',
        `submission.pdf`,
      );
      await fsExtra.ensureDir(path.dirname(tempFilePath));
      await fsExtra.writeFile(
        tempFilePath,
        'Temporary file content for testing',
      );

      const result = await supertest()
        .get(`/exam/${course.id}/submission/${submission.id}/user/${user.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(200);

      await fsExtra.remove(tempFilePath);
    });
  });

  describe('PATCH /exam/:eid/:cid/release_grades', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().patch('/exam/1/1/release_grades').expect(401);
    });

    it('should return 401 if user not professor or ta', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      return supertest()
        .patch('/exam/1/1/release_grades')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 401 if course is archived for the requested exam', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
        is_archived: true,
      }).save();

      await CourseUserModel.create({
        user,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      return supertest()
        .patch(`/exam/1/${course.id}/release_grades`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 404 if exam not found for the course', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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
        .patch(`/exam/1/${course.id}/release_grades`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(404);
    });

    it('should return 200 if grades are released for the exam submissions', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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

      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        course,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      course.exams.push(exam);
      await course.save();

      const result = await supertest()
        .patch(`/exam/${exam.id}/${course.id}/release_grades`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(200);
      expect(result.body).toEqual({
        message: 'ok',
      });
    });
  });

  describe('PATCH /exam/:eid/course/:cid/submission/:sid/grade', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest()
        .patch('/exam/1/course/1/submission/1/grade')
        .expect(401);
    });

    it('should return 401 if user not professor or ta', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      await supertest()
        .patch('/exam/1/course/1/submission/1/grade')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
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
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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

      const result = await supertest()
        .patch('/exam/1/course/1/submission/1/grade')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({});

      expect(result.status).toBe(400);
      expect(result.body).toStrictEqual({
        error: 'Bad Request',
        message: [
          'Maximum grade must be 100',
          'Minimum grade must be 0',
          'Grade value is not valid',
        ],
        statusCode: 400,
      });
    });

    it('should return 400 if request body includes grade with more than three decimal places', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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

      const result = await supertest()
        .patch('/exam/1/course/1/submission/1/grade')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ grade: 100.1234 });

      expect(result.status).toBe(400);
      expect(result.body).toStrictEqual({
        error: 'Bad Request',
        message: ['Maximum grade must be 100', 'Grade value is not valid'],
        statusCode: 400,
      });
    });

    it('should return 404 if submission not found', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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

      const result = await supertest()
        .patch(`/exam/1/course/${course.id}/submission/1/grade`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ grade: 100 });

      expect(result.status).toBe(404);
      expect(result.body).toStrictEqual({
        message: 'Submission not found',
      });
    });

    it('should return 200 if grade is updated successfully', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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

      let exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      course.exams.push(exam);
      await course.save();

      const submission = await SubmissionModel.create({
        exam,
        answers: {},
        score: 0,
        document_path: 'path',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      exam = await ExamModel.findOne({
        where: { id: exam.id },
        relations: ['submissions'],
      });

      exam.submissions.push(submission);
      await exam.save();

      const result = await supertest()
        .patch(
          `/exam/${exam.id}/course/${course.id}/submission/${submission.id}/grade`,
        )
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ grade: 100 });

      expect(result.status).toBe(200);
      expect(result.body).toStrictEqual({ message: 'ok' });
    });

    it('should return 200 if grade has three decimal value', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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

      let exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      course.exams.push(exam);
      await course.save();

      const submission = await SubmissionModel.create({
        exam,
        answers: {},
        score: 0,
        document_path: 'path',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      exam = await ExamModel.findOne({
        where: { id: exam.id },
        relations: ['submissions'],
      });

      exam.submissions.push(submission);
      await exam.save();

      const result = await supertest()
        .patch(
          `/exam/${exam.id}/course/${course.id}/submission/${submission.id}/grade`,
        )
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ grade: 32.375 });

      expect(result.status).toBe(200);
      expect(result.body).toStrictEqual({ message: 'ok' });
    });
  });

  describe('GET /exam/custom_bubble_sheet/:fileId', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().get('/exam/custom_bubble_sheet/1').expect(401);
    });

    it('should return 401 if user has no professor or admin role in the system', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      return supertest()
        .get('/exam/custom_bubble_sheet/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 404 if file is not found in the system', async () => {
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

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      return supertest()
        .get('/exam/custom_bubble_sheet/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(404);
    });

    it('should return 200 if file is found in the system', async () => {
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

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      const tempFilePath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        'bubble_sheets',
        '1',
        `bubble_sheet.zip`,
      );

      await fsExtra.ensureDir(path.dirname(tempFilePath));
      await fsExtra.writeFile(
        tempFilePath,
        'Temporary file content for testing',
      );

      const result = await supertest()
        .get('/exam/custom_bubble_sheet/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(200);
      await fsExtra.remove(tempFilePath);
    });
  });

  describe('POST /exam/:eid/:cid/upload', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().post('/exam/1/1/upload').expect(401);
    });

    it('should return 401 if user not professor or ta', async () => {
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

      return supertest()
        .post('/exam/1/1/upload')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 when answerKey and submissions are not PDF files', async () => {
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

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      const result = await supertest()
        .post('/exam/1/1/upload')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .attach('answerKey', Buffer.from('test'), {
          filename: 'test.txt',
          contentType: 'application/json',
        })
        .attach('submissions', Buffer.from('test'), {
          filename: 'test.txt',
          contentType: 'application/json',
        });

      expect(result.status).toBe(400);
      expect(result.body.message).toStrictEqual(
        'Exam files are invalid, make sure they are PDFs',
      );
    });

    it('should return 404 if exam not found for the course', async () => {
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

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      const result = await supertest()
        .post('/exam/1/1/upload')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .attach('answerKey', Buffer.from('test'), {
          filename: 'test.pdf',
          contentType: 'application/pdf',
        })
        .attach('submissions', Buffer.from('test'), {
          filename: 'test.pdf',
          contentType: 'application/pdf',
        });

      expect(result.status).toBe(404);
      expect(result.body.message).toStrictEqual('Exam not found');
    });

    it('should return 400 if exam has already uploaded answer key and submissions files', async () => {
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

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        course,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
        exam_folder: 'folderName',
      }).save();

      const result = await supertest()
        .post(`/exam/${exam.id}/${course.id}/upload`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .attach('answerKey', Buffer.from('test'), {
          filename: 'test.pdf',
          contentType: 'application/pdf',
        })
        .attach('submissions', Buffer.from('test'), {
          filename: 'test.pdf',
          contentType: 'application/pdf',
        });

      expect(result.status).toBe(400);
      expect(result.body.message).toStrictEqual(
        'Exam files have already been uploaded',
      );
    });

    it('should return 200 if exam files are uploaded successfully', async () => {
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

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        course,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      sinon.stub(fs, 'mkdirSync').returns({
        on: sinon.stub(),
      } as any);

      sinon.stub(fs, 'writeFileSync').returns({
        on: sinon.stub(),
      } as any);

      const result = await supertest()
        .post(`/exam/${exam.id}/${course.id}/upload`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .attach('answerKey', Buffer.from('test'), {
          filename: 'test.pdf',
          contentType: 'application/pdf',
        })
        .attach('submissions', Buffer.from('test'), {
          filename: 'test.pdf',
          contentType: 'application/pdf',
        });

      expect(result.status).toBe(200);

      sinon.restore();
    });
  });

  describe('POST /exam/:eid/:studentId', () => {
    it('should return 401 if worker token is not provided', async () => {
      await supertest().post('/exam/1/1').expect(401);
    });

    it('should return 401 if worker token is invalid', async () => {
      await supertest()
        .post('/exam/1/1')
        .set('x-worker-auth-token', 'invalid-token')
        .expect(401);
    });

    it('should return 400 if request body is invalid', async () => {
      await supertest()
        .post('/exam/1/1')
        .set('x-worker-auth-token', 'secret_worker_auth_token')
        .send({})
        .expect(400);
    });

    it('should return 404 if exam not found for the course', async () => {
      await supertest()
        .post(`/exam/1/1`)
        .set('x-worker-auth-token', 'secret_worker_auth_token')
        .send({ answers: {}, score: 0, documentPath: 'path' })
        .expect(404);
    });

    it('should return 200 if submission is created successfully', async () => {
      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: null,
      }).save();

      await supertest()
        .post(`/exam/${exam.id}/123`)
        .set('x-worker-auth-token', 'secret_worker_auth_token')
        .send({ answers: {}, score: 32, documentPath: 'path' })
        .expect(200);
    });

    it('should return 200 if student id is not found in the system', async () => {
      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      await supertest()
        .post(`/exam/${exam.id}/123`)
        .set('x-worker-auth-token', 'secret_worker_auth_token')
        .send({ answers: {}, score: 32, documentPath: 'path' })
        .expect(200);
    });
  });

  describe('GET /exam/:cid/:eid/download_grades', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().get('/exam/1/1/download_grades').expect(401);
    });

    it('should return 401 if user not professor or ta', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      return supertest()
        .get(`/exam/1/${course.id}/download_grades`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if exam id is not a number', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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
        .get(`/exam/a/${course.id}/download_grades`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400);
    });

    it('should return CSV file with studentId and grades', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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

      let exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      exam = await ExamModel.findOne({
        where: { id: exam.id },
        relations: ['submissions'],
      });

      for (let i = 1; i <= 10; i++) {
        const user = await UserModel.create({
          first_name: 'John',
          last_name: 'Doe',
          email: `john.doe${i}@mail.com`,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          email_verified: true,
        }).save();

        const studentUser = await StudentUserModel.create({
          user,
          student_id: 1_000 + i,
        }).save();

        const submission = await SubmissionModel.create({
          exam,
          student: studentUser,
          answers: {},
          score: i,
          document_path: 'path',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();

        exam.submissions.push(submission);
      }
      await exam.save();

      const result = await supertest()
        .get(`/exam/${exam.id}/${course.id}/download_grades`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(200);
      expect(result.headers['content-type']).toBe('text/csv; charset=utf-8');

      expect(result.text).toMatchSnapshot();
    });

    it('should return CSV with only headers when exam has no submissions', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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

      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      const result = await supertest()
        .get(`/exam/${exam.id}/${course.id}/download_grades`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(200);
      expect(result.headers['content-type']).toBe('text/csv; charset=utf-8');

      expect(result.text).toMatchSnapshot();
    });
  });

  describe('POST /exam/:cid/submission/:sid/dispute', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().post('/exam/1/submission/1/dispute').expect(401);
    });

    it('should return 401 if user not student', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        user,
        employee_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      return supertest()
        .post('/exam/1/submission/1/dispute')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if request body is invalid', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        user,
        student_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      return supertest()
        .post('/exam/1/submission/1/dispute')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({})
        .expect(400);
    });

    it('should return 404 if submission not found', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        user,
        student_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      const result = await supertest()
        .post(`/exam/${course.id}/submission/1/dispute`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ description: 'Dispute message' });

      expect(result.status).toBe(404);
      expect(result.body).toStrictEqual({
        message: 'Submission not found',
      });
    });

    it('should return 400 if submission does not belong to the student', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        user,
        student_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        course,
        questions: {},
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await SubmissionModel.create({
        answers: {},
        exam,
        score: 0,
        document_path: 'path',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const result = await supertest()
        .post(`/exam/${course.id}/submission/1/dispute`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ description: 'Dispute message' });

      expect(result.status).toBe(400);
      expect(result.body).toStrictEqual({
        message: 'Submission does not belong to user',
      });
    });

    it('should return 400 if submission dispute is already created', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        user,
        student_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        course,
        questions: {},
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const submission = await SubmissionModel.create({
        answers: {},
        exam,
        student: studentUser,
        score: 0,
        document_path: 'path',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await SubmissionDisputeModel.create({
        submission,
        description: 'Dispute message',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const result = await supertest()
        .post(`/exam/${course.id}/submission/${submission.id}/dispute`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ description: 'Dispute message' });

      expect(result.status).toBe(400);
      expect(result.body).toStrictEqual({
        message: 'Dispute already exists for this submission',
      });
    });

    it('should return 200 if submission dispute is created successfully', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        user,
        student_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        course,
        questions: {},
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await SubmissionModel.create({
        answers: {},
        exam,
        student: studentUser,
        score: 0,
        document_path: 'path',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const result = await supertest()
        .post(`/exam/${course.id}/submission/1/dispute`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ description: 'Dispute message' });

      expect(result.status).toBe(200);
      expect(result.body).toStrictEqual({ message: 'ok' });
    });
  });

  describe('GET /exam/:eid/:cid/submissions_disputes', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().get('/exam/1/1/submissions_disputes').expect(401);
    });

    it('should return 401 if user not professor or ta', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        user,
        employee_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      return supertest()
        .get(`/exam/1/${course.id}/submissions_disputes`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if exam id is not a number', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        user,
        employee_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      return supertest()
        .get(`/exam/a/${course.id}/submissions_disputes`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400);
    });

    it('should return 404 if exam not found for the course', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        user,
        employee_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      const result = await supertest()
        .get(`/exam/1/${course.id}/submissions_disputes`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(404);
      expect(result.body).toStrictEqual({
        message: 'Disputes not found',
      });
    });

    it('should return disputes for the exam', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        user,
        employee_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      let exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        course,
        questions: {},
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      exam = await ExamModel.findOne({
        where: { id: exam.id },
        relations: ['submissions'],
      });

      for (let i = 0; i < 10; i++) {
        const studentUser = await StudentUserModel.create({
          student_id: 123 + i,
          user: null,
        }).save();

        const submission = await SubmissionModel.create({
          answers: {},
          exam,
          student: studentUser,
          score: 0,
          document_path: 'path',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();

        await SubmissionDisputeModel.create({
          submission,
          description: 'Dispute message',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();

        exam.submissions.push(submission);
      }
      await exam.save();

      const result = await supertest()
        .get(`/exam/${exam.id}/${course.id}/submissions_disputes`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(200);
      expect(result.body).toMatchSnapshot();
    });
  });

  describe('GET /exam/:cid/:disputeId/exam_submission_dispute', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().get('/exam/1/1/exam_submission_dispute').expect(401);
    });

    it('should return 401 if user not professor or ta', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        user,
        student_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      return supertest()
        .get(`/exam/1/${course.id}/exam_submission_dispute`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if dispute id is not a number', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        user,
        employee_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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
        .get(`/exam/${course.id}/a/exam_submission_dispute`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400);
    });

    it('should return 404 if dispute not found', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        user,
        employee_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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

      const result = await supertest()
        .get(`/exam/${course.id}/1/exam_submission_dispute`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(404);
      expect(result.body).toStrictEqual({
        message: 'Dispute not found',
      });
    });

    it('should return dispute for the exam submission', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        user,
        employee_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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

      let exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        course,
        questions: {},
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      exam = await ExamModel.findOne({
        where: { id: exam.id },
        relations: ['submissions'],
      });

      const student = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'student@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: student,
      }).save();

      const submission = await SubmissionModel.create({
        answers: {},
        exam,
        student: studentUser,
        score: 0,
        document_path: 'path',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const dispute = await SubmissionDisputeModel.create({
        submission,
        description: 'Dispute message',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const result = await supertest()
        .get(`/exam/${course.id}/${dispute.id}/exam_submission_dispute`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(200);
      expect(result.body).toMatchSnapshot();
    });
  });

  describe('PATCH /exam/:cid/:disputeId/update_dispute_status', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().patch('/exam/1/1/update_dispute_status').expect(401);
    });

    it('should return 401 if user not professor or ta', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        user,
        student_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      return supertest()
        .patch(`/exam/1/${course.id}/update_dispute_status`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if dispute id is not a number', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        user,
        employee_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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
        .patch(`/exam/${course.id}/a/update_dispute_status`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400);
    });

    it('should return 404 if dispute not found', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        user,
        employee_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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

      const result = await supertest()
        .patch(`/exam/${course.id}/1/update_dispute_status`)
        .send({ status: DisputeStatusEnum.CREATED })
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(404);
      expect(result.body).toStrictEqual({
        message: 'Dispute not found',
      });
    });

    it('should return 400 if request body is invalid', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        user,
        employee_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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
        .patch(`/exam/${course.id}/1/update_dispute_status`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({})
        .expect(400);
    });

    it('should return 200 if dispute status is updated successfully', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        user,
        employee_id: 123,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
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

      const dispute = await SubmissionDisputeModel.create({
        submission: null,
        description: 'Dispute message',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const result = await supertest()
        .patch(`/exam/${course.id}/${dispute.id}/update_dispute_status`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ status: DisputeStatusEnum.RESOLVED });

      expect(result.status).toBe(200);
      expect(result.body).toStrictEqual({ message: 'ok' });

      const updatedDispute = await SubmissionDisputeModel.findOne({
        where: { id: dispute.id },
      });

      expect(updatedDispute.status).toBe(DisputeStatusEnum.RESOLVED);
    });
  });

  describe('GET /exam/:cid/:sid/grade', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().get('/exam/1/1/grade').expect(401);
    });

    it('should return 401 if user not professor or ta', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'student@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user,
      }).save();

      return supertest()
        .get('/exam/1/1/grade')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 404 if submission not found for the exam and student id', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'student@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      return supertest()
        .get('/exam/1/1/grade')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(404);
    });

    it('should return 200 if submission is found for the exam and student id', async () => {
      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'professor@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: professor,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user: professor,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      let exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
        course,
      }).save();

      exam = await ExamModel.findOne({
        where: { id: exam.id },
        relations: ['submissions'],
      });

      const student = await UserModel.create({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'student@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        user: student,
        student_id: 123,
      }).save();

      const submission = await SubmissionModel.create({
        exam,
        student: studentUser,
        answers: {},
        score: 32,
        document_path: 'path',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      exam.submissions.push(submission);

      await exam.save();

      const result = await supertest()
        .get(`/exam/${course.id}/${submission.id}/grade`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`]);

      expect(result.status).toBe(200);
      expect(result.body).toMatchSnapshot();
    });
  });

  describe('GET /exam/:cid/submission/:sid/graded_submission', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest()
        .get('/exam/1/submission/1/graded_submission')
        .expect(401);
    });

    it('should return 401 if user not professor or ta', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'studen@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user,
      }).save();

      return supertest()
        .get('/exam/1/submission/1/graded_submission')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 404 if submission not found for the student id and course id', async () => {
      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'professor@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: professor,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user: professor,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      return supertest()
        .get('/exam/1/submission/1/graded_submission')
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`])
        .expect(404);
    });

    it('should return 200 if submission is found for the submission id and course id', async () => {
      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'professor@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: professor,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user: professor,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      let exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
        course,
      }).save();

      exam = await ExamModel.findOne({
        where: { id: exam.id },
        relations: ['submissions'],
      });

      const submission = await SubmissionModel.create({
        exam,
        answers: {},
        score: 32,
        document_path: 'submission.pdf',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const tempFilePath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        'exams',
        'processed_submissions',
        `submission.pdf`,
      );
      await fsExtra.ensureDir(path.dirname(tempFilePath));
      await fsExtra.writeFile(
        tempFilePath,
        'Temporary file content for testing',
      );

      exam.submissions.push(submission);
      await exam.save();

      const result = await supertest()
        .get(`/exam/${course.id}/submission/${submission.id}/graded_submission`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`]);

      expect(result.status).toBe(200);

      await fsExtra.remove(tempFilePath);
    });
  });

  describe('PATCH /exam/:cid/:submissionId/update_submission_user', () => {
    it('should return 401 if user not authenticated', async () => {
      await supertest().patch('/exam/1/1/update_submission_user').expect(401);
    });

    it('should return 401 if user not professor or ta', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'studen@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await StudentUserModel.create({
        student_id: 123,
        user,
      }).save();

      return supertest()
        .patch('/exam/1/1/update_submission_user')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if student id is not a number', async () => {
      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'studen@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: professor,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user: professor,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      return supertest()
        .patch(`/exam/${course.id}/1/update_submission_user`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`])
        .send({ student_id: 'a' })
        .expect(400);
    });

    it('should return 404 if submission not found for the student id and course id', async () => {
      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'studen@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: professor,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user: professor,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      return supertest()
        .patch(`/exam/${course.id}/1/update_submission_user`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`])
        .send({ studentId: 123 })
        .expect(404);
    });

    it('should return 400 if the submission is assigned to the student already', async () => {
      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'studen@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: professor,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user: professor,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      const student = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const studentUser = await StudentUserModel.create({
        user: student,
        student_id: 1,
      }).save();

      const submission = await SubmissionModel.create({
        exam: null,
        student: studentUser,
        answers: {},
        score: 23,
        document_path: 'path',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const result = await supertest()
        .patch(`/exam/${course.id}/${submission.id}/update_submission_user`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`])
        .send({ studentId: studentUser.student_id });

      expect(result.status).toBe(400);
    });

    it('should return 204 and update the submission with student', async () => {
      const professor = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'studen@mail.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user: professor,
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        section_name: '001',
        invite_code: '123',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await CourseUserModel.create({
        user: professor,
        course,
        course_role: CourseRoleEnum.PROFESSOR,
      }).save();

      const student = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const studentUser = await StudentUserModel.create({
        user: student,
        student_id: 1234,
      }).save();

      await CourseUserModel.create({
        course,
        user: student,
        course_role: CourseRoleEnum.STUDENT,
      }).save();

      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
        course,
      }).save();

      const submission = await SubmissionModel.create({
        exam: exam,
        student: null,
        answers: {},
        score: 23,
        document_path: 'path',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const result = await supertest()
        .patch(`/exam/${course.id}/${submission.id}/update_submission_user`)
        .set('Cookie', [`auth_token=${signJwtToken(professor.id)}`])
        .send({ studentId: studentUser.student_id });

      expect(result.status).toBe(204);
    });
  });
});
