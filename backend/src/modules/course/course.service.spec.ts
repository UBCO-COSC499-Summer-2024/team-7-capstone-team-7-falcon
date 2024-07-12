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
import { SemesterModel } from '../semester/entities/semester.entity';
import { validate } from 'class-validator';
import { PageOptionsDto } from '../../dto/page-options.dto';
import { CourseEditDto } from './dto/course-edit.dto';
import { v4 as uuidv4 } from 'uuid';
import { ExamModel } from '../exam/entities/exam.entity';
import { StudentUserModel } from '../user/entities/student-user.entity';
import { SubmissionModel } from '../exam/entities/submission.entity';

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

  describe('getCourseMembers', () => {
    it('should return course members from first page', async () => {
      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      for (let i = 0; i < 10; i++) {
        const user = await UserModel.create({
          first_name: 'John',
          last_name: `Doe-${Math.abs(i - 1)}`,
          email: `john.doe-${i}@test.com`,
          password: 'password',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();

        await CourseUserModel.create({
          user: user,
          course,
        }).save();
      }

      const pageOptionsDto = new PageOptionsDto();
      pageOptionsDto.page = 1;
      pageOptionsDto.take = 5;

      const result = await courseService.getCourseMembers(
        course.id,
        pageOptionsDto,
      );

      expect(result).toBeDefined();

      expect(result).toMatchSnapshot();
    });

    it('should return course members from second page', async () => {
      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      for (let i = 0; i < 10; i++) {
        const user = await UserModel.create({
          first_name: 'John',
          last_name: `Doe-${Math.abs(i - 1)}`,
          email: `john.doe-${i}@test.com`,
          password: 'password',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();

        await CourseUserModel.create({
          user: user,
          course,
        }).save();
      }

      const pageOptionsDto = new PageOptionsDto();

      pageOptionsDto.page = 2;
      pageOptionsDto.take = 5;

      const result = await courseService.getCourseMembers(
        course.id,
        pageOptionsDto,
      );

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    it('should return empty array if course has no members', async () => {
      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      const pageOptionsDto = new PageOptionsDto();
      pageOptionsDto.page = 1;
      pageOptionsDto.take = 5;

      const result = await courseService.getCourseMembers(
        course.id,
        pageOptionsDto,
      );

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });
  });

  describe('editCourse', () => {
    it('should throw SemesterNotFound Exception', async () => {
      const courseEditDto = new CourseEditDto();
      courseEditDto.courseCode = 'CS101';
      courseEditDto.courseName = 'Introduction to Computer Science';
      courseEditDto.semesterId = 100;
      courseEditDto.inviteCode = uuidv4();

      await expect(courseService.editCourse(1, courseEditDto)).rejects.toThrow(
        'Semester not found',
      );
    });

    it('should edit course', async () => {
      const semester = await SemesterModel.create({
        name: 'Spring 2024',
        starts_at: parseInt(new Date('2021-01-01').getTime().toString()),
        ends_at:
          parseInt(new Date('2021-01-01').getTime().toString()) +
          1000 * 60 * 60 * 24 * 90,
        created_at: parseInt(new Date('2021-01-01').getTime().toString()),
        updated_at: parseInt(new Date('2021-01-01').getTime().toString()),
      }).save();

      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
        semester,
      }).save();

      const courseEditDto = new CourseEditDto();
      courseEditDto.courseCode = 'COSC499';
      courseEditDto.courseName = 'Capstone Project';
      courseEditDto.semesterId = semester.id;
      courseEditDto.inviteCode = uuidv4();

      await courseService.editCourse(course.id, courseEditDto);

      const updatedCourse = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['semester'],
      });

      expect(updatedCourse.invite_code).not.toBe('123');
      expect(updatedCourse.updated_at).not.toBe(1_000_000_000);

      delete updatedCourse.updated_at;
      delete updatedCourse.invite_code;

      expect(updatedCourse).toBeDefined();
      expect(updatedCourse).toMatchSnapshot();
    });
  });

  describe('archiveCourse', () => {
    it('should archive course', async () => {
      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await courseService.archiveCourse(course.id, true);

      const updatedCourse = await CourseModel.findOne({
        where: { id: course.id },
      });

      expect(updatedCourse.is_archived).toBe(true);
    });
  });

  describe('removeStudentFromCourse', () => {
    it('should throw CourseNotFoundException if course is not found', async () => {
      await expect(courseService.removeStudentFromCourse(1, 1)).rejects.toThrow(
        'Course not found',
      );
    });

    it('should throw CourseNotFoundException if course is archived', async () => {
      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
        is_archived: true,
      }).save();

      await expect(
        courseService.removeStudentFromCourse(course.id, 1),
      ).rejects.toThrow('Course not found');
    });

    it('should throw UserNotFoundException if user is not found', async () => {
      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await expect(
        courseService.removeStudentFromCourse(course.id, 1),
      ).rejects.toThrow('User is not enrolled in the course');
    });

    it('should throw CourseRoleException if user is not a student', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
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

      await expect(
        courseService.removeStudentFromCourse(course.id, user.id),
      ).rejects.toThrow(
        'User cannot be deleted from course as their role is not student',
      );
    });

    it('should throw UserNotFoundException if user is not enrolled in course', async () => {
      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      await expect(
        courseService.removeStudentFromCourse(course.id, 1),
      ).rejects.toThrow('User is not enrolled in the course');
    });

    it('should remove student from course when course has no exams', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
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
        course_role: CourseRoleEnum.STUDENT,
      }).save();

      await courseService.removeStudentFromCourse(course.id, user.id);

      const actual = await CourseUserModel.count();
      expect(actual).toBe(0);
    });

    it('should remove student from course when course has exam and student submitted submission', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const studentUser = await StudentUserModel.create({
        user,
        student_id: 12346,
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
        user: studentUser,
        course,
        course_role: CourseRoleEnum.STUDENT,
      }).save();

      let exam = await ExamModel.create({
        course,
        exam_date: 1_000_000_000,
        name: `Exam`,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        questions: {},
      }).save();

      exam = await ExamModel.findOne({
        where: { id: exam.id },
        relations: ['submissions'],
      });

      await SubmissionModel.create({
        exam,
        student: studentUser,
        answers: {},
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        document_path: 'path',
        score: -1,
      }).save();

      await courseService.removeStudentFromCourse(course.id, studentUser.id);

      const actual = await CourseUserModel.count();
      expect(actual).toBe(0);

      const actualSubmissions = await SubmissionModel.count();
      expect(actualSubmissions).toBe(0);

      const studentUserModel = await StudentUserModel.findOne({
        where: { id: studentUser.id },
        relations: ['submissions'],
      });

      expect(studentUserModel.submissions).toHaveLength(0);

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['courses'],
      });

      expect(user.courses).toHaveLength(0);

      course = await CourseModel.findOne({
        where: { id: course.id },
        relations: ['users'],
      });

      expect(course.users).toHaveLength(0);
    });
  });

  describe('getCourseAnalytics', () => {
    it('should only return courseMembersSize if course has no exams or submissions', async () => {
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

      const result = await courseService.getCourseAnalytics(course.id);

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    it('should return 0 courseMembersSize, examCount, and submissionCount if course has no submissions', async () => {
      const course = await CourseModel.create({
        course_code: 'CS101',
        course_name: 'Introduction to Computer Science',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      const result = await courseService.getCourseAnalytics(course.id);

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    it('should return courseMembersSize, examCount if course has students, exams, but no submissions', async () => {
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

      const result = await courseService.getCourseAnalytics(course.id);

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    it('should return courseMembersSize, examCount, submissionCount if course has students, exams, and submissions', async () => {
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

      const result = await courseService.getCourseAnalytics(course.id);

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });
  });
});
