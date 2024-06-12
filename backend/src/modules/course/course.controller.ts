import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../../guards/auth.guard';
import { CourseService } from './course.service';
import { ERROR_MESSAGES } from '../../common';
import { CourseEnrollDto } from './dto/course-enroll.dto';
import { UserModel } from '../user/entities/user.entity';
import { User } from '../../decorators/user.decorator';
import {
  CourseArchivedException,
  CourseNotFoundException,
  InvalidInviteCodeException,
} from '../../common/errors';
import { CourseRoleGuard } from '../../guards/course-role.guard';
import { Roles } from '../../decorators/roles.decorator';
import { CourseRoleEnum } from '../../enums/user.enum';
import { CourseModel } from './entities/course.entity';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  /**
   * Get list of courses by student id
   * @param res {Response} - Response object
   * @param user_id {number} - User id
   * @returns {Promise<Response>} - Response
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA, CourseRoleEnum.STUDENT)
  @Get('')
  async findAllCoursesById(
    @Res() res: Response,
    @Query('user_id') user_id: number,
  ) {
    // need to add validation that the querying student's id matches the user_id being searched
    const courses = await this.courseService.findAllCoursesById(user_id);
    if (!courses) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: ERROR_MESSAGES.courseController.courseSearchFailed,
      });
    } else {
      return res.status(HttpStatus.OK).send(courses);
    }
  }

  /**
   * Create new course using CourseModel (pass in JSON)
   * @param res {Response} - Response object
   * @param course {CourseModel} - Course object
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  @Post('/create')
  async create(@Res() res: Response, @Body() courseData: CourseModel) {
    const course = await this.courseService.create(courseData);

    if (!course) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: ERROR_MESSAGES.courseController.courseCreationFailed,
      });
    } else {
      return res.status(HttpStatus.OK).send({ message: 'ok' });
    }
  }

  /**
   * Get course by id
   * @param res {Response} - Response object
   * @param cid {number} - Course id
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA, CourseRoleEnum.STUDENT)
  @Get('/:cid')
  async getCourseById(
    @Res() res: Response,
    @Param('cid', ParseIntPipe) cid: number,
  ): Promise<Response> {
    const course = await this.courseService.getCourseById(cid);

    if (!course) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: ERROR_MESSAGES.courseController.courseNotFound,
      });
    } else {
      return res.status(HttpStatus.OK).send(course);
    }
  }

  /**
   * Enroll in a course
   * @param res {Response} - Response object
   * @param cid {number} - Course id
   * @param body {CourseEnrollDto} - Enroll body
   * @param user {UserModel} - User object
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard)
  @Post('/:cid/enroll')
  async enroll(
    @Res() res: Response,
    @Param('cid', ParseIntPipe) cid: number,
    @Body(new ValidationPipe()) body: CourseEnrollDto,
    @User() user: UserModel,
  ): Promise<Response> {
    try {
      await this.courseService.enroll(cid, user, body.invite_code);
      return res.status(HttpStatus.OK).send({
        message: 'ok',
      });
    } catch (e) {
      if (e instanceof CourseNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: e.message,
        });
      } else if (e instanceof InvalidInviteCodeException) {
        return res.status(HttpStatus.BAD_REQUEST).send({
          message: e.message,
        });
      } else if (e instanceof CourseArchivedException) {
        return res.status(HttpStatus.UNAUTHORIZED).send({
          message: e.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: e.message,
        });
      }
    }
  }
}
