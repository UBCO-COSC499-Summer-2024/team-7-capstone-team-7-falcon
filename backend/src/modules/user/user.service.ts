import { Injectable } from '@nestjs/common';
import { UserModel } from './entities/user.entity';
import { OAuthGoogleUserPayload } from '../../common/interfaces';
import {
  EmployeeIdAlreadyExistsException,
  StudentIdAlreadyExistsException,
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../../common/errors';
import { AuthTypeEnum } from '../../enums/user.enum';
import { EmployeeUserModel } from './entities/employee-user.entity';
import { StudentUserModel } from './entities/student-user.entity';
import { UserEditDto } from './dto/user-edit.dto';
import { CourseUserModel } from '../course/entities/course-user.entity';

@Injectable()
export class UserService {
  /**
   * Search for courses based on user id
   * @param user_id {number} - User id
   * @returns {Promise<CourseUserModel[]>} - CourseUserModel[] promise
   */
  public async findUserCoursesById(
    user_id: number,
  ): Promise<CourseUserModel[]> {
    const courses: CourseUserModel[] = await CourseUserModel.find({
      where: { user: { id: user_id }, course: { is_archived: false } },
      relations: ['user', 'course'],
    });

    if (!courses || courses.length === 0) {
      return null;
    }

    return courses;
  }

  /**
   * Returns a user by id
   * @param id {number} - User id
   * @returns {Promise<UserModel>} - User object
   */
  public async getUserById(id: number): Promise<UserModel> {
    const user: UserModel = await UserModel.findOne({
      where: { id },
      relations: ['employee_user', 'student_user'],
    });

    if (!user) {
      return null;
    }

    // Remove password from user object as it is sensitive information
    delete user.password;

    return user;
  }

  /**
   * Returns a user by email
   * @param email {string} - User email
   * @returns {Promise<UserModel>} - User object
   */
  public async findOrCreateUser(
    userPayload: OAuthGoogleUserPayload,
    method: string,
  ): Promise<UserModel> {
    if (method === AuthTypeEnum.GOOGLE_OAUTH) {
      let user: UserModel = await UserModel.findOne({
        where: { email: userPayload.email },
      });

      if (!user) {
        const currentTime = parseInt(new Date().getTime().toString());

        user = new UserModel();
        user.email = userPayload.email;
        user.first_name = userPayload.given_name;
        user.last_name = userPayload.family_name;
        user.avatar_url = userPayload.picture;
        user.auth_type = AuthTypeEnum.GOOGLE_OAUTH;
        user.created_at = currentTime;
        user.updated_at = currentTime;

        await user.save();
      }

      if (user && user.auth_type !== AuthTypeEnum.GOOGLE_OAUTH) {
        throw new UserAlreadyExistsException();
      }

      return user;
    }

    throw new Error('Invalid auth method');
  }

  /**
   * Edit user details
   * @param uid {number} - User id
   * @param userEditBody {UserEditDto} - User edit body
   * @returns {Promise<UserModel>} - User object
   */
  public async editUser(
    uid: number,
    userEditBody: UserEditDto,
  ): Promise<UserModel> {
    const user: UserModel = await UserModel.findOne({
      where: { id: uid },
      relations: ['employee_user', 'student_user'],
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    if (userEditBody.first_name) {
      user.first_name = userEditBody.first_name;
    }

    if (userEditBody.last_name) {
      user.last_name = userEditBody.last_name;
    }

    // Create or update employee number
    if (userEditBody.employee_id) {
      const employeeUser: EmployeeUserModel = await this.findEmployeeNumber(
        userEditBody.employee_id,
      );

      if (employeeUser && employeeUser.user.id !== uid) {
        throw new EmployeeIdAlreadyExistsException();
      }

      let employeeUserRecord: EmployeeUserModel;

      if (!user.employee_user) {
        employeeUserRecord = await EmployeeUserModel.create({
          employee_id: userEditBody.employee_id,
          user,
        }).save();
        user.employee_user = employeeUserRecord;
      } else {
        user.employee_user.employee_id = userEditBody.employee_id;
        await user.employee_user.save();
      }
    }

    // Create or update student number
    if (userEditBody.student_id) {
      const studentUser: StudentUserModel = await this.findStudentNumber(
        userEditBody.student_id,
      );

      if (studentUser && studentUser.user.id !== uid) {
        throw new StudentIdAlreadyExistsException();
      }

      let studentUserRecord: StudentUserModel;

      if (!user.student_user) {
        studentUserRecord = await StudentUserModel.create({
          student_id: userEditBody.student_id,
          user,
        }).save();
        user.student_user = studentUserRecord;
        user.student_user.save();
      } else {
        user.student_user.student_id = userEditBody.student_id;
        user.student_user.save();
      }
    }
    await user.save();

    return user;
  }

  /**
   * Checks if an employee number exists in the database
   * @param employeeId {number} - Employee number
   * @param userId {number} - User id
   * @returns {Promise<EmployeeUserModel>} - Employee user object
   */
  private async findEmployeeNumber(
    employeeId: number,
  ): Promise<EmployeeUserModel> {
    return await EmployeeUserModel.findOne({
      where: { employee_id: employeeId },
      relations: ['user'],
    });
  }

  /**
   * Checks if a student number exists in the database
   * @param studentId {number} - Student number
   * @returns {Promise<StudentUserModel>} - Student user object
   */
  private async findStudentNumber(
    studentId: number,
  ): Promise<StudentUserModel> {
    return await StudentUserModel.findOne({
      where: { student_id: studentId },
      relations: ['user'],
    });
  }
}
