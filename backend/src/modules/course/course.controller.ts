import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
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
  CourseRoleException,
  InvalidInviteCodeException,
  SemesterNotFoundException,
  UserNotFoundException,
} from '../../common/errors';
import { CourseRoleGuard } from '../../guards/course-role.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRoleEnum, CourseRoleEnum } from '../../enums/user.enum';
import { CourseCreateDto } from './dto/course-create.dto';
import { SystemRoleGuard } from '../../guards/system-role.guard';
import { PageOptionsDto } from '../../dto/page-options.dto';
import { ExamService } from '../exam/exam.service';
import { EditCourseGuard } from '../../guards/edit-course.guard';
import { CourseEditDto } from './dto/course-edit.dto';
import { CourseArchiveDto } from './dto/course-archive.dto';
import { CourseAnalyticsResponseInterface } from '../../../src/common/interfaces';

@Controller('course')
export class CourseController {
  /**
   * Constructor of CourseController
   * @param courseService {CourseService} - instance of CourseService
   * @param examService {ExamService} - instance of ExamService
   */
  constructor(
    private readonly courseService: CourseService,
    private readonly examService: ExamService,
  ) {}

  /**
   * Create new course using CourseCreateDto (pass in JSON)
   * @param res {Response} - Response object
   * @param course {CourseCreateDto} - user entered fields for course creation
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.PROFESSOR)
  @Post('/create')
  async createCourse(
    @Res() res: Response,
    @Body(new ValidationPipe()) userData: CourseCreateDto,
    @User() user: UserModel,
  ): Promise<Response> {
    try {
      await this.courseService.createCourse(userData, user);
      return res.status(HttpStatus.OK).send({
        message: 'ok',
      });
    } catch (e) {
      if (e instanceof SemesterNotFoundException) {
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

  /**
   * Get course analytics
   * @param res {Response} - Response object
   * @param cid {number} - Course id
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  @Get('/:cid/analytics')
  async getCourseAnalytics(
    @Res() res: Response,
    @Param('cid', ParseIntPipe) cid: number,
  ): Promise<Response> {
    try {
      const analytics: CourseAnalyticsResponseInterface =
        await this.courseService.getCourseAnalytics(cid);
      return res.status(HttpStatus.OK).send(analytics);
    } catch (e) {
      console.error(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message,
      });
    }
  }

  /**
   * Get exams with submissions disputes by course id
   * @param res {Response} - Response object
   * @param cid {number} - Course id
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  @Get('/:cid/exams_submissions_disputes')
  async getExamsSubmissionsDisputes(
    @Res() res: Response,
    @Param('cid', ParseIntPipe) cid: number,
  ): Promise<Response> {
    try {
      const examsSubmissionsDisputes =
        await this.courseService.getExamsWithSubmissionsDisputesByCourseId(cid);
      return res.status(HttpStatus.OK).send(examsSubmissionsDisputes);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message,
      });
    }
  }

  /**
   * Delete member from course
   * @param res {Response} - Response object
   * @param cid {number} - Course id
   * @param uid {number} - User id
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  @Delete('/:cid/member/:uid')
  async removeStudentFromCourse(
    @Res() res: Response,
    @Param('cid', ParseIntPipe) cid: number,
    @Param('uid', ParseIntPipe) uid: number,
  ): Promise<Response> {
    try {
      await this.courseService.removeStudentFromCourse(cid, uid);
      return res.status(HttpStatus.OK).send({
        message: 'ok',
      });
    } catch (e) {
      if (
        e instanceof CourseNotFoundException ||
        e instanceof UserNotFoundException
      ) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: e.message,
        });
      } else if (e instanceof CourseRoleException) {
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

  /**
   * Get the number of courses in the system that are not archived
   * @param res Parameter {Response} - Response object
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get('/all/count')
  async getAllCoursesCount(@Res() res: Response): Promise<Response> {
    try {
      const count = await this.courseService.getAllCoursesCount();
      return res.status(HttpStatus.OK).send({ count });
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message,
      });
    }
  }

  /**
   * Get all courses
   * @param res {Response} - Response object
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get('/all')
  async getAllCourses(@Res() res: Response): Promise<Response> {
    try {
      const courses = await this.courseService.getAllCourses();
      return res.status(HttpStatus.OK).send(courses);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message,
      });
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
   * Get course by id and return limited course information for security purposes
   * @param res {Response} - Response object
   * @param cid {number} - Course id
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard)
  @Get('/:cid/public')
  async getPublicCourseInformation(
    @Res() res: Response,
    @Param('cid', ParseIntPipe) cid: number,
  ): Promise<Response> {
    const course = await this.courseService.getCourseById(cid);

    if (!course) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: ERROR_MESSAGES.courseController.courseNotFound,
      });
    } else {
      const coursePartial = {
        id: course.id,
        course_code: course.course_code,
        course_name: course.course_name,
        section_name: course.section_name,
      };

      return res.status(HttpStatus.OK).send(coursePartial);
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

  /**
   * Get course members
   * @param res {Response} - Response object
   * @param cid {number} - Course id
   * @param pageOptionsDto {PageOptionsDto} - Page options
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  @Get('/:cid/members')
  async getCourseMembers(
    @Res() res: Response,
    @Param('cid', ParseIntPipe) cid: number,
    @Query(new ValidationPipe()) pageOptionsDto: PageOptionsDto,
  ): Promise<Response> {
    try {
      const course = await this.courseService.getCourseMembers(
        cid,
        pageOptionsDto,
      );

      return res.status(HttpStatus.OK).send(course);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message,
      });
    }
  }

  /**
   * Get exams by course id
   * @param res {Response} - Response object
   * @param cid {number} - Course id
   * @param pageOptionsDto {PageOptionsDto} - Page options
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA, CourseRoleEnum.STUDENT)
  @Get('/:cid/exams')
  async getExamsByCourseId(
    @Res() res: Response,
    @Param('cid', ParseIntPipe) cid: number,
    @Query(new ValidationPipe()) pageOptionsDto: PageOptionsDto,
  ): Promise<Response> {
    try {
      const exams = await this.examService.getExamsByCourseId(
        cid,
        pageOptionsDto,
      );

      return res.status(HttpStatus.OK).send(exams);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message,
      });
    }
  }

  /**
   * Get upcoming exams by course id
   * @param res {Response} - Response object
   * @param cid {number} - Course id
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA, CourseRoleEnum.STUDENT)
  @Get('/:cid/exams/upcoming')
  async getUpcomingExamsByCourseId(
    @Res() res: Response,
    @Param('cid', ParseIntPipe) cid: number,
  ): Promise<Response> {
    try {
      const exams = await this.examService.getUpcomingExamsByCourseId(cid);

      if (exams.length === 0) {
        return res.status(HttpStatus.NO_CONTENT).send({
          message: ERROR_MESSAGES.examController.examsNotFound,
        });
      }

      return res.status(HttpStatus.OK).send(exams);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message,
      });
    }
  }

  /**
   * Get graded exams by course id
   * @param res {Response} - Response object
   * @param cid {number} - Course id
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA, CourseRoleEnum.STUDENT)
  @Get('/:cid/exams/graded')
  async getGradedExamsByCourseId(
    @Res() res: Response,
    @Param('cid', ParseIntPipe) cid: number,
  ): Promise<Response> {
    try {
      const exams = await this.examService.getGradedExamsByCourseId(cid);

      if (exams.length === 0) {
        return res.status(HttpStatus.NO_CONTENT).send({
          message: ERROR_MESSAGES.examController.noGradedExamsFound,
        });
      }

      return res.status(HttpStatus.OK).send(exams);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message,
      });
    }
  }

  /**
   * Edit course
   * @param res {Response} - Response object
   * @param cid {number} - Course id
   * @param courseData }CourseEditDto} - Course data
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, EditCourseGuard)
  @Roles(CourseRoleEnum.PROFESSOR)
  @Patch('/:cid')
  async editCourse(
    @Res() res: Response,
    @Param('cid', ParseIntPipe) cid: number,
    @Body(new ValidationPipe()) courseData: CourseEditDto,
  ): Promise<Response> {
    try {
      await this.courseService.editCourse(cid, courseData);

      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (e) {
      if (e instanceof SemesterNotFoundException) {
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

  /**
   * Archive course
   * @param res {Response} - Response object
   * @param cid Param {number} - Course id
   * @param body {CourseArchiveDto} - Archive body
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, EditCourseGuard)
  @Roles(CourseRoleEnum.PROFESSOR)
  @Patch('/:cid/archive')
  async archiveCourse(
    @Res() res: Response,
    @Param('cid', ParseIntPipe) cid: number,
    @Body(new ValidationPipe()) body: CourseArchiveDto,
  ): Promise<Response> {
    try {
      await this.courseService.archiveCourse(cid, body.archive);

      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message,
      });
    }
  }
}
