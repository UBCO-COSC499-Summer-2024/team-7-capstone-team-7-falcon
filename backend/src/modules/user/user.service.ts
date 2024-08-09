import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserModel } from './entities/user.entity';
import { OAuthGoogleUserPayload, UserRoleCount } from '../../common/interfaces';
import {
  EmailNotVerifiedException,
  EmployeeIdAlreadyExistsException,
  InvalidAuthMethodException,
  StudentIdAlreadyExistsException,
  UserAlreadyExistsException,
  UserNotFoundException,
  UserStudentEmployeeFieldException,
} from '../../common/errors';
import { AuthTypeEnum, UserRoleEnum } from '../../enums/user.enum';
import { EmployeeUserModel } from './entities/employee-user.entity';
import { StudentUserModel } from './entities/student-user.entity';
import { UserEditDto } from './dto/user-edit.dto';
import { CourseUserModel } from '../course/entities/course-user.entity';
import { UserCreateDto } from '../auth/dto/user-create.dto';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';
import { ERROR_MESSAGES } from '../../common';
import { TokenTypeEnum } from '../../enums/token-type.enum';
import { MailService } from '../mail/mail.service';
import { PageDto } from '../../dto/page.dto';
import { PageOptionsDto } from '../../dto/page-options.dto';
import { PageMetaDto } from '../../dto/page-meta.dto';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS: number = 10;

  /**
   * Constructor
   * @param tokenService {TokenService} - The token service
   * @param mailService {MailService} - The mail service
   */
  constructor(
    @Inject(forwardRef(() => TokenService))
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

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
   * @params userPayload {OAuthGoogleUserPayload | UserCreateDto} - User payload
   * @params method {string} - Auth method
   * @returns {Promise<UserModel>} - User object
   */
  public async findOrCreateUser(
    userPayload: OAuthGoogleUserPayload | UserCreateDto,
    method: string,
  ): Promise<UserModel> {
    let user: UserModel = await UserModel.findOne({
      where: { email: userPayload.email },
    });

    const currentTime = parseInt(new Date().getTime().toString());

    if (method === AuthTypeEnum.GOOGLE_OAUTH) {
      if (!user) {
        // Override userPayload type to OAuthGoogleUserPayload as we know it's a Google OAuth user
        userPayload = userPayload as OAuthGoogleUserPayload;

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
    } else if (method === AuthTypeEnum.EMAIL) {
      // Logic to check if user already exists is different here as OAuth logic is different
      if (user) {
        throw new UserAlreadyExistsException();
      }

      // Override userPayload type to UserCreateDto as we know it's an email user
      userPayload = userPayload as UserCreateDto;

      if (!userPayload.employee_id && !userPayload.student_id) {
        throw new UserStudentEmployeeFieldException();
      }

      if (userPayload.employee_id) {
        const employeeUser: EmployeeUserModel = await this.findEmployeeNumber(
          userPayload.employee_id,
        );

        if (employeeUser) {
          throw new EmployeeIdAlreadyExistsException();
        }
      }

      if (userPayload.student_id) {
        const studentUser: StudentUserModel = await this.findStudentNumber(
          userPayload.student_id,
        );

        if (studentUser) {
          throw new StudentIdAlreadyExistsException();
        }
      }

      const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(userPayload.password, salt);

      const token = await this.tokenService.createToken();
      user = await UserModel.create({
        email: userPayload.email,
        first_name: userPayload.first_name,
        last_name: userPayload.last_name,
        auth_type: AuthTypeEnum.EMAIL,
        password: hashedPassword,
        tokens: [token],
        created_at: currentTime,
        updated_at: currentTime,
      }).save();

      // Create employee number record
      if (userPayload.employee_id) {
        const employeeUserRecord: EmployeeUserModel =
          await EmployeeUserModel.create({
            employee_id: userPayload.employee_id,
            user,
          }).save();

        user.employee_user = employeeUserRecord;
      }

      // Create student number record
      if (userPayload.student_id) {
        const studentUserRecord: StudentUserModel =
          await StudentUserModel.create({
            student_id: userPayload.student_id,
            user,
          }).save();

        user.student_user = studentUserRecord;
      }

      await user.save();

      await this.mailService.sendUserConfirmation(user, token.token);

      return user;
    }
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
        await user.student_user.save();
      } else {
        user.student_user.student_id = userEditBody.student_id;
        await user.student_user.save();
      }
    }
    await user.save();

    return user;
  }

  /**
   * Verifies user email
   * @param user {UserModel} - User object
   */
  async verifyEmail(user: UserModel): Promise<void> {
    user.email_verified = true;
    await user.save();
  }

  /**
   * Sends a reset password email
   * @param email {string} - User email
   */
  async sendResetPasswordEmail(email: string): Promise<void> {
    const user = await this.findUserByEmail(email, { relations: ['tokens'] });

    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.auth_type !== AuthTypeEnum.EMAIL) {
      throw new InvalidAuthMethodException(
        ERROR_MESSAGES.authController.notSupportedAuthType,
      );
    }

    if (!user.email_verified) {
      throw new EmailNotVerifiedException();
    }

    const token = await this.tokenService.createToken(
      TokenTypeEnum.PASSWORD_RESET,
    );

    user.tokens.push(token);

    await user.save();

    await this.mailService.sendPasswordReset(user, token.token);
  }

  /**
   * Resets user password
   * @param user {UserModel} - User object
   * @param password {string} - New password
   */
  async resetPassword(user: UserModel, password: string): Promise<void> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();
  }

  /**
   * Finds a user by email
   * @param email {string} - User email
   * @param additionalProps {any} [optional] - Additional properties for the query
   * @returns {Promise<UserModel>} - User object
   */
  async findUserByEmail(
    email: string,
    additionalProps?: any,
  ): Promise<UserModel> {
    return await UserModel.findOne({ where: { email }, ...additionalProps });
  }

  /**
   * Finds a user by token
   * @param pageOptionsDto {PageOptionsDto} - Page options
   * @returns {Promise<PageDto<any>>} - PageDto<any> promise
   */
  async getAllUsers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserModel>> {
    const queryBuilder = UserModel.createQueryBuilder('user');

    queryBuilder
      .select([
        'user.id',
        'user.email',
        'user.first_name',
        'user.last_name',
        'user.auth_type',
        'user.avatar_url',
        'user.role',
      ])
      .orderBy('user.id', 'ASC')
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
   * Counts all users by role in the system
   * @returns {Promise<UserRoleCount[]>} - UserRoleCount[] promise
   */
  async countAllUsersByRole(): Promise<UserRoleCount[]> {
    const queryBuilder = UserModel.createQueryBuilder('user');

    const usersCount = await queryBuilder
      .select(['user.role as role', 'COUNT(user.id) as count'])
      .groupBy('user.role')
      .getRawMany();

    return usersCount;
  }

  /**
   * Updates user role
   * @param uid {number} - User id
   * @param role {UserRoleEnum} - User role
   * @returns {Promise<void>} - Void promise
   */
  async updateUserRole(uid: number, role: UserRoleEnum): Promise<void> {
    const user = await this.getUserById(uid);

    if (!user) {
      throw new UserNotFoundException();
    }

    user.role = role;
    await user.save();
  }

  /**
   * Deletes user profile picture
   * @param uid {number} - User id
   * @returns {Promise<void>} - Void promise
   */
  async deleteProfilePicture(uid: number): Promise<void> {
    const user = await this.getUserById(uid);

    if (!user) {
      throw new UserNotFoundException();
    }

    user.avatar_url = null;
    await user.save();
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
