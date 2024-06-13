import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import {
  TestConfigModule,
  TestTypeOrmModule,
} from '../../../test/utils/testUtils';
import { CourseModel } from './entities/course.entity';
import { UserModel } from '../user/entities/user.entity';
import { CourseUserModel } from './entities/course-user.entity';
import { CourseRoleEnum } from '../../enums/user.enum';
import { CourseCreateDto } from './dto/course-create.dto';
import { SemesterModel } from '../semesters/entities/semester.entity';
import { validate } from 'class-validator';

describe('CourseService', () => {
  let courseService: CourseService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [CourseService],
      imports: [TestTypeOrmModule, TestConfigModule],
    }).compile();

    courseService = moduleRef.get<CourseService>(CourseService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('getCourseById', () => {
    it('should return null if course is not found', async () => {
      const course = await courseService.getCourseById(1);
      expect(course).toBeNull();
    });

    it('should return course if course is found', async () => {
      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      const result = await courseService.getCourseById(course.id);
      expect(result).toMatchSnapshot();
    });
  });

  describe('getUserByCourseAndUserId', () => {
    it('should return null if user is not enrolled in course', async () => {
      const courseUser = await courseService.getUserByCourseAndUserId(1, 1);
      expect(courseUser).toBeNull();
    });

    it('should return course user if user is enrolled in course', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
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

      const result = await courseService.getUserByCourseAndUserId(
        course.id,
        user.id,
      );

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    it('should return null if course is archived', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
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

      const userModel = await courseService.getUserByCourseAndUserId(
        course.id,
        user.id,
      );
      expect(userModel).toBeNull();
    });
  });

  describe('enroll', () => {
    it('should throw CourseNotFoundException if course is not found', async () => {
      await expect(courseService.enroll(1, null, '123')).rejects.toThrow(
        'Course not found',
      );
    });

    it('should throw InvalidInviteCodeException if invite code is invalid', async () => {
      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await expect(
        courseService.enroll(course.id, null, '456'),
      ).rejects.toThrow('Invalid invite code');
    });

    it('should not enroll user if user is already enrolled', async () => {
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
      }).save();

      await CourseUserModel.create({
        user,
        course,
      }).save();

      const result = await courseService.enroll(course.id, user, '123');

      expect(result).toBeUndefined();
    });

    it('should enroll user if user is not already enrolled', async () => {
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
      }).save();

      const result = await courseService.enroll(course.id, user, '123');
      expect(result).toBeUndefined();

      const courseUser = await CourseUserModel.findOne({
        where: { user, course },
        relations: ['user', 'course'],
      });

      expect(courseUser).toBeDefined();
      expect(courseUser).toMatchSnapshot();
    });
  });

  describe('createCourse', () => {
    it('verifies course creation and some fields', async () => {
      const semesterData = await SemesterModel.create({
        name: 'Spring 2024',
        starts_at: parseInt(new Date('2021-01-01').getTime().toString()),
        ends_at:
          parseInt(new Date('2021-01-01').getTime().toString()) +
          1000 * 60 * 60 * 24 * 90,
        created_at: parseInt(new Date('2021-01-01').getTime().toString()),
        updated_at: parseInt(new Date('2021-01-01').getTime().toString()),
      }).save();

      const courseDto = new CourseCreateDto();
      courseDto.course_code = 'CS1010101';
      courseDto.course_name = 'Introduction to Computer Science';
      courseDto.semester_id = semesterData.id;
      courseDto.section_name = '001';

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await courseService.createCourse(courseDto, user);

      const createdCourse = await CourseModel.findOne({
        where: { course_code: 'CS1010101' },
      });

      expect(createdCourse).toBeDefined();
      expect(createdCourse.course_code).toBe('CS1010101');
      expect(createdCourse.course_name).toBe(
        'Introduction to Computer Science',
      );
    });

    it('should throw SemesterNotFound Exception', async () => {
      const courseDto = new CourseCreateDto();
      courseDto.course_code = 'CS101';
      courseDto.course_name = 'Introduction to Computer Science';
      courseDto.semester_id = 100;
      courseDto.section_name = '001';

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await expect(courseService.createCourse(courseDto, user)).rejects.toThrow(
        'Semester not found',
      );
    });

    it('should throw validate error', async () => {
      const courseDto = new CourseCreateDto();
      courseDto.course_code = 'CS101';
      courseDto.course_name = 'Introduction to Computer Science';
      courseDto.semester_id = 100;
      courseDto.section_name = '001';

      const errors = await validate(courseDto);

      expect(errors.length > 0);
    });
  });
});
