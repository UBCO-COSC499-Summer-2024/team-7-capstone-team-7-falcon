import { Injectable } from '@nestjs/common';
import { CourseModel } from './entities/course.entity';
import { UserModel } from '../user/entities/user.entity';
import {
  CourseArchivedException,
  CourseNotFoundException,
  FailToCreateCourseException,
  InvalidInviteCodeException,
  SemesterNotFoundException,
} from '../../common/errors';
import { CourseUserModel } from './entities/course-user.entity';
import { CourseCreateDto } from './dto/course-create.dto';
import { SemesterModel } from '../semesters/entities/semester.entity';

@Injectable()
export class CourseService {
  /**
   * Create a new course
   * @param course {CourseCreateDto} - user inputed fields required for course creation
   * @returns {Promise<boolean>} - Promise boolean (success/failure)
   */
  public async create(course: CourseCreateDto): Promise<boolean> {
    const semester = await SemesterModel.findOne({
      where: { id: course.semester_id },
    });

    if (!semester) {
      throw new SemesterNotFoundException();
    }

    const newCourse = CourseModel.create({
      course_code: course.course_code,
      course_name: course.course_name,
      created_at: Date.now(),
      updated_at: Date.now(),
      is_archived: false,
      section_name: course.section_name,
      invite_code: generateRandomString(8),
      semester: semester,
    });

    await newCourse.save();
    if (!newCourse) {
      throw new FailToCreateCourseException();
    }
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

function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}
