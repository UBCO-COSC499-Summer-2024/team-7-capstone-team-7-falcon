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
  Res,
  StreamableFile,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
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
  ExamUploadException,
  DisputeSubmissionException,
  UpdateSubmissionException,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SubmissionsProcessingService } from '../queue/jobs/submissions-processing.service';
import { SubmissionCreationDto } from './dto/submission-creation.dto';
import { WorkerAuthGuard } from '../../guards/worker.guard';
import { DisputeSubmissionDto } from './dto/dispute-submission.dto';
import { DisputeStatusDto } from './dto/dispute-status.dto';
import { UpdateSubmissionUserDto } from './dto/update-submission-user.dto';

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
    private readonly sumbissionsProcessingService: SubmissionsProcessingService,
  ) {}

  /**
   * Get submission grade by submission id
   * @param res {Response} - Response object
   * @param cid {number} - Course id
   * @param sid {number} - Submission id
   * @param user {UserModel} - User object
   * @returns {Promise<Response>} - Response object
   */
  @Get('/:cid/:sid/grade')
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  async getSubmissionGradeBySubmissionId(
    @Res() res: Response,
    @Param('cid', ParseIntPipe) cid: number,
    @Param('sid', ParseIntPipe) sid: number,
  ): Promise<Response> {
    try {
      const submission = await this.examService.getSubmissionById(cid, sid);

      return res.status(HttpStatus.OK).send(submission);
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
   * Get graded submission by submission id
   * @param res {Response} - Response object
   * @param sid {number} - Submission id
   * @returns {Promise<StreamableFile | void>} - StreamableFile or void object
   */
  @Get('/:cid/submission/:sid/graded_submission')
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  async getGradedSubmissionFileBySubmissionId(
    @Res({ passthrough: true }) res: Response,
    @Param('sid', ParseIntPipe) sid: number,
  ): Promise<StreamableFile | void> {
    try {
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
        'Content-Disposition': `attachment; filename="submission.pdf"`,
      });

      return new StreamableFile(file);
    } catch (e) {
      if (
        e instanceof FileNotFoundException ||
        e instanceof SubmissionNotFoundException
      ) {
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

  /**
   * Update submission user
   * @param res {Response} - Response object
   * @param cid {number} - Course id
   * @param submissionId {number} - Submission id
   * @param body {UpdateSubmissionUserDto} - Submission user data
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  @Patch('/:cid/:submissionId/update_submission_user')
  async updateSubmissionUser(
    @Res() res: Response,
    @Param('cid', ParseIntPipe) cid: number,
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Body(new ValidationPipe()) body: UpdateSubmissionUserDto,
  ): Promise<Response> {
    try {
      await this.examService.updateSubmissionUserByUserId(
        submissionId,
        body.studentId,
        cid,
      );
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (e) {
      if (
        e instanceof SubmissionNotFoundException ||
        e instanceof UserNotFoundException
      ) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: e.message,
        });
      } else if (e instanceof UpdateSubmissionException) {
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
   * Delete exam
   * @param res {Response} - Response object
   * @param eid {number} - Exam id
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  @Delete('/:eid/:cid')
  async deleteExam(
    @Res() res: Response,
    @Param('eid', ParseIntPipe) eid: number,
  ): Promise<Response> {
    try {
      await this.examService.deleteExam(eid);
      return res.status(HttpStatus.NO_CONTENT).send();
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
   * Update dispute status
   * @param res {Response} - Response object
   * @param disputeId {number} - Dispute id
   * @param body {Object} - Dispute data
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  @Patch('/:cid/:disputeId/update_dispute_status')
  async updateDisputeStatus(
    @Res() res: Response,
    @Param('disputeId', ParseIntPipe) disputeId: number,
    @Body(new ValidationPipe()) body: DisputeStatusDto,
  ): Promise<Response> {
    try {
      await this.examService.updateSubmissionDisputeStatus(
        disputeId,
        body.status,
      );
      return res.status(HttpStatus.OK).send({ message: 'ok' });
    } catch (e) {
      if (e instanceof DisputeSubmissionException) {
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
   * Get exam submission dispute
   * @param res {Response} - Response object
   * @param disputeId {number} - Dispute id
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  @Get('/:cid/:disputeId/exam_submission_dispute')
  async getExamSubmissionDispute(
    @Res() res: Response,
    @Param('disputeId', ParseIntPipe) disputeId: number,
  ): Promise<Response> {
    try {
      const dispute =
        await this.examService.getSubmissionDisputeByDisputeId(disputeId);
      return res.status(HttpStatus.OK).send(dispute);
    } catch (e) {
      if (e instanceof DisputeSubmissionException) {
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
    @Param('eid', ParseIntPipe) eid: number,
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
   * Get exam submissions disputes
   * @param res {Response} - Response object
   * @param eid {number} - Exam id
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  @Get('/:eid/:cid/submissions_disputes')
  async getExamSubmissionsDisputes(
    @Res() res: Response,
    @Param('eid', ParseIntPipe) eid: number,
  ): Promise<Response> {
    try {
      const disputes =
        await this.examService.getExamSubmissionsDisputesByExamId(eid);
      return res.status(HttpStatus.OK).send(disputes);
    } catch (e) {
      if (e instanceof DisputeSubmissionException) {
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
   * Retrieve grades for the exam
   * @param res {Response} response object
   * @param eid {number} exam id
   * @returns {Promise<StreamableFile | void>} StreamableFile or void object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  @Get('/:eid/:cid/download_grades')
  async retrieveGrades(
    @Res({ passthrough: true }) res: Response,
    @Param('eid', ParseIntPipe) eid: number,
  ): Promise<StreamableFile | void> {
    try {
      const csvData = await this.examService.retrieveSubmissionsByExamId(eid);

      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="grades.csv"`,
      });

      return new StreamableFile(csvData);
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message,
      });
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
    @Param('cid', ParseIntPipe) cid: number,
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
   * Create submission for the exam
   * @param res {Response} - Response object
   * @param eid {number} - Exam id
   * @param studentId {number} - Student id
   * @param body {SubmissionCreationDto} - Submission data
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(WorkerAuthGuard)
  @Post(':eid/:studentId')
  async createSubmission(
    @Res() res: Response,
    @Param('eid', ParseIntPipe) eid: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body(new ValidationPipe()) body: SubmissionCreationDto,
  ): Promise<Response> {
    try {
      await this.examService.createExamSubmission(eid, studentId, body);
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
   * Upload exam submissions
   * @param files {Object} - Files object
   * @param res {Response} - Response object
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR)
  @Post(':eid/:cid/upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'answerKey', maxCount: 1 },
      { name: 'submissions', maxCount: 1 },
    ]),
  )
  async uploadExamSubmissions(
    @Res() res: Response,
    @UploadedFiles()
    files: {
      answerKey: Express.Multer.File[];
      submissions: Express.Multer.File[];
    },
    @Param('eid', ParseIntPipe) eid: number,
    @Param('cid', ParseIntPipe) cid: number,
  ): Promise<Response> {
    try {
      const examFolder = await this.examService.uploadExamSubmissions(
        eid,
        files.answerKey,
        files.submissions,
      );

      this.sumbissionsProcessingService.createJob({
        payload: {
          examId: eid,
          courseId: cid,
          folderName: examFolder,
        },
      });

      return res.status(HttpStatus.OK).send({ message: 'ok' });
    } catch (e) {
      if (e instanceof ExamNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: e.message,
        });
      } else if (e instanceof ExamUploadException) {
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
   * @param cid {number} - Course id
   * @param eid {number} - Exam id
   * @returns {Promise<Response>} - Response object
   */
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.PROFESSOR, CourseRoleEnum.TA)
  @Get('/:cid/:eid/submissions')
  async getExam(
    @Res() res: Response,
    @Param('eid', ParseIntPipe) eid: number,
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
    @Param('uid', ParseIntPipe) uid: number,
    @Param('eid', ParseIntPipe) eid: number,
    @Param('cid', ParseIntPipe) cid: number,
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
    @Param('sid', ParseIntPipe) sid: number,
    @Param('uid', ParseIntPipe) uid: number,
    @Param('cid', ParseIntPipe) cid: number,
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
    @Param('eid', ParseIntPipe) eid: number,
    @Param('cid', ParseIntPipe) cid: number,
    @Param('sid', ParseIntPipe) sid: number,
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

  /**
   * Create dispute for the submission
   * @param res {Response} - Response object
   * @param _cid {number} - Course id
   * @param sid {number} - Submission id
   * @param body {Object} - Dispute data
   * @param user {UserModel} - User object
   * @returns {Promise<Response>} - Response object
   */
  @Post('/:cid/submission/:sid/dispute')
  @UseGuards(AuthGuard, CourseRoleGuard)
  @Roles(CourseRoleEnum.STUDENT)
  async createDispute(
    @Res() res: Response,
    @Param('cid', ParseIntPipe) _cid: number,
    @Param('sid', ParseIntPipe) sid: number,
    @Body(new ValidationPipe()) body: DisputeSubmissionDto,
    @User() user: UserModel,
  ): Promise<Response> {
    try {
      await this.examService.createSubmissionDisputeBySubmissionId(
        sid,
        body.description,
        user.id,
      );
      return res.status(HttpStatus.OK).send({ message: 'ok' });
    } catch (e) {
      if (e instanceof SubmissionNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: e.message,
        });
      } else if (e instanceof DisputeSubmissionException) {
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
