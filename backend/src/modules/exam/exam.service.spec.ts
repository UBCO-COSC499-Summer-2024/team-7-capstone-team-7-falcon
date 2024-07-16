import { Test, TestingModule } from '@nestjs/testing';
import { ExamService } from './exam.service';
import {
  TestConfigModule,
  TestTypeOrmModule,
} from '../../../test/utils/testUtils';
import { ExamCreateDto } from './dto/exam-create.dto';
import { CourseModel } from '../course/entities/course.entity';
import { ExamModel } from './entities/exam.entity';
import { CourseService } from '../course/course.service';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UserModel } from '../user/entities/user.entity';
import { StudentUserModel } from '../user/entities/student-user.entity';
import { SubmissionModel } from './entities/submission.entity';
import { PageOptionsDto } from '../../dto/page-options.dto';
import { CourseUserModel } from '../course/entities/course-user.entity';
import * as sinon from 'sinon';
import * as fs from 'fs';

describe('ExamService', () => {
  let examService: ExamService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    const mockMailerService = {
      sendMail: jest.fn(),
    };

    moduleRef = await Test.createTestingModule({
      providers: [
        ExamService,
        CourseService,
        UserService,
        TokenService,
        MailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
      imports: [TestTypeOrmModule, TestConfigModule],
    }).compile();

    examService = moduleRef.get<ExamService>(ExamService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('createExam', () => {
    it('should create an exam', async () => {
      const currentTime: number =
        parseInt(new Date().getTime().toString()) + 2_000;

      const examDetails: ExamCreateDto = {
        exam_date: currentTime,
        exam_name: 'Test Exam',
      };

      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await examService.createExam(course.id, examDetails);

      const exam = await ExamModel.findOne({
        where: { course },
      });

      delete exam.created_at;
      delete exam.updated_at;
      delete exam.exam_date;

      expect(exam).toBeDefined();
      expect(exam).toMatchSnapshot();
    });

    it('should throw an error if the course is not found', async () => {
      const currentTime: number =
        parseInt(new Date().getTime().toString()) + 2_000;

      const examDetails: ExamCreateDto = {
        exam_date: currentTime,
        exam_name: 'Test Exam',
      };

      await expect(examService.createExam(1, examDetails)).rejects.toThrow(
        'Course not found',
      );
    });

    it('should throw an error if the exam date is in the past', async () => {
      const currentTime: number =
        parseInt(new Date().getTime().toString()) - 2_000;

      const examDetails: ExamCreateDto = {
        exam_date: currentTime,
        exam_name: 'Test Exam',
      };

      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await expect(
        examService.createExam(course.id, examDetails),
      ).rejects.toThrow('Exam date must be in the future');
    });
  });

  describe('getSubmissionsByExamId', () => {
    it('should return submissions by exam id', async () => {
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
        const user = await UserModel.create({
          first_name: 'John',
          last_name: 'Doe',
          email: `john.doe-${i}@test.com`,
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
      exam.save();

      const submissions = await examService.getSubmissionsByExamId(exam.id);

      expect(submissions).toBeDefined();
      expect(submissions).toMatchSnapshot();
    });

    it('should return an empty array if no submissions are found', async () => {
      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      const submissions = await examService.getSubmissionsByExamId(exam.id);

      expect(submissions).toEqual([]);
    });

    it('should return an empty array if the exam is not found', async () => {
      const submissions = await examService.getSubmissionsByExamId(1);

      expect(submissions).toEqual([]);
    });
  });

  describe('getExamsByCourseId', () => {
    it('should not return any exams if the course is archived', async () => {
      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
        is_archived: true,
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
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

      const pageOptionsDto = new PageOptionsDto();
      pageOptionsDto.page = 1;
      pageOptionsDto.take = 5;

      const exams = await examService.getExamsByCourseId(
        course.id,
        pageOptionsDto,
      );

      expect(exams).toBeDefined();
      expect(exams.data).toHaveLength(0);
    });

    it('should not return any exams if the course has no exams', async () => {
      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      const pageOptionsDto = new PageOptionsDto();
      pageOptionsDto.page = 1;
      pageOptionsDto.take = 5;

      const exams = await examService.getExamsByCourseId(
        course.id,
        pageOptionsDto,
      );

      expect(exams).toBeDefined();
      expect(exams.data).toHaveLength(0);
    });

    it("should not return any exams if the course doesn't exist", async () => {
      const pageOptionsDto = new PageOptionsDto();
      pageOptionsDto.page = 1;
      pageOptionsDto.take = 5;

      const exams = await examService.getExamsByCourseId(1, pageOptionsDto);

      expect(exams).toBeDefined();
      expect(exams.data).toHaveLength(0);
    });

    it('should return course exams from first page', async () => {
      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
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

      const pageOptionsDto = new PageOptionsDto();
      pageOptionsDto.page = 1;
      pageOptionsDto.take = 5;

      const exams = await examService.getExamsByCourseId(
        course.id,
        pageOptionsDto,
      );

      expect(exams).toBeDefined();
      expect(exams).toMatchSnapshot();
    });

    it('should return course exams from second page', async () => {
      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
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

      const pageOptionsDto = new PageOptionsDto();
      pageOptionsDto.page = 2;
      pageOptionsDto.take = 5;

      const exams = await examService.getExamsByCourseId(
        course.id,
        pageOptionsDto,
      );

      expect(exams).toBeDefined();
      expect(exams).toMatchSnapshot();
    });
  });

  describe('getUpcomingExamsByCourseUser', () => {
    it('should return upcoming exams for user', async () => {
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

      let courseTwo = await CourseModel.create({
        course_code: 'CS102',
        course_name: 'Introduction to Computer Science II',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '002',
        invite_code: '123',
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      await CourseUserModel.create({
        user,
        course: courseTwo,
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      courseTwo = await CourseModel.findOne({
        where: { id: courseTwo.id },
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

      for (let i = 0; i < 10; i++) {
        const examTwo = await ExamModel.create({
          name: `Exam ${i}`,
          exam_date: parseInt(new Date().getTime().toString()) + 1000 * (i + 1),
          course: courseTwo,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
        }).save();

        courseTwo.exams.push(examTwo);
      }

      await courseTwo.save();

      const result = await examService.getUpcomingExamsByUser(user);

      result.forEach((course) => {
        course.exams.forEach((exam) => {
          delete exam.examDate;
        });
      });

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    it('should return an empty array if course is archived, but exams are present', async () => {
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

      const result = await examService.getUpcomingExamsByUser(user);

      expect(result).toEqual([]);
    });

    it('should return an empty array if course is not archived, but exams are not present', async () => {
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

      const result = await examService.getUpcomingExamsByUser(user);

      expect(result).toEqual([]);
    });
  });

  describe('getExamById', () => {
    it('should return an exam by id', async () => {
      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      const foundExam = await examService.getExamById(exam.id);

      expect(foundExam).toBeDefined();
      expect(foundExam).toMatchSnapshot();
    });

    it('should return undefined if the exam is not found', async () => {
      await expect(examService.getExamById(1)).rejects.toThrow(
        'Exam not found',
      );
    });
  });

  describe('getGradedSubmissionsByUser', () => {
    it('should return graded submissions for a specific user', async () => {
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

      for (let i = 0; i < 10; i++) {
        const exam = await ExamModel.create({
          name: `Exam ${i}`,
          exam_date: 1_000_000_000 + i,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
          course: course,
          grades_released_at: parseInt(new Date().getTime().toString()),
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

        studentUser.submissions.push(submission);
      }
      await studentUser.save();

      const result = await examService.getGradedSubmissionsByUser(user);

      result.forEach((student) => {
        student.exams.forEach((exam) => {
          delete exam.examReleasedAt;
        });
      });

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    it('should return an empty array if no graded submissions are found', async () => {
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
        user,
        student_id: 1,
      }).save();

      const result = await examService.getGradedSubmissionsByUser(user);

      expect(result).toEqual([]);
    });

    it('should return an empty array if exams submissions grades are not released', async () => {
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
        user,
        student_id: 1,
      }).save();

      const course = await CourseModel.create({
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

      for (let i = 0; i < 10; i++) {
        const exam = await ExamModel.create({
          name: `Exam ${i}`,
          exam_date: 1_000_000_000 + i,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
          course: course,
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

        studentUser.submissions.push(submission);
      }
      await studentUser.save();

      const result = await examService.getGradedSubmissionsByUser(user);

      expect(result).toEqual([]);
    });

    it('should return an empty array if course is archived', async () => {
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
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
        is_archived: true,
      }).save();

      let studentUser = await StudentUserModel.create({
        user,
        student_id: 1,
      }).save();

      studentUser = await StudentUserModel.findOne({
        where: { id: studentUser.id },
        relations: ['submissions'],
      });

      for (let i = 0; i < 10; i++) {
        const exam = await ExamModel.create({
          name: `Exam ${i}`,
          exam_date: 1_000_000_000 + i,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
          course: course,
          grades_released_at: parseInt(new Date().getTime().toString()),
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

        studentUser.submissions.push(submission);
      }
      await studentUser.save();

      const result = await examService.getGradedSubmissionsByUser(user);

      expect(result).toEqual([]);
    });
  });

  describe('getGradedExamsByCourseId', () => {
    it('should throw an error if the course is not found', async () => {
      await expect(examService.getGradedExamsByCourseId(1)).rejects.toThrow(
        'Course not found',
      );
    });

    it('should return graded exams by course id', async () => {
      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      for (let i = 0; i < 10; i++) {
        const exam = await ExamModel.create({
          name: `Exam ${i}`,
          exam_date: 1_000_000_000 + i,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
          course,
          grades_released_at: parseInt(new Date().getTime().toString()),
        }).save();

        course.exams.push(exam);
      }
      await course.save();

      const result = await examService.getGradedExamsByCourseId(course.id);

      result.forEach((exam) => {
        delete exam.grades_released_at;
      });

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    it('No graded exams should be returned if the course has no exams', async () => {
      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      const result = await examService.getGradedExamsByCourseId(course.id);

      expect(result).toEqual([]);
    });

    it('No graded exams should be returned if the grade release date is older than three months from the current date', async () => {
      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      for (let i = 0; i < 10; i++) {
        const exam = await ExamModel.create({
          name: `Exam ${i}`,
          exam_date: 1_000_000_000 + i,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
          course,
          grades_released_at: 1_000,
        }).save();

        course.exams.push(exam);
      }
      await course.save();

      const result = await examService.getGradedExamsByCourseId(course.id);

      expect(result).toEqual([]);
    });
  });

  describe('getUpcomingExamsByCourseId', () => {
    it('should return upcoming exams by course id', async () => {
      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
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

      const result = await examService.getUpcomingExamsByCourseId(course.id);

      result.forEach((exam) => {
        delete exam.exam_date;
      });

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    it('should throw an error if the course is not found', async () => {
      await expect(examService.getUpcomingExamsByCourseId(1)).rejects.toThrow(
        'Course not found',
      );
    });

    it('should return an empty array if no upcoming exams are found', async () => {
      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      const result = await examService.getUpcomingExamsByCourseId(course.id);

      expect(result).toEqual([]);
    });

    it('should return an empty array if the exams are in the past', async () => {
      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['exams'],
      });

      for (let i = 0; i < 10; i++) {
        const exam = await ExamModel.create({
          name: `Exam ${i}`,
          exam_date: 1_000,
          course,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          questions: {},
        }).save();

        course.exams.push(exam);
      }
      await course.save();

      const result = await examService.getUpcomingExamsByCourseId(course.id);

      expect(result).toEqual([]);
    });
  });

  describe('getExamGradedSubmissionByUser', () => {
    it('should throw an error if the exam is not found', async () => {
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
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await expect(
        examService.getExamGradedSubmissionByUser(1, user, course.id),
      ).rejects.toThrow('Exam not found');
    });

    it('should throw an error if the course is archived for exam', async () => {
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
        is_archived: true,
      }).save();

      await StudentUserModel.create({
        user,
        student_id: 1,
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

      await expect(
        examService.getExamGradedSubmissionByUser(exam.id, user, course.id),
      ).rejects.toThrow('Exam not found');
    });

    it('should throw an error if the user submission is not found', async () => {
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

      await StudentUserModel.create({
        user,
        student_id: 1,
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

      await expect(
        examService.getExamGradedSubmissionByUser(exam.id, user, course.id),
      ).rejects.toThrow('User submission not found');
    });

    it('should return graded submission for user', async () => {
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

      const result = await examService.getExamGradedSubmissionByUser(
        exam.id,
        user,
        course.id,
      );

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });
  });

  describe('getGradedSubmissionFilePathBySubmissionId', () => {
    it('should return the graded submission file path by submission id', async () => {
      const submission = await SubmissionModel.create({
        exam: null,
        student: null,
        answers: {},
        score: 100,
        document_path: 'path/to/file',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const filePath =
        await examService.getGradedSubmissionFilePathBySubmissionId(
          submission.id,
        );

      expect(filePath).toEqual(submission.document_path);
    });

    it('should throw error if the submission is not found', async () => {
      await expect(
        examService.getGradedSubmissionFilePathBySubmissionId(1),
      ).rejects.toThrow('Submission not found');
    });

    it('should throw error if the submission has negative score (ungraded)', async () => {
      const submission = await SubmissionModel.create({
        exam: null,
        student: null,
        answers: {},
        score: -1,
        document_path: 'path/to/file',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await expect(
        examService.getGradedSubmissionFilePathBySubmissionId(submission.id),
      ).rejects.toThrow('Submission not found');
    });

    it('should throw error if the submission has no document path', async () => {
      const submission = await SubmissionModel.create({
        exam: null,
        student: null,
        answers: {},
        score: 100,
        document_path: '',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await expect(
        examService.getGradedSubmissionFilePathBySubmissionId(submission.id),
      ).rejects.toThrow('Submission not found');
    });
  });

  describe('releaseGrades', () => {
    it('should release grades for an exam', async () => {
      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      const exam = await ExamModel.create({
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

      await examService.releaseGrades(exam.id);

      const updatedExam = await ExamModel.findOne({
        where: { id: exam.id },
      });

      expect(updatedExam.grades_released_at).toBeDefined();
    });

    it('should throw exam not found error when course is archived', async () => {
      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
        is_archived: true,
      }).save();

      const exam = await ExamModel.create({
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

      await expect(examService.releaseGrades(exam.id)).rejects.toThrow(
        'Exam not found',
      );
    });

    it('should throw an error when the exam is not found', async () => {
      await expect(examService.releaseGrades(1)).rejects.toThrow(
        'Exam not found',
      );
    });
  });

  describe('updateGrade', () => {
    it('should update the grade for a submission', async () => {
      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
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

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        user,
        student_id: 1,
      }).save();

      const submission = await SubmissionModel.create({
        exam,
        student: studentUser,
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

      await examService.updateGrade(exam.id, course.id, submission.id, 100);

      const updatedSubmission = await SubmissionModel.findOne({
        where: { id: submission.id },
      });

      expect(updatedSubmission).toBeDefined();
      expect(updatedSubmission.score).toEqual(100);
    });

    it('should update the grade for a submission with decimal score', async () => {
      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
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

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        user,
        student_id: 1,
      }).save();

      const submission = await SubmissionModel.create({
        exam,
        student: studentUser,
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

      await examService.updateGrade(exam.id, course.id, submission.id, 33.375);

      const updatedSubmission = await SubmissionModel.findOne({
        where: { id: submission.id },
      });

      expect(updatedSubmission).toBeDefined();
      expect(updatedSubmission.score).toEqual(33.375);
    });

    it('should throw an error if the submission is not found', async () => {
      await expect(examService.updateGrade(1, 1, 1, 100)).rejects.toThrow(
        'Submission not found',
      );
    });

    it('should throw an error if course is archived', async () => {
      let course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
        is_archived: true,
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

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        user,
        student_id: 1,
      }).save();

      const submission = await SubmissionModel.create({
        exam,
        student: studentUser,
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

      await expect(
        examService.updateGrade(exam.id, course.id, submission.id, 100),
      ).rejects.toThrow('Submission not found');
    });
  });

  describe('uploadExamSubmissions', () => {
    it('should throw an error if answerKey or submissions file is not provided', async () => {
      await expect(
        examService.uploadExamSubmissions(1, null, null),
      ).rejects.toThrow('Answer key and submission file are required');
    });

    it('should throw an error if the exam is not found', async () => {
      const answerKeyFile = [
        {
          mimetype: 'application/pdf',
          buffer: Buffer.from(''),
        } as Express.Multer.File,
      ];

      const submissionsFile = [
        {
          mimetype: 'application/pdf',
          buffer: Buffer.from(''),
        } as Express.Multer.File,
      ];

      await expect(
        examService.uploadExamSubmissions(1, answerKeyFile, submissionsFile),
      ).rejects.toThrow('Exam not found');
    });

    it('should throw an error if the files are not PDFs', async () => {
      const answerKeyFile = [
        {
          mimetype: 'application/png',
          buffer: Buffer.from(''),
        } as Express.Multer.File,
      ];

      const submissionsFile = [
        {
          mimetype: 'application/png',
          buffer: Buffer.from(''),
        } as Express.Multer.File,
      ];

      await expect(
        examService.uploadExamSubmissions(1, answerKeyFile, submissionsFile),
      ).rejects.toThrow('Exam files are invalid, make sure they are PDFs');
    });

    it('should throw an error if the exam has been processed before', async () => {
      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
        exam_folder: 'path',
      }).save();

      const answerKeyFile = [
        {
          mimetype: 'application/pdf',
          buffer: Buffer.from(''),
        } as Express.Multer.File,
      ];

      const submissionsFile = [
        {
          mimetype: 'application/pdf',
          buffer: Buffer.from(''),
        } as Express.Multer.File,
      ];

      await expect(
        examService.uploadExamSubmissions(
          exam.id,
          answerKeyFile,
          submissionsFile,
        ),
      ).rejects.toThrow('Exam files have already been uploaded');
    });

    it('should save files and update exam record with the file path', async () => {
      let exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      const answerKeyFile = [
        {
          mimetype: 'application/pdf',
          buffer: Buffer.from(''),
        } as Express.Multer.File,
      ];

      const submissionsFile = [
        {
          mimetype: 'application/pdf',
          buffer: Buffer.from(''),
        } as Express.Multer.File,
      ];

      sinon.stub(fs, 'mkdirSync').returns({
        on: sinon.stub(),
      } as any);

      sinon.stub(fs, 'writeFileSync').returns({
        on: sinon.stub(),
      } as any);

      await examService.uploadExamSubmissions(
        exam.id,
        answerKeyFile,
        submissionsFile,
      );

      sinon.assert.calledTwice(fs.mkdirSync as sinon.SinonStub);
      sinon.assert.calledTwice(fs.writeFileSync as sinon.SinonStub);

      exam = await ExamModel.findOne({
        where: { id: exam.id },
      });

      expect(exam.exam_folder).toBeDefined();
      expect(exam.exam_folder).not.toBeNull();

      sinon.restore();
    });
  });

  describe('createExamSubmission', () => {
    it('should throw an error if the exam is not found', async () => {
      await expect(
        examService.createExamSubmission(1, 1, {
          answers: {},
          documentPath: 'path',
          score: 2,
        }),
      ).rejects.toThrow('Exam not found');
    });

    it('should create a submission for an exam when student record is found', async () => {
      let exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      await StudentUserModel.create({
        user: null,
        student_id: 1,
      }).save();

      await examService.createExamSubmission(exam.id, 1, {
        answers: {},
        documentPath: 'path',
        score: 2,
      });

      const studentUser = await StudentUserModel.findOne({
        where: { student_id: 1 },
        relations: ['submissions'],
      });

      delete studentUser.submissions[0].created_at;
      delete studentUser.submissions[0].updated_at;

      expect(studentUser).toMatchSnapshot();

      exam = await ExamModel.findOne({
        where: { id: exam.id },
        relations: ['submissions'],
      });

      delete exam.submissions[0].created_at;
      delete exam.submissions[0].updated_at;

      expect(exam).toMatchSnapshot();
    });

    it('should create a submission for an exam when student record is not found', async () => {
      let exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      await examService.createExamSubmission(exam.id, 1, {
        answers: {},
        documentPath: 'path',
        score: 2,
      });

      exam = await ExamModel.findOne({
        where: { id: exam.id },
        relations: ['submissions', 'submissions.student'],
      });

      delete exam.submissions[0].created_at;
      delete exam.submissions[0].updated_at;

      expect(exam).toMatchSnapshot();
    });
  });

  describe('retrieveSubmissionsByExamId', () => {
    it('should return submissions for an exam with student id and grade', async () => {
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

      const csvStream = await examService.retrieveSubmissionsByExamId(exam.id);

      // Convert the stream to plain text
      const result = await new Promise<string>((resolve, reject) => {
        let data = '';
        csvStream.on('data', (chunk) => {
          data += chunk;
        });
        csvStream.on('end', () => {
          resolve(data);
        });
        csvStream.on('error', (err) => {
          reject(err);
        });
      });

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    it('should return only headers if no submissions are present', async () => {
      const exam = await ExamModel.create({
        name: 'Exam',
        exam_date: 1_000_000_000,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      const csvStream = await examService.retrieveSubmissionsByExamId(exam.id);

      // Convert the stream to plain text
      const result = await new Promise<string>((resolve, reject) => {
        let data = '';
        csvStream.on('data', (chunk) => {
          data += chunk;
        });
        csvStream.on('end', () => {
          resolve(data);
        });
        csvStream.on('error', (err) => {
          reject(err);
        });
      });

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });
  });
});
