import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
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
} from '../../common/errors';
import { User } from '../../decorators/user.decorator';
import { UserModel } from '../user/entities/user.entity';
import {
  GradedExamsInterface,
  UpcomingExamsInterface,
} from '../../common/interfaces';
import { ERROR_MESSAGES } from '../../common';

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

  /**
   * Get graded exams by user
   * @param res {Response} - Response object
   * @param user {UserModel} - User object
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard)
  @Get('/graded')
  async getGradedExamsByUser(
    @Res() res: Response,
    @User() user: UserModel,
  ): Promise<Response> {
    try {
      const exams: GradedExamsInterface[] =
        await this.examService.getGradedExamsByUser(user);

      if (exams.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).send({
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
}
