import {
  Controller,
  HttpStatus,
  ParseIntPipe,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import {
  Body,
  Get,
  Param,
  Patch,
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
  EmployeeIdAlreadyExistsException,
  StudentIdAlreadyExistsException,
  UserNotFoundException,
} from '../../common/errors';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get list of courses by student id
   * @param res {Response} - Response object
   * @param user_id {number} - User id
   * @returns {Promise<Response>} - Response
   */
  @UseGuards(AuthGuard)
  @Get('/all')
  async findAllCoursesById(
    @Res() res: Response,
    @Query('user_id') user_id: number,
    @User() user: UserModel,
  ) {
    if (user.id !== user_id) {
      return res.status(HttpStatus.FORBIDDEN).send({
        message: ERROR_MESSAGES.userController.editForbidden,
      });
    }

    const courses = await this.userService.findAllCoursesById(user_id);
    if (!courses) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: ERROR_MESSAGES.courseController.courseSearchFailed,
      });
    } else {
      return res.status(HttpStatus.OK).send(courses);
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
    if (user.id !== uid && user.role !== UserRoleEnum.ADMIN) {
      return res.status(HttpStatus.FORBIDDEN).send({
        message: ERROR_MESSAGES.userController.editForbidden,
      });
    }

    try {
      await this.userService.editUser(uid, body);
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
