import {
  Controller,
  HttpStatus,
  ParseIntPipe,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common/decorators';
import { Response } from 'express';
import { UserService } from './user.service';
import { ERROR_MESSAGES } from '../../common';
import { AuthGuard } from '../../guards/auth.guard';
import { SystemRoleGuard } from '../../guards/system-role.guard';
import { UserRoleEnum } from '../../enums/user.enum';
import { Roles } from '../../decorators/roles.decorator';
import { UserEditDto } from './dto/user-edit.dto';
import { UserModel } from './entities/user.entity';
import { User } from '../../decorators/user.decorator';
import {
  EmailNotVerifiedException,
  EmployeeIdAlreadyExistsException,
  InvalidAuthMethodException,
  StudentIdAlreadyExistsException,
  TokenExpiredException,
  TokenInvalidException,
  UserNotFoundException,
} from '../../common/errors';
import { UserEmailDto } from './dto/user-email.dto';
import { UserPasswordResetDto } from './dto/user-password-reset.dto';
import { TokenService } from '../token/token.service';
import { PageOptionsDto } from '../../dto/page-options.dto';
import { UserRoleDto } from './dto/user-role.dto';

@Controller('user')
export class UserController {
  /**
   * Constructor
   * @param tokenService {TokenService} - Token service
   * @param userService {UserService} - User service
   */
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  /**
   * Get list of courses by user id
   * @param res {Response} - Response object
   * @param user_id {number} - User id
   * @returns {Promise<Response>} - Response
   */
  @UseGuards(AuthGuard)
  @Get('/courses')
  async findAllCoursesByUserId(
    @Res() res: Response,
    @User() user: UserModel,
  ): Promise<Response> {
    const courses = await this.userService.findUserCoursesById(user.id);

    if (!courses) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: ERROR_MESSAGES.courseController.coursesNotFound,
      });
    } else {
      return res.status(HttpStatus.OK).send(courses);
    }
  }

  /**
   * Get all users in the system
   * @param res {Response} - Response object
   * @param pageOptionsDto {PageOptionsDto} - Page options object
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get('/all')
  async getAllUsers(
    @Res() res: Response,
    @Query(new ValidationPipe()) pageOptionsDto: PageOptionsDto,
  ): Promise<Response> {
    try {
      const users = await this.userService.getAllUsers(pageOptionsDto);
      return res.status(HttpStatus.OK).send(users);
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: e.message });
    }
  }

  /**
   * Get count of all users in the system by system role
   * @param res {Response} - Response object
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get('/all/count')
  async getAllUsersCount(@Res() res: Response): Promise<Response> {
    try {
      const count = await this.userService.countAllUsersByRole();
      return res.status(HttpStatus.OK).send(count);
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: e.message });
    }
  }

  /**
   * Change user role
   * @param res {Response} - Response object
   * @param uid {number} - User id
   * @param body {object} - Object with role field
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Patch('/:uid/change_role')
  async updateRole(
    @Res() res: Response,
    @Param('uid', ParseIntPipe) uid: number,
    @Body(new ValidationPipe()) body: UserRoleDto,
  ): Promise<Response> {
    try {
      await this.userService.updateUserRole(uid, body.userRole);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: ERROR_MESSAGES.userController.userNotFound,
        });
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: e.message });
      }
    }
  }

  /**
   * Delete user profile picture
   * @param res {Response} - Response object
   * @param uid {number} - User id
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Delete('/:uid/delete_profile_picture')
  async deleteProfilePicture(
    @Res() res: Response,
    @Param('uid', ParseIntPipe) uid: number,
  ): Promise<Response> {
    try {
      await this.userService.deleteProfilePicture(uid);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: ERROR_MESSAGES.userController.userNotFound,
        });
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: e.message });
      }
    }
  }

  /**
   * Get information about user
   * @param req {Request} - Request object
   * @param res {Response} - Response object
   * @returns {Promise<Response>} - User object
   */
  @UseGuards(AuthGuard)
  @Get('/')
  async get(@Request() req: Request, @Res() res: Response): Promise<Response> {
    // req needs to be casted to any because the user property is not defined in the Request type by built in NestJS
    const user = await this.userService.getUserById((req as any).user.id);

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: ERROR_MESSAGES.userController.userNotFound,
      });
    } else {
      return res.status(HttpStatus.OK).send(user);
    }
  }

  /**
   * Get user by id
   * @param res {Response} - Response object
   * @param uid {number} - User id
   * @returns {Promise<Response>} - User object
   */
  @Get('/:uid')
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  async getById(
    @Res() res: Response,
    @Param('uid', ParseIntPipe) uid: number,
  ): Promise<Response> {
    const user = await this.userService.getUserById(uid);

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: ERROR_MESSAGES.userController.userNotFound,
      });
    } else {
      return res.status(HttpStatus.OK).send(user);
    }
  }

  /**
   * Request to reset password by email
   * @param res {Response} - Response object
   * @param body {UserEmailDto} - User email object
   * @returns {Promise<Response>} - Response object
   */
  @Post('/password/request_reset')
  async resetPassword(
    @Res() res: Response,
    @Body(new ValidationPipe()) body: UserEmailDto,
  ): Promise<Response> {
    try {
      await this.userService.sendResetPasswordEmail(body.email);
      return res.status(HttpStatus.OK).send({ message: 'ok' });
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: e.message,
        });
      } else if (
        e instanceof InvalidAuthMethodException ||
        e instanceof EmailNotVerifiedException
      ) {
        return res.status(HttpStatus.FORBIDDEN).send({
          message: e.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          error: e.message,
        });
      }
    }
  }

  /**
   * Confirm password reset
   * @param res {Response} - Response object
   * @param body {UserPasswordResetDto} - User password reset object
   * @returns {Promise<Response>} - Response object
   */
  @Post('/password/reset')
  async resetPasswordConfirm(
    @Res() res: Response,
    @Body(new ValidationPipe()) body: UserPasswordResetDto,
  ): Promise<Response> {
    try {
      const userToken = await this.tokenService.findTokenAndUser(body.token);
      await this.userService.resetPassword(userToken.user, body.password);
      // token is null as we don't want to send duplicate request to Database to find token again
      await this.tokenService.update(null, userToken);
      return res.status(HttpStatus.OK).send({ message: 'ok' });
    } catch (e) {
      if (e instanceof TokenInvalidException) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: e.message });
      } else if (e instanceof TokenExpiredException) {
        return res.status(HttpStatus.FORBIDDEN).send({ message: e.message });
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: e.message });
      }
    }
  }

  /**
   * Edit user account information
   * @param res {Response} - Response object
   * @param uid {number} - User id
   * @param body {UserEditDto} - User edit object
   * @param user {UserModel} - User object
   * @returns {Promise<Response>} - Response object
   */
  @Patch('/:uid')
  @UseGuards(AuthGuard)
  async edit(
    @Res() res: Response,
    @Param('uid', ParseIntPipe) uid: number,
    @Body(new ValidationPipe()) body: UserEditDto,
    @User() user: UserModel,
  ): Promise<Response> {
    if (user.id !== uid && user.role !== UserRoleEnum.ADMIN && uid !== -1) {
      return res.status(HttpStatus.FORBIDDEN).send({
        message: ERROR_MESSAGES.userController.editForbidden,
      });
    }

    try {
      await this.userService.editUser(uid === -1 ? user.id : uid, body);
      return res.status(HttpStatus.OK).send({ message: 'ok' });
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: ERROR_MESSAGES.userController.userNotFound,
        });
      } else if (e instanceof EmployeeIdAlreadyExistsException) {
        return res.status(HttpStatus.CONFLICT).send({
          message: ERROR_MESSAGES.userController.employeeIdAlreadyExists,
        });
      } else if (e instanceof StudentIdAlreadyExistsException) {
        return res.status(HttpStatus.CONFLICT).send({
          message: ERROR_MESSAGES.userController.studentIdAlreadyExists,
        });
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: e.message });
      }
    }
  }
}
