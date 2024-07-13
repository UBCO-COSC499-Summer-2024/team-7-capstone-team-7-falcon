import { Test, TestingModule } from '@nestjs/testing';
import { SemesterService } from './semester.service';
import {
  TestConfigModule,
  TestTypeOrmModule,
} from '../../../test/utils/testUtils';
import { SemesterDto } from './dto/semester.dto';
import { SemesterModel } from './entities/semester.entity';
import { CourseModel } from '../course/entities/course.entity';

describe('SemesterService', () => {
  let semesterService: SemesterService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [SemesterService],
      imports: [TestTypeOrmModule, TestConfigModule],
    }).compile();

    semesterService = moduleRef.get<SemesterService>(SemesterService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('getAllSemestersLimited', () => {
    it('should return all semesters', async () => {
      const currentDate: number = parseInt(new Date().getTime().toString());

      await SemesterModel.create({
        name: 'Test Semester',
        created_at: currentDate,
        updated_at: currentDate,
        starts_at: currentDate,
        ends_at: currentDate,
      }).save();

      const semesters = await semesterService.getAllSemestersLimited();
      expect(semesters).toBeDefined();
    });

    it('should return semesters that are within the last three months', async () => {
      const currentDate: number = parseInt(new Date().getTime().toString());
      const threeMonthsAgoDate: number =
        currentDate - 1000 * 60 * 60 * 24 * 30 * 3;

      await SemesterModel.create({
        name: 'Test Semester',
        created_at: currentDate,
        updated_at: currentDate,
        starts_at: currentDate,
        ends_at: currentDate,
      }).save();

      await SemesterModel.create({
        name: 'Test Semester 2',
        created_at: threeMonthsAgoDate,
        updated_at: threeMonthsAgoDate,
        starts_at: threeMonthsAgoDate,
        ends_at: threeMonthsAgoDate,
      }).save();

      const semesters = await semesterService.getAllSemestersLimited();

      expect(semesters).toHaveLength(1);
    });

    it('should return null if no semesters are found', async () => {
      const semesters = await semesterService.getAllSemestersLimited();

      expect(semesters).toBeNull();
    });
  });

  describe('createSemester', () => {
    it('should throw an error if the start date is after the end date', async () => {
      const semesterDetails: SemesterDto = {
        name: 'Test Semester',
        starts_at: parseInt(new Date('2021-01-01').getTime().toString()),
        ends_at: parseInt(new Date('2020-01-01').getTime().toString()),
      };

      await expect(
        semesterService.createSemester(semesterDetails),
      ).rejects.toThrow('Start date must be before end date');
    });

    it('should throw an error if the start date is behind two days', async () => {
      const semesterDetails: SemesterDto = {
        name: 'Test Semester',
        starts_at: parseInt(new Date('2021-01-01').getTime().toString()),
        ends_at: parseInt(new Date('2021-01-10').getTime().toString()),
      };

      await expect(
        semesterService.createSemester(semesterDetails),
      ).rejects.toThrow('Start date must be at least two days ahead');
    });

    it('should create a semester', async () => {
      const currentDate: number = parseInt(new Date().getTime().toString());
      const sevenDaysAheadDate: number = currentDate + 1000 * 60 * 60 * 24 * 7;

      const semesterDetails: SemesterDto = {
        name: 'Test Semester',
        starts_at: currentDate,
        ends_at: sevenDaysAheadDate,
      };

      await semesterService.createSemester(semesterDetails);

      const semester = await SemesterModel.findOne({
        where: { name: semesterDetails.name },
      });

      expect(semester).toBeDefined();

      expect(semester).toMatchObject({
        name: semesterDetails.name,
        starts_at: semesterDetails.starts_at.toString(),
        ends_at: semesterDetails.ends_at.toString(),
      });
    });
  });

  describe('updateSemester', () => {
    it('should throw an error if semester does not exist', async () => {
      const semesterDetails: SemesterDto = {
        name: 'Test Semester',
        starts_at: parseInt(new Date().getTime().toString()),
        ends_at: parseInt(new Date().getTime().toString()),
      };

      await expect(
        semesterService.updateSemester(1, semesterDetails),
      ).rejects.toThrow('Semester not found');
    });

    it('should throw an error if the start date is after the end date', async () => {
      const currentDate: number = parseInt(new Date().getTime().toString());

      await SemesterModel.create({
        name: 'Test Semester',
        created_at: currentDate,
        updated_at: currentDate,
        starts_at: currentDate,
        ends_at: currentDate,
      }).save();

      const semesterDetails: SemesterDto = {
        name: 'Test Semester',
        starts_at: currentDate,
        ends_at: currentDate - 1000,
      };

      await expect(
        semesterService.updateSemester(1, semesterDetails),
      ).rejects.toThrow('Start date must be before end date');
    });

    it('should update a semester', async () => {
      const currentDate: number = parseInt(new Date().getTime().toString());

      await SemesterModel.create({
        name: 'Test Semester',
        created_at: currentDate,
        updated_at: currentDate,
        starts_at: currentDate,
        ends_at: currentDate,
      }).save();

      const semesterDetails: SemesterDto = {
        name: 'Updated Semester',
        starts_at: currentDate,
        ends_at: currentDate + 1000,
      };

      await semesterService.updateSemester(1, semesterDetails);

      const semester = await SemesterModel.findOne({
        where: { id: 1 },
      });

      expect(semester).toBeDefined();

      expect(semester.name).toBe(semesterDetails.name);
    });
  });

  describe('getSemesterById', () => {
    it('should throw an error if semester does not exist', async () => {
      await expect(semesterService.getSemesterById(1)).rejects.toThrow(
        'Semester not found',
      );
    });

    it('should return a semester', async () => {
      await SemesterModel.create({
        name: 'Test Semester',
        created_at: 1_000_000,
        updated_at: 1_000_000,
        starts_at: 1_000_000,
        ends_at: 1_000_000,
      }).save();

      const semester = await semesterService.getSemesterById(1);

      expect(semester).toBeDefined();
      expect(semester).toMatchSnapshot();
    });
  });

  describe('getAllSemesters', () => {
    it('should return all semesters', async () => {
      let semester = await SemesterModel.create({
        name: 'Test Semester',
        created_at: 1_000_000,
        updated_at: 1_000_000,
        starts_at: 1_000_000,
        ends_at: 1_000_000,
      }).save();

      semester = await SemesterModel.findOne({
        where: { id: semester.id },
        relations: ['courses'],
      });

      for (let i = 0; i < 10; i++) {
        const course = await CourseModel.create({
          course_code: 'COSC 499',
          course_name: 'Capstone Project',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          section_name: '001',
          invite_code: '123',
          semester: semester,
        }).save();

        semester.courses.push(course);
      }
      await semester.save();
      const semesters = await semesterService.getAllSemesters();
      expect(semesters).toBeDefined();

      expect(semesters).toMatchSnapshot();
    });

    it('should return an empty array if no semesters are found', async () => {
      const semesters = await semesterService.getAllSemesters();

      expect(semesters).toHaveLength(0);
    });
  });

  describe('deleteSemester', () => {
    it('should throw an error if semester does not exist', async () => {
      await expect(semesterService.deleteSemester(1)).rejects.toThrow(
        'Semester not found',
      );
    });

    it('should delete a semester', async () => {
      let semester = await SemesterModel.create({
        name: 'Test Semester',
        created_at: 1_000_000,
        updated_at: 1_000_000,
        starts_at: 1_000_000,
        ends_at: 1_000_000,
      }).save();

      await semesterService.deleteSemester(semester.id);

      semester = await SemesterModel.findOne({
        where: { id: semester.id },
      });

      expect(semester).toBeNull();
    });

    it('should delete a semester and ensure courses have null value for semester', async () => {
      let semester = await SemesterModel.create({
        name: 'Test Semester',
        created_at: 1_000_000,
        updated_at: 1_000_000,
        starts_at: 1_000_000,
        ends_at: 1_000_000,
      }).save();

      for (let i = 0; i < 10; i++) {
        await CourseModel.create({
          course_code: 'COSC 499',
          course_name: 'Capstone Project',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          section_name: '001',
          invite_code: '123',
          semester: semester,
        }).save();
      }

      await semesterService.deleteSemester(semester.id);

      semester = await SemesterModel.findOne({
        where: { id: semester.id },
        relations: ['courses'],
      });

      expect(semester).toBeNull();

      const courses = await CourseModel.find({
        relations: ['semester'],
      });

      expect(courses).toHaveLength(10);

      courses.forEach((course) => {
        expect(course.semester).toBeNull();
      });

      expect(courses).toMatchSnapshot();
    });
  });
});
