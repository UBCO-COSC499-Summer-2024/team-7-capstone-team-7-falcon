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

describe('ExamService', () => {
  let examService: ExamService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [ExamService, CourseService, UserService, TokenService],
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
});
