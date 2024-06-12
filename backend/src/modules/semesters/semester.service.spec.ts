import { Test, TestingModule } from '@nestjs/testing';
import { SemesterService } from './semester.service';
import {
  TestConfigModule,
  TestTypeOrmModule,
} from '../../../test/utils/testUtils';
import { SemesterCreateDto } from './dto/semester-create.dto';
import { SemesterModel } from './entities/semester.entity';

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

  describe('createSemester', () => {
    it('should throw an error if the start date is after the end date', async () => {
      const semesterDetails: SemesterCreateDto = {
        name: 'Test Semester',
        starts_at: parseInt(new Date('2021-01-01').getTime().toString()),
        ends_at: parseInt(new Date('2020-01-01').getTime().toString()),
      };

      await expect(
        semesterService.createSemester(semesterDetails),
      ).rejects.toThrow('Start date must be before end date');
    });

    it('should throw an error if the start date is behind two days', async () => {
      const semesterDetails: SemesterCreateDto = {
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

      const semesterDetails: SemesterCreateDto = {
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
});
