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
import { PageOptionsDto } from '../../dto/page-options.dto';

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
});
