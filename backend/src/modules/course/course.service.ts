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

@Injectable()
export class CourseService {
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
      relations: ['users'],
    });

    if (!course) {
      throw new CourseNotFoundException();
    }

    if (course.invite_code !== invite_code) {
      throw new InvalidInviteCodeException();
    }

    const isEnrolled = course.users.some((u) => u.id === user.id);

    if (isEnrolled) {
      return;
    }

    await CourseUserModel.create({
      user,
      course,
    }).save();

    return;
  }
}
