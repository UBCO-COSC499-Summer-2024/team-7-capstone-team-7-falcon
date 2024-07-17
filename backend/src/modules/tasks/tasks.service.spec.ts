import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from '../course/course.service';
import { TasksService } from './tasks.service';
import {
  TestConfigModule,
  TestTypeOrmModule,
} from '../../../test/utils/testUtils';
import { CourseModel } from '../course/entities/course.entity';
import { SemesterModel } from '../semester/entities/semester.entity';
import { ExamModel } from '../exam/entities/exam.entity';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

describe('TasksService', () => {
  let tasksService: TasksService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [TasksService, CourseService],
      imports: [TestTypeOrmModule, TestConfigModule],
    }).compile();

    tasksService = moduleRef.get(TasksService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('archiveCourses', () => {
    it('should log a warning that no courses were archived', async () => {
      const loggerWarnSpy = jest.spyOn(tasksService.logger, 'warn');

      await tasksService.archiveCourses();

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Starting to look for courses to archive',
      );
      expect(loggerWarnSpy).toHaveBeenCalledWith('Archived 0 courses');
    });

    it('should log a warning that course was archived and existing folder deleted', async () => {
      const loggerWarnSpy = jest.spyOn(tasksService.logger, 'warn');

      const semester = await SemesterModel.create({
        name: 'Spring 2024',
        starts_at:
          parseInt(new Date().getTime().toString()) - 1000 * 60 * 60 * 24 * 390,
        ends_at:
          parseInt(new Date().getTime().toString()) - 1000 * 60 * 60 * 24 * 366,
        created_at: parseInt(new Date('2024-01-01').getTime().toString()),
        updated_at: parseInt(new Date('2024-01-01').getTime().toString()),
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        semester,
        section_name: '001',
        invite_code: '123',
      }).save();

      await ExamModel.create({
        name: `Exam`,
        exam_date: 1_000_000_000,
        course,
        exam_folder: 'exam-folder',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      const examFolderPath = join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'uploads',
        'exams',
        'processed_submissions',
        'exam-folder',
      );

      if (!existsSync(examFolderPath)) {
        mkdirSync(examFolderPath, { recursive: true });
      }

      await tasksService.archiveCourses();

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Starting to look for courses to archive',
      );
      expect(loggerWarnSpy).toHaveBeenCalledWith('Archived 1 courses');
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Deleting exams folders for course 1',
      );
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Deleted exam folder exam-folder',
      );
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Finished looking for courses to archive',
      );
    });

    it('should log that course was archived, but non existing exam-folder was not deleted and no log message is produced', async () => {
      const loggerWarnSpy = jest.spyOn(tasksService.logger, 'warn');

      const semester = await SemesterModel.create({
        name: 'Spring 2024',
        starts_at:
          parseInt(new Date().getTime().toString()) - 1000 * 60 * 60 * 24 * 390,
        ends_at:
          parseInt(new Date().getTime().toString()) - 1000 * 60 * 60 * 24 * 366,
        created_at: parseInt(new Date('2024-01-01').getTime().toString()),
        updated_at: parseInt(new Date('2024-01-01').getTime().toString()),
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        semester,
        section_name: '001',
        invite_code: '123',
      }).save();

      await ExamModel.create({
        name: `Exam`,
        exam_date: 1_000_000_000,
        course,
        exam_folder: 'exam-folder',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      await tasksService.archiveCourses();

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Starting to look for courses to archive',
      );
      expect(loggerWarnSpy).toHaveBeenCalledWith('Archived 1 courses');
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Deleting exams folders for course 1',
      );
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Finished looking for courses to archive',
      );
    });
  });
});
