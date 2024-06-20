import { Injectable } from '@nestjs/common';
import { CourseModel } from './entities/course.entity';
import { UserModel } from '../user/entities/user.entity';
import {
  CourseNotFoundException,
  InvalidInviteCodeException,
  SemesterNotFoundException,
} from '../../common/errors';
import { CourseUserModel } from './entities/course-user.entity';
import { CourseCreateDto } from './dto/course-create.dto';
import { SemesterModel } from '../semesters/entities/semester.entity';
import { v4 as uuidv4 } from 'uuid';
import { CourseRoleEnum } from '../../enums/user.enum';
import { PageOptionsDto } from '../../dto/page-options.dto';
import { PageMetaDto } from '../../dto/page-meta.dto';
import { PageDto } from '../../dto/page.dto';
import { ERROR_MESSAGES } from '../../common';

@Injectable()
export class CourseService {
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
}
