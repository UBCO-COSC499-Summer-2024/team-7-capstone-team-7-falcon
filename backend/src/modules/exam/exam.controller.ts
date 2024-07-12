import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  StreamableFile,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { Roles } from '../../decorators/roles.decorator';
import { CourseRoleEnum, UserRoleEnum } from '../../enums/user.enum';
import { AuthGuard } from '../../guards/auth.guard';
import { CourseRoleGuard } from '../../guards/course-role.guard';
import { ExamCreateDto } from './dto/exam-create.dto';
import { ExamService } from './exam.service';
import {
  ExamCreationException,
  ExamNotFoundException,
  UserNotFoundException,
  UserSubmissionNotFound,
  FileNotFoundException,
  SubmissionNotFoundException,
} from '../../common/errors';
import { User } from '../../decorators/user.decorator';
import { UserModel } from '../user/entities/user.entity';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { CourseService } from '../course/course.service';
import {
  GradedSubmissionsInterface,
  UpcomingExamsInterface,
} from '../../common/interfaces';
import { CourseUserModel } from '../course/entities/course-user.entity';
import { SystemRoleGuard } from '../../guards/system-role.guard';
import { SubmissionGradeDto } from './dto/submission-grade.dto';

@Controller('exam')
export class ExamController {
  /**
   * Constructor of ExamController
   * @param examService {ExamService} instance of ExamService
   * @param courseService {CourseService} instance of CourseService
   */
  constructor(
    private readonly examService: ExamService,
    private readonly courseService: CourseService,
  ) {}

  /**
   * Release grades for the exam
   * @param res {Response} - Response object
   * @param eid {number} - Exam id
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  @Patch('/:eid/:cid/release_grades')
  async releaseGrades(
    @Res() res: Response,
    @Param('eid', new ValidationPipe()) eid: number,
  ): Promise<Response> {
    try {
      await this.examService.releaseGrades(eid);
      return res.status(HttpStatus.OK).send({ message: 'ok' });
    } catch (e) {
      if (e instanceof ExamNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
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
   * Get exam by id
   * @param res {Response} response object
   * @param eid {number} exam id
   * @returns {Promise<Response>} response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR)
  @Get('/:cid/exam/:eid')
  async getExamById(
    @Res() res: Response,
    @Param('eid', new ValidationPipe()) eid: number,
  ): Promise<Response> {
    try {
      const exam = await this.examService.getExamById(eid);
      return res.status(HttpStatus.OK).send(exam);
    } catch (e) {
      if (e instanceof ExamNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
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
   * Create an exam for the course
   * @param res {Response} response object
   * @param cid {number} course id
   * @param examData {ExamCreateDto} exam data
   * @returns {Promise<Response>} response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR)
  @Post('/:cid/create')
  async createExam(
    @Res() res: Response,
    @Param('cid', new ValidationPipe()) cid: number,
    @Body(new ValidationPipe()) examData: ExamCreateDto,
  ): Promise<Response> {
    try {
      await this.examService.createExam(cid, examData);
      return res.status(HttpStatus.OK).send({ message: 'ok' });
    } catch (e) {
      if (e instanceof ExamCreationException) {
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
   * Get all exams for the course
   * @param res {Response} - Response object
   * @param eid {number} - Exam id
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  @Get('/:cid/:eid/submissions')
  async getExam(
    @Res() res: Response,
    @Param('eid', new ValidationPipe()) eid: number,
  ): Promise<Response> {
    try {
      const exam = await this.examService.getSubmissionsByExamId(eid);
      return res.status(HttpStatus.OK).send(exam);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message,
      });
    }
  }

  /**
   * Get upcoming exams by user
   * @param res {Response} - Response object
   * @param user {UserModel} - User object
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard)
  @Get('/upcoming')
  async getUpcomingExamsByUser(
    @Res() res: Response,
    @User() user: UserModel,
  ): Promise<Response> {
    try {
      const exams: UpcomingExamsInterface[] =
        await this.examService.getUpcomingExamsByUser(user);

      if (exams.length === 0) {
        return res.status(HttpStatus.NO_CONTENT).send({});
      }

      return res.status(HttpStatus.OK).send(exams);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message,
      });
    }
  }

  /**
   * Get graded exams submissions by user
   * @param res {Response} - Response object
   * @param user {UserModel} - User object
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard)
  @Get('/graded')
  async getGradedExamsSubmissionsByUser(
    @Res() res: Response,
    @User() user: UserModel,
  ): Promise<Response> {
    try {
      const exams: GradedSubmissionsInterface[] =
        await this.examService.getGradedSubmissionsByUser(user);

      if (exams.length === 0) {
        return res.status(HttpStatus.NO_CONTENT).send({});
      }

      return res.status(HttpStatus.OK).send(exams);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message,
      });
    }
  }

  /**
   * Get submission grade by user
   * @param res {Response} - Response object
   * @param uid {number} - User id
   * @param eid {number} - Exam id
   * @param cid {number} - Course id
   * @param user {UserModel} - User object
   * @returns {Promise<Response>} - Response object
   */
  @Get('/:eid/:cid/user/:uid/grade')
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA, CourseRoleEnum.STUDENT)
  async getSubmissionGradeByUser(
    @Res() res: Response,
    @Param('uid', new ValidationPipe()) uid: number,
    @Param('eid', new ValidationPipe()) eid: number,
    @Param('cid', new ValidationPipe()) cid: number,
    @User() user: UserModel,
  ): Promise<Response> {
    try {
      let requestedCourseUser: CourseUserModel;

      if (uid != user.id) {
        // Check if requested user exists
        requestedCourseUser = await this.courseService.getUserByCourseAndUserId(
          cid,
          uid,
        );

        if (!requestedCourseUser) {
          throw new UserNotFoundException();
        }

        // Check if the current session user is a professor or TA
        const currentUserCourseUser =
          await this.courseService.getUserByCourseAndUserId(cid, user.id);

        if (currentUserCourseUser.course_role === CourseRoleEnum.STUDENT) {
          throw new UnauthorizedException();
        }
      }

      const submission = await this.examService.getExamGradedSubmissionByUser(
        eid,
        uid != user.id ? requestedCourseUser.user : user,
        cid,
      );

      return res.status(HttpStatus.OK).send(submission);
    } catch (e) {
      if (
        e instanceof UserNotFoundException ||
        e instanceof ExamNotFoundException ||
        e instanceof UserSubmissionNotFound
      ) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: e.message,
        });
      } else if (e instanceof UnauthorizedException) {
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
   * Get graded submission by user
   * @param res {Response} - Response object
   * @param sid {number} - Submission id
   * @param uid {number} - User id
   * @param cid {number} - Course id
   * @param user {UserModel} - User object
   * @returns {Promise<StreamableFile | void>} - StreamableFile or void object
   */
  @Get('/:cid/submission/:sid/user/:uid')
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA, CourseRoleEnum.STUDENT)
  async getSubmissionByUser(
    @Res({ passthrough: true }) res: Response,
    @Param('sid', new ValidationPipe()) sid: number,
    @Param('uid', new ValidationPipe()) uid: number,
    @Param('cid', new ValidationPipe()) cid: number,
    @User() user: UserModel,
  ): Promise<StreamableFile | void> {
    try {
      // Handles the case when the requested user is not the current session user.
      // This case handles the scenario when a professor or TA is trying to download a student's submission.
      if (uid != user.id) {
        // Check if requested user exists
        const requestedCourseUser =
          await this.courseService.getUserByCourseAndUserId(cid, uid);

        if (!requestedCourseUser) {
          throw new UserNotFoundException();
        }

        // Check if the current session user is a professor or TA
        const currentUserCourseUser =
          await this.courseService.getUserByCourseAndUserId(cid, user.id);

        if (currentUserCourseUser.course_role === CourseRoleEnum.STUDENT) {
          throw new UnauthorizedException();
        }
      }

      const filePath = join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'uploads',
        'exams',
        'processed_submissions',
        await this.examService.getGradedSubmissionFilePathBySubmissionId(sid),
      );

      // Check if file exists and is accessible
      if (!existsSync(filePath)) {
        throw new FileNotFoundException();
      }

      const file = createReadStream(filePath);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="submission_${uid}.pdf"`,
      });

      return new StreamableFile(file);
    } catch (e) {
      if (
        e instanceof FileNotFoundException ||
        e instanceof SubmissionNotFoundException ||
        e instanceof UserNotFoundException
      ) {
        res.status(HttpStatus.NOT_FOUND).send({
          message: e.message,
        });
      } else if (e instanceof UnauthorizedException) {
        res.status(HttpStatus.UNAUTHORIZED).send({
          message: e.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: e.message,
        });
      }
    }
  }

  /**
   * Update grade for the submission
   * @param res {Response} - Response object
   * @param eid {number} - Exam id
   * @param cid {number} - Course id
   * @param sid {number} - Submission id
   * @param body {SubmissionGradeDto} - Submission grade data
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  @Patch('/:eid/course/:cid/submission/:sid/grade')
  async updateGrade(
    @Res() res: Response,
    @Param('eid', new ValidationPipe()) eid: number,
    @Param('cid', new ValidationPipe()) cid: number,
    @Param('sid', new ValidationPipe()) sid: number,
    @Body(new ValidationPipe()) body: SubmissionGradeDto,
  ): Promise<Response> {
    try {
      await this.examService.updateGrade(eid, cid, sid, body.grade);
      return res.status(HttpStatus.OK).send({ message: 'ok' });
    } catch (e) {
      if (e instanceof SubmissionNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
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
   * Get bubble sheet by file id
   * @param res {Response} - Response object
   * @param fileId {string} - file id
   * @returns {Promise<StreamableFile | void>} - StreamableFile or void object
   */
  @Get('/custom_bubble_sheet/:fileId')
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.PROFESSOR)
  async getCustomBubbleSheet(
    @Res({ passthrough: true }) res: Response,
    @Param('fileId', new ValidationPipe()) fileId: string,
  ): Promise<StreamableFile | void> {
    try {
      const filePath = join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'uploads',
        'bubble_sheets',
        `${fileId}`,
        `bubble_sheet.zip`,
      );

      // Check if file exists and is accessible
      if (!existsSync(filePath)) {
        throw new FileNotFoundException();
      }

      const file = createReadStream(filePath);

      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=bubble_sheet.zip',
      });

      return new StreamableFile(file);
    } catch (e) {
      if (e instanceof FileNotFoundException) {
        res.status(HttpStatus.NOT_FOUND).send({
          message: e.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: e.message,
        });
      }
    }
  }
}
