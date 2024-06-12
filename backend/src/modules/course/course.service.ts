import { Injectable } from '@nestjs/common';
import { CourseModel } from './entities/course.entity';
import { UserModel } from '../user/entities/user.entity';
import {
  CourseArchivedException,
  CourseNotFoundException,
  InvalidInviteCodeException,
  UnidentifiedException,
  UniqueConstraintException,
} from '../../common/errors';
import { CourseUserModel } from './entities/course-user.entity';

@Injectable()
export class CourseService {
  /**
   * Search for courses based on user id
   * @param user_id {number} - User id
   * @returns {Promise<CourseUserModel[]>} - CourseUserModel[] promise
   */
  public async findAllCoursesById(user_id: number): Promise<CourseUserModel[]> {
    const courses: CourseUserModel[] = await CourseUserModel.find({
      where: { user: { id: user_id } },
      relations: ['user', 'course'],
    });
    return courses;
  }

  /**
   * Create a new course
   * @param course {CourseModel} - Course id
   * @returns {Promise<boolean>} - Promise boolean (success/failure)
   */
  public async create(course: CourseModel): Promise<boolean> {
    try {
      await course.save();
      return true;
    } catch (error) {
      if (error.code === '23505') {
        // unique constraint violation
        throw new UniqueConstraintException();
      } else {
        throw new UnidentifiedException();
      }
    }
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
      where: { course: { id: cid }, user: { id: userId } },
      relations: ['course', 'user'],
    });

    if (!userCourse) {
      return userCourse;
    } else if (userCourse.course.is_archived) {
      throw new CourseArchivedException();
    }

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
