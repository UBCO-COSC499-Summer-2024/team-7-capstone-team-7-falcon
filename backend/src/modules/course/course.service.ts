import { Injectable } from '@nestjs/common';
import { CourseModel } from './entities/course.entity';
import { UserModel } from '../user/entities/user.entity';
import {
  CourseNotFoundException,
  InvalidInviteCodeException,
} from '../../common/errors';
import { CourseUserModel } from './entities/course-user.entity';

@Injectable()
export class CourseService {
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
