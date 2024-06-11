import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { CourseService } from './course.service';
import { ERROR_MESSAGES } from '../../common';
import { CourseEnrollDto } from './dto/course-enroll.dto';
import { UserModel } from '../user/entities/user.entity';
import { User } from '../../decorators/user.decorator';
import {
  CourseNotFoundException,
  InvalidInviteCodeException,
} from '../../common/errors';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  /**
   * Get course by id
   * @param res {Response} - Response object
   * @param cid {number} - Course id
   * @returns {Promise<Response>} - Course object
   */
  @UseGuards(AuthGuard)
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
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: e.message,
        });
      }
    }
  }
}
