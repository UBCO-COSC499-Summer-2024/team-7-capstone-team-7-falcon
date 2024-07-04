import { UserModel } from '../src/modules/user/entities/user.entity';
import { ExamModule } from '../src/modules/exam/exam.module';
import { setUpIntegrationTests, signJwtToken } from './utils/testUtils';
import { CourseModel } from '../src/modules/course/entities/course.entity';
import { ExamModel } from '../src/modules/exam/entities/exam.entity';
import { CourseUserModel } from '../src/modules/course/entities/course-user.entity';
import { CourseRoleEnum } from '../src/enums/user.enum';
import { SubmissionModel } from '../src/modules/exam/entities/submission.entity';
import { StudentUserModel } from '../src/modules/user/entities/student-user.entity';

describe('Exam Integration', () => {
  const supertest = setUpIntegrationTests(ExamModule);

  beforeEach(async () => {
    await SubmissionModel.delete({});
    await CourseUserModel.delete({});
    await ExamModel.delete({});
    await CourseModel.delete({});
    await UserModel.delete({});
    await StudentUserModel.delete({});

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
});
