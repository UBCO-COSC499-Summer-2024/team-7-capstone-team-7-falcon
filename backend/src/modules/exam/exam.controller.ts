import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { Roles } from '../../decorators/roles.decorator';
import { CourseRoleEnum } from '../../enums/user.enum';
import { AuthGuard } from '../../guards/auth.guard';
import { CourseRoleGuard } from '../../guards/course-role.guard';
import { ExamCreateDto } from './dto/exam-create.dto';
import { ExamService } from './exam.service';
import {
  ExamCreationException,
  ExamNotFoundException,
  SubmissionNotFoundException,
} from '../../common/errors';
import { User } from '../../decorators/user.decorator';
import { UserModel } from '../user/entities/user.entity';
import { UpcomingExamsInterface } from '../../common/interfaces';
import { ERROR_MESSAGES } from '../../common';
import { SubmissionGradeDto } from './dto/submission-grade.dto';

@Controller('exam')
export class ExamController {
  /**
   * Constructor of ExamController
   * @param examService {ExamService} instance of ExamService
   */
  constructor(private readonly examService: ExamService) {}

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
        return res.status(HttpStatus.NOT_FOUND).send({
          message: ERROR_MESSAGES.examController.noUpcomingExamsFound,
        });
      }

      return res.status(HttpStatus.OK).send(exams);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message,
      });
    }
  }
}
