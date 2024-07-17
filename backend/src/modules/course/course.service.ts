import { Injectable } from '@nestjs/common';
import { CourseModel } from './entities/course.entity';
import { UserModel } from '../user/entities/user.entity';
import {
  CourseNotFoundException,
  CourseRoleException,
  InvalidInviteCodeException,
  SemesterNotFoundException,
  UserNotFoundException,
} from '../../common/errors';
import { CourseUserModel } from './entities/course-user.entity';
import { CourseCreateDto } from './dto/course-create.dto';
import { SemesterModel } from '../semester/entities/semester.entity';
import { v4 as uuidv4 } from 'uuid';
import { CourseRoleEnum } from '../../enums/user.enum';
import { PageOptionsDto } from '../../dto/page-options.dto';
import { PageMetaDto } from '../../dto/page-meta.dto';
import { PageDto } from '../../dto/page.dto';
import { ERROR_MESSAGES } from '../../common';
import { CourseEditDto } from './dto/course-edit.dto';
import { CourseDetailsInterface } from 'src/common/interfaces';
import { SubmissionModel } from '../exam/entities/submission.entity';
import { ExamModel } from '../exam/entities/exam.entity';
import { CourseAnalyticsResponseInterface } from '../../common/interfaces';
import { LessThan } from 'typeorm';

@Injectable()
export class CourseService {
  private readonly ONE_YEAR: number = 31_556_952_000;

  /**
   * Remove member from course
   * @param cid {number} - Course id
   * @param uid {number} - User id
   * @returns {Promise<void>} - Promise object
   */
  async removeMemberFromCourse(cid: number, uid: number): Promise<void> {
    const userCourse = await this.getUserByCourseAndUserId(cid, uid);

    if (!userCourse) {
      throw new CourseNotFoundException(
        ERROR_MESSAGES.courseController.userNotEnrolledInCourse,
      );
    }

    await CourseUserModel.delete({
      course: { id: cid },
      user: userCourse.user,
    });
  }

  /**
   * Get number of courses in the system that are not archived
   * @returns {Promise<number>} - Promise number
   */
  async getAllCoursesCount(): Promise<number> {
    return await CourseModel.count({ where: { is_archived: false } });
  }

  /**
   * Get all courses
   * @returns {Promise<CourseDetailsInterface[]>} - Promise array of CourseDetailsInterface
   */
  async getAllCourses(): Promise<CourseDetailsInterface[]> {
    const queryBuilder = CourseModel.createQueryBuilder('course');

    queryBuilder
      .select(['course.id', 'course.course_code', 'semester.name'])
      .addSelect('COUNT(course_user.id)', 'members')
      .leftJoin('course.semester', 'semester')
      .leftJoin('course.users', 'course_user')
      .where('course.is_archived = false')
      .andWhere('course.semester.id = semester.id')
      .groupBy('course.id')
      .addGroupBy('semester.name')
      .orderBy('course.id');

    let courses = await queryBuilder.getRawMany();

    courses = await Promise.all(
      courses.map(async (courseDetails) => {
        const courseCreator = await CourseUserModel.findOne({
          where: {
            course: { id: courseDetails.id },
            course_role: CourseRoleEnum.PROFESSOR,
          },
          relations: ['user', 'course'],
        });

        courseDetails.creator = {
          firstName: courseCreator.user.first_name,
          lastName: courseCreator.user.last_name,
        };

        return {
          courseId: courseDetails.course_id,
          courseCode: courseDetails.course_course_code,
          semesterName: courseDetails.semester_name,
          members: courseDetails.members,
          creator: courseDetails.creator,
        };
      }),
    );

    return courses as CourseDetailsInterface[];
  }

  /**
   * Create a new course
   * @param course {CourseCreateDto} - user inputed fields required for course creation
   * @returns {Promise<boolean>} - Promise boolean (success/failure)
   */
  public async createCourse(
    course: CourseCreateDto,
    user: UserModel,
  ): Promise<boolean> {
    const semester = await SemesterModel.findOne({
      where: { id: course.semester_id },
    });

    if (!semester) {
      throw new SemesterNotFoundException();
    }

    const createdAt: number = parseInt(new Date().getTime().toString());

    const newCourse = await CourseModel.create({
      ...course,
      invite_code: uuidv4(),
      created_at: createdAt,
      updated_at: createdAt,
      semester,
    }).save();

    await CourseUserModel.create({
      course_role: CourseRoleEnum.PROFESSOR,
      user: user,
      course: newCourse,
    }).save();

    return true;
  }

  /**
   * Edit course
   * @param courseId {number} - Course id
   * @param courseData {CourseEditDto} - Course data
   * @returns {Promise<void>} - Promise object
   */
  public async editCourse(
    courseId: number,
    courseData: CourseEditDto,
  ): Promise<void> {
    const semester = await SemesterModel.findOne({
      where: { id: courseData.semesterId },
    });

    if (!semester) {
      throw new SemesterNotFoundException();
    }

    await CourseModel.update(
      { id: courseId },
      {
        course_code: courseData.courseCode,
        course_name: courseData.courseName,
        semester,
        invite_code: courseData.inviteCode,
        updated_at: parseInt(new Date().getTime().toString()),
      },
    );
  }

  /**
   * Returns a course by id
   * @param id {number} - Course id
   * @returns {Promise<CourseModel>} - Course object
   */
  public async getCourseById(id: number): Promise<CourseModel> {
    const course: CourseModel = await CourseModel.findOne({
      where: { id },
    });

    return course;
  }

  /**
   * Get user by course and user id
   * @param cid {number} - Course id
   * @param userId {number} - User id
   * @returns {Promise<CourseUserModel>} - Course user object
   */
  public async getUserByCourseAndUserId(
    cid: number,
    userId: number,
  ): Promise<CourseUserModel> {
    const userCourse = await CourseUserModel.findOne({
      where: { course: { id: cid, is_archived: false }, user: { id: userId } },
      relations: ['course', 'user'],
    });
    return userCourse;
  }

  /**
   * Enroll in a course
   * @param cid {number} - Course id
   * @param user {UserModel} - User object
   * @param invite_code {string} - Invite code
   * @returns {Promise<void>} - Promise object
   */
  public async enroll(
    cid: number,
    user: UserModel,
    invite_code: string,
  ): Promise<void> {
    const course: CourseModel = await CourseModel.findOne({
      where: { id: cid },
      relations: ['users', 'users.user'],
    });

    if (!course) {
      throw new CourseNotFoundException();
    }

    if (course.invite_code !== invite_code) {
      throw new InvalidInviteCodeException();
    }

    let isEnrolled = false;

    course.users.forEach((courseUser) => {
      if (courseUser.user.id === user.id) {
        isEnrolled = true;
      }
    });

    if (isEnrolled) {
      return;
    }

    await CourseUserModel.create({
      user,
      course,
    }).save();

    return;
  }

  /**
   * Get course members
   * @param cid {number} - Course id
   * @param pageOptionsDto {PageOptionsDto} - Page options
   * @returns {Promise<PageDto<any>>} - Page dto object
   */
  async getCourseMembers(
    cid: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<any>> {
    const queryBuilder = CourseUserModel.createQueryBuilder('course_user');

    // NOTE: We are exluding any sensitive information from the query
    queryBuilder
      .select(['course_user.id', 'course_user.course_role'])
      .addSelect([
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.email',
        'user.avatar_url',
      ])
      .leftJoin('course_user.user', 'user')
      .where('course_user.course_id = :cid', { cid })
      .orderBy('user.last_name', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const usersCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      itemCount: usersCount,
      pageOptionsDto,
    });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Get exams by course id
   * @param cid {number} - Course id
   * @param archive {boolean} - Archive flag
   * @returns {Promise<void>} - Promise object
   */
  async archiveCourse(cid: number, archive: boolean): Promise<void> {
    await CourseModel.update({ id: cid }, { is_archived: archive });
  }

  /**
   * Delete student from course
   * @param cid {number} - Course id
   * @param uid {number} - User id
   * @returns {Promise<void>} - Promise object
   */
  async removeStudentFromCourse(cid: number, uid: number): Promise<void> {
    const course = await CourseModel.findOne({
      where: {
        id: cid,
        is_archived: false,
      },
      relations: ['users', 'users.user', 'users.user.student_user', 'exams'],
    });

    if (!course) {
      throw new CourseNotFoundException();
    }

    const courseUser = course.users.find(
      (courseUser) => courseUser.user.id === uid,
    );

    if (!courseUser) {
      throw new UserNotFoundException(
        ERROR_MESSAGES.courseController.userNotEnrolledInCourse,
      );
    }

    if (courseUser.course_role !== CourseRoleEnum.STUDENT) {
      throw new CourseRoleException(
        ERROR_MESSAGES.courseController.deleteStudentFromCourseError,
      );
    }

    course.exams.forEach(async (exam) => {
      await SubmissionModel.delete({
        exam,
        student: { id: courseUser.user.student_user.id },
      });
    });

    await CourseUserModel.delete({ id: courseUser.id });
  }

  /**
   * Get course analytics
   * @param cid {number} - Course id
   * @returns
   */
  async getCourseAnalytics(
    cid: number,
  ): Promise<CourseAnalyticsResponseInterface> {
    const [
      courseMembersSize,
      courseExamsCount,
      examSubmissionsCount,
      courseExams,
    ] = await Promise.all([
      CourseUserModel.count({
        where: { course: { id: cid, is_archived: false } },
        relations: ['course'],
      }),
      ExamModel.count({
        where: { course: { id: cid, is_archived: false } },
        relations: ['course'],
      }),
      SubmissionModel.count({
        where: { exam: { course: { id: cid, is_archived: false } } },
        relations: ['exam', 'exam.course'],
      }),
      ExamModel.find({
        where: { course: { id: cid, is_archived: false } },
        relations: [
          'course',
          'submissions',
          'submissions.student',
          'submissions.student.user',
        ],
      }),
    ]);

    const examSubmissions = courseExams.map((exam) => {
      return {
        exam: {
          id: exam.id,
          title: exam.name,
        },
        submissions: exam.submissions.map((submission) => {
          return {
            student: {
              id: submission.student.user.id,
              firstName: submission.student.user.first_name,
              lastName: submission.student.user.last_name,
              submissionScore: submission.score,
              avatarUrl: submission.student.user.avatar_url,
            },
          };
        }),
      };
    });

    return {
      courseMembersSize,
      courseExamsCount,
      examSubmissionsCount,
      examSubmissions,
    };
  }

  /**
   * Get and archive courses
   * @returns {Promise<CourseModel[]>} - Promise array of CourseModel
   */
  async getAndArchiveCourses(): Promise<CourseModel[]> {
    const courses = await CourseModel.find({
      where: {
        is_archived: false,
        semester: {
          ends_at: LessThan(
            parseInt(new Date().getTime().toString()) - this.ONE_YEAR,
          ),
        },
      },
      relations: ['exams', 'semester'],
      select: {
        id: true,
        exams: {
          exam_folder: true,
        },
      },
    });

    await Promise.all(
      courses.map(async (course) => {
        await CourseModel.update({ id: course.id }, { is_archived: true });
      }),
    );

    return courses;
  }
}
