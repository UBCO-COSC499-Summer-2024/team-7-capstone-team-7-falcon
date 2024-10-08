import { Injectable } from '@nestjs/common';
import { ExamCreateDto } from './dto/exam-create.dto';
import {
  CourseNotFoundException,
  DisputeSubmissionException,
  ExamCreationException,
  ExamNotFoundException,
  ExamUploadException,
  SubmissionNotFoundException,
  UpdateSubmissionException,
  UserNotFoundException,
  UserSubmissionNotFound,
} from '../../common/errors';
import { ERROR_MESSAGES } from '../../common';
import { ExamModel } from './entities/exam.entity';
import { CourseService } from '../course/course.service';
import { SubmissionModel } from './entities/submission.entity';
import { pick } from 'lodash';
import { PageOptionsDto } from '../../dto/page-options.dto';
import { PageMetaDto } from '../../dto/page-meta.dto';
import { PageDto } from '../../dto/page.dto';
import { MoreThan, Not } from 'typeorm';
import { CourseUserModel } from '../course/entities/course-user.entity';
import { UserModel } from '../user/entities/user.entity';
import {
  GradedSubmissionsInterface,
  UpcomingExamsInterface,
  UserSubmissionExamInterface,
} from '../../common/interfaces';
import { StudentUserModel } from '../user/entities/student-user.entity';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import { SubmissionCreationDto } from './dto/submission-creation.dto';
import { DisputeStatusEnum } from '../../enums/exam-dispute.enum';
import { SubmissionDisputeModel } from './entities/submission-dispute.entity';
import { SubmissionGradeDto } from './dto/submission-grade.dto';

@Injectable()
export class ExamService {
  private readonly THREE_MONTHS = 1000 * 60 * 60 * 24 * 30 * 3;

  /**
   * Constructor of ExamService
   * @param courseService {CourseService} instance of CourseService
   */
  constructor(private readonly courseService: CourseService) {}

  /**
   * Get exam by id
   * @param examId {number} exam id
   * @returns {Promise<ExamModel>} exam model
   */
  public async getExamById(examId: number): Promise<ExamModel> {
    const exam = await ExamModel.findOne({ where: { id: examId } });

    if (!exam) {
      throw new ExamNotFoundException();
    }

    return exam;
  }

  /**
   * Get exams by course id
   * @param cid {number} course id
   * @param pageOptionsDto {PageOptionsDto} page options dto
   * @returns {Promise<PageDto<any>>} page dto of exams
   */
  public async getExamsByCourseId(
    cid: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<any>> {
    const queryBuilder = ExamModel.createQueryBuilder('exam');

    queryBuilder
      .leftJoin('exam.course', 'course')
      .where('course.id = :cid', { cid })
      .andWhere('course.is_archived = false')
      .orderBy('exam.exam_date', 'DESC')
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const examsCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      itemCount: examsCount,
      pageOptionsDto,
    });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Create an exam
   * @param courseId {number} course id associated with an exam
   * @param examDetails {ExamCreateDto} exam details body dto
   */
  public async createExam(
    courseId: number,
    examDetails: ExamCreateDto,
  ): Promise<void> {
    const course = await this.courseService.getCourseById(courseId);

    if (!course) {
      throw new CourseNotFoundException();
    }

    const currentTime: number = parseInt(new Date().getTime().toString());

    if (examDetails.exam_date < currentTime) {
      throw new ExamCreationException(
        ERROR_MESSAGES.examController.examDateError,
      );
    }

    await ExamModel.create({
      name: examDetails.exam_name,
      exam_date: examDetails.exam_date,
      questions: examDetails.payload ?? {},
      course,
      created_at: currentTime,
      updated_at: currentTime,
    }).save();
  }

  /**
   * Get submissions by exam id
   * @param examId {number} exam id
   * @returns {Promise<SubmissionModel[]>} list of submissions
   */
  public async getSubmissionsByExamId(
    examId: number,
  ): Promise<SubmissionModel[]> {
    const submissions = await SubmissionModel.find({
      where: {
        exam: {
          id: examId,
        },
      },
      relations: ['student', 'student.user', 'exam'],
      order: {
        score: 'DESC',
      },
    });

    // Modify the submissions to only include the necessary fields
    const modifiedSubmissions: SubmissionModel[] = submissions.map(
      (submission) => ({
        id: submission.id,
        score: submission.score,
        created_at: submission.created_at,
        updated_at: submission.updated_at,
        answers: submission.answers,
        student: {
          ...submission.student,
          user: pick(submission.student?.user, [
            'id',
            'first_name',
            'last_name',
            'avatar_url',
          ]),
        },
      }),
      // Casting to SubmissionModel[] to satisfy the return type, as we don't want to return the full SubmissionModel
    ) as SubmissionModel[];

    return modifiedSubmissions;
  }

  /**
   * Get upcoming exams by user
   * @param user {UserModel} - User model
   * @returns {Promise<UpcomingExamsInterface[]>} list of upcoming exams
   */
  async getUpcomingExamsByUser(
    user: UserModel,
  ): Promise<UpcomingExamsInterface[]> {
    const userCourses = await CourseUserModel.find({
      where: {
        user,
        course: {
          is_archived: false,
          exams: {
            exam_date: MoreThan(parseInt(new Date().getTime().toString())),
          },
        },
      },
      relations: ['course', 'course.exams'],
    });

    const modifiedResponse: UpcomingExamsInterface[] = userCourses.map(
      (userCourse) => ({
        courseId: userCourse.course.id,
        courseName: userCourse.course.course_name,
        courseCode: userCourse.course.course_code,
        exams: [
          ...userCourse.course.exams.map((exam) => ({
            id: exam.id,
            name: exam.name,
            examDate: exam.exam_date,
          })),
        ],
      }),
    );

    return modifiedResponse;
  }

  /**
   * Get upcoming exams by course id
   * @param courseId {number} - Course id
   * @returns {Promise<ExamModel[]>} - List of upcoming exams
   */
  async getUpcomingExamsByCourseId(courseId: number): Promise<ExamModel[]> {
    const course = await this.courseService.getCourseById(courseId);

    if (!course) {
      throw new CourseNotFoundException();
    }

    const currentTime: number = parseInt(new Date().getTime().toString());

    const exams = await ExamModel.find({
      where: {
        course,
        exam_date: MoreThan(currentTime),
      },
    });

    return exams;
  }

  /**
   * Get graded exams by course id
   * @param courseId {number} - Course id
   * @returns {Promise<ExamModel[]>} - List of graded exams
   */
  async getGradedExamsByCourseId(courseId: number): Promise<ExamModel[]> {
    const course = await this.courseService.getCourseById(courseId);

    if (!course) {
      throw new CourseNotFoundException();
    }

    const currentTime: number = parseInt(new Date().getTime().toString());

    const exams = await ExamModel.find({
      where: {
        course,
        grades_released_at: MoreThan(currentTime - this.THREE_MONTHS),
      },
    });

    return exams;
  }

  /**
   * Get graded submissions by user
   * @param user {UserModel} - User model
   * @returns {Promise<GradedSubmissionsInterface[]>} - List of graded submissions
   */
  async getGradedSubmissionsByUser(
    user: UserModel,
  ): Promise<GradedSubmissionsInterface[]> {
    const studentUser = await StudentUserModel.find({
      where: {
        user,
        submissions: {
          score: MoreThan(-1),
          exam: {
            grades_released_at: MoreThan(
              parseInt(new Date().getTime().toString()) - this.THREE_MONTHS,
            ),
            course: {
              is_archived: false,
            },
          },
        },
      },
      relations: ['submissions', 'submissions.exam', 'submissions.exam.course'],
    });

    const modifiedSubmission: GradedSubmissionsInterface[] = studentUser.map(
      (student) => ({
        exams: student.submissions.map((submission) => ({
          examId: submission.exam.id,
          examName: submission.exam.name,
          examDate: submission.exam.exam_date,
          examReleasedAt: submission.exam.grades_released_at,
          examScore: submission.score,
          courseId: submission.exam.course.id,
        })),
      }),
    );

    return modifiedSubmission;
  }

  /**
   * Get exam graded submission by user
   * @param eid {number} - exam id
   * @param user {UserModel} - user object
   * @param cid {number} - course id
   * @returns {Promise<UserSubmissionExamInterface>} - user submission exam interface
   */
  async getExamGradedSubmissionByUser(
    eid: number,
    user: UserModel,
    cid: number,
  ): Promise<UserSubmissionExamInterface> {
    const exam = await ExamModel.findOne({
      where: {
        course: {
          id: cid,
          is_archived: false,
        },
        id: eid,
        grades_released_at: Not(-1),
      },
      order: {
        submissions: {
          score: 'ASC',
        },
      },
      relations: [
        'course',
        'submissions',
        'submissions.student',
        'submissions.student.user',
      ],
    });

    if (!exam) {
      throw new ExamNotFoundException();
    }

    const currentStudentSubmission = exam.submissions.filter((submission) => {
      return submission.student?.user?.id === user.id;
    });

    if (currentStudentSubmission.length === 0) {
      throw new UserSubmissionNotFound();
    }

    const modifiedResponse: UserSubmissionExamInterface = {
      exam: {
        id: exam.id,
        name: exam.name,
        examDate: exam.exam_date,
      },
      studentSubmission: {
        id: currentStudentSubmission[0].id,
        score: currentStudentSubmission[0].score,
      },
      course: {
        id: exam.course.id,
        courseName: exam.course.course_name,
        courseCode: exam.course.course_code,
      },
      grades: exam.submissions.map((submission: SubmissionModel) =>
        Number(submission.score),
      ),
      answers: currentStudentSubmission[0].answers,
    };

    return modifiedResponse;
  }

  /**
   * Get graded submission file path by submission id
   * @param submissionId {number} submission id
   * @returns {Promise<string>} graded submission file path
   */
  async getGradedSubmissionFilePathBySubmissionId(
    submissionId: number,
  ): Promise<string> {
    const submission = await SubmissionModel.findOne({
      where: {
        id: submissionId,
        score: MoreThan(-1),
        document_path: Not(''),
      },
      select: ['document_path'],
    });

    if (!submission) {
      throw new SubmissionNotFoundException();
    }

    return submission.document_path;
  }

  /**
   * Release grades for an exam
   * @param examId {number} - Exam id
   */
  async releaseGrades(examId: number): Promise<void> {
    const exam = await ExamModel.findOne({
      where: {
        id: examId,
        course: {
          is_archived: false,
        },
      },
      relations: ['course'],
    });

    if (!exam) {
      throw new ExamNotFoundException();
    }

    await ExamModel.update(
      { id: examId },
      {
        grades_released_at: parseInt(new Date().getTime().toString()),
      },
    );
  }

  /**
   * Hide grades for an exam
   * @param examId {number} - Exam id
   * @returns {Promise<void>} - Promise of void
   */
  async hideGrades(examId: number): Promise<void> {
    const exam = await ExamModel.findOne({
      where: {
        id: examId,
        course: {
          is_archived: false,
        },
      },
      relations: ['course'],
    });

    if (!exam) {
      throw new ExamNotFoundException();
    }

    await ExamModel.update(
      { id: examId },
      {
        grades_released_at: -1,
      },
    );
  }

  /**
   * Update grade
   * @param eid {number} - Exam id
   * @param cid {number} - Course id
   * @param sid {number} - Submission id
   * @param body {SubmissionGradeDto} - Request body
   */
  async updateGrade(
    eid: number,
    cid: number,
    sid: number,
    body: SubmissionGradeDto,
  ): Promise<void> {
    const submission = await SubmissionModel.findOne({
      where: {
        id: sid,
        exam: { id: eid, course: { id: cid, is_archived: false } },
      },
      relations: ['exam', 'exam.course'],
    });

    if (!submission) {
      throw new SubmissionNotFoundException();
    }

    const totalScore = body.answers.answer_list.length;

    const totalMarks = body.answers.answer_list.reduce(
      (total, answer) => total + answer.score,
      0,
    );

    const grade = Math.round((totalMarks / totalScore) * 1000) / 1000;

    submission.answers = {
      errorFlag: body.answers.errorFlag,
      answer_list: body.answers.answer_list,
    };

    submission.score = grade * 100;
    await submission.save();
  }

  /**
   * Upload exam submissions
   * @param eid {number} - Exam id
   * @param answerKey {Express.Multer.File[]} - Answer key file
   * @param submissions {Express.Multer.File[]} - Submissions file
   * @returns {Promise<string>} - Folder name
   */
  async uploadExamSubmissions(
    eid: number,
    answerKey: Express.Multer.File[],
    submissions: Express.Multer.File[],
  ): Promise<string> {
    if (!answerKey || !submissions) {
      throw new ExamUploadException(
        ERROR_MESSAGES.examController.examFilesMissing,
      );
    }

    if (
      answerKey[0].mimetype !== 'application/pdf' ||
      submissions[0].mimetype !== 'application/pdf'
    ) {
      throw new ExamUploadException(
        ERROR_MESSAGES.examController.examFilesInvalid,
      );
    }
    const exam = await this.getExamById(eid);

    if (exam.exam_folder) {
      throw new ExamUploadException(
        ERROR_MESSAGES.examController.examFilesAlreadyUploaded,
      );
    }
    const folderName = uuidv4();

    const rawFolderPath = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'uploads',
      'exams',
      'raw',
      folderName,
    );

    const processedFolderPath = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'uploads',
      'exams',
      'processed_submissions',
      folderName,
    );

    mkdirSync(rawFolderPath, { recursive: true });
    mkdirSync(processedFolderPath, { recursive: true });

    const answerKeyPath = join(rawFolderPath, 'answer_key.pdf');
    const submissionsPath = join(rawFolderPath, 'submissions.pdf');

    writeFileSync(answerKeyPath, answerKey[0].buffer);
    writeFileSync(submissionsPath, submissions[0].buffer);

    exam.exam_folder = folderName;
    await exam.save();

    return folderName;
  }

  /**
   * Create exam submission
   * @param examId {number} - Exam id
   * @param studentId {number} - Student id
   * @param requestBody {SubmissionCreationDto} - Request body
   */
  async createExamSubmission(
    examId: number,
    studentId: number,
    requestBody: SubmissionCreationDto,
  ): Promise<void> {
    const { answers, documentPath, score } = requestBody;

    const exam = await this.getExamById(examId);

    const student = await StudentUserModel.findOne({
      where: { student_id: studentId },
    });

    await SubmissionModel.create({
      document_path: documentPath,
      score,
      answers,
      student,
      exam,
      created_at: parseInt(new Date().getTime().toString()),
      updated_at: parseInt(new Date().getTime().toString()),
    }).save();
  }

  /**
   * Retrieve submission grades by exam id
   * @param examId {number} - Exam id
   * @returns {Promise<Readable>} - Readable stream
   */
  async retrieveSubmissionsByExamId(examId: number): Promise<Readable> {
    const examSubmissions = await SubmissionModel.find({
      where: {
        exam: {
          id: examId,
        },
      },
      relations: ['student', 'exam'],
    });

    // Using stream to avoid memory issues and to allow for large data sets
    const csvStream: Readable = new Readable();
    csvStream._read = () => {};

    csvStream.push('studentId,grade\n');

    examSubmissions.forEach((examSubmission) => {
      const studentId = examSubmission.student?.student_id;
      const grade = examSubmission.score;
      csvStream.push(`${studentId ?? 'unknown student'},${grade}\n`);
    });

    // End the stream
    csvStream.push(null);

    return csvStream;
  }

  /**
   * Delete an exam
   * @param examId {number} - Exam id
   * @returns {Promise<void>} - Promise of void
   */
  async deleteExam(examId: number): Promise<void> {
    const exam = await ExamModel.findOne({
      where: {
        id: examId,
        course: {
          is_archived: false,
        },
      },
      relations: ['course'],
    });

    if (!exam) {
      throw new ExamNotFoundException();
    }

    await SubmissionModel.delete({
      exam: exam,
    });

    await exam.remove();
  }

  /**
   * Create submission dispute by submission id
   * @param submissionId {number} - Submission id
   * @param description {string} - Description
   * @param userId {number} - User id
   */
  async createSubmissionDisputeBySubmissionId(
    submissionId: number,
    description: string,
    userId: number,
  ): Promise<void> {
    const submission = await SubmissionModel.findOne({
      where: {
        id: submissionId,
      },
      relations: ['dispute', 'student', 'student.user'],
    });

    if (!submission) {
      throw new SubmissionNotFoundException();
    }

    if (submission.student?.user?.id !== userId) {
      throw new DisputeSubmissionException(
        ERROR_MESSAGES.examController.submissionDoesNotBelongToUser,
      );
    }

    if (submission.dispute) {
      throw new DisputeSubmissionException(
        ERROR_MESSAGES.examController.disputeAlreadyExists,
      );
    }

    await SubmissionDisputeModel.create({
      description,
      submission,
      created_at: parseInt(new Date().getTime().toString()),
      updated_at: parseInt(new Date().getTime().toString()),
    }).save();
  }

  /**
   * Update submission dispute status
   * @param submissionId {number} - Submission id
   * @param status {DisputeStatusEnum} - Dispute status
   */
  async updateSubmissionDisputeStatus(
    disputeId: number,
    status: DisputeStatusEnum,
  ): Promise<void> {
    const submissionDispute = await SubmissionDisputeModel.findOne({
      where: {
        id: disputeId,
      },
      relations: ['submission'],
    });

    if (!submissionDispute) {
      throw new DisputeSubmissionException(
        ERROR_MESSAGES.examController.disputeNotFound,
      );
    }

    const currentTime: number = parseInt(new Date().getTime().toString());

    submissionDispute.status = status;

    if (status !== DisputeStatusEnum.CREATED) {
      submissionDispute.resolved_at = currentTime;
    }

    submissionDispute.updated_at = currentTime;

    await submissionDispute.save();
  }

  /**
   * Get exam submissions disputes by exam id
   * @param examId {number} - Exam id
   * @returns {Promise<SubmissionDisputeModel[]>} - List of exam submissions disputes
   */
  async getExamSubmissionsDisputesByExamId(
    examId: number,
  ): Promise<SubmissionDisputeModel[]> {
    const exam = await SubmissionDisputeModel.find({
      where: {
        submission: {
          exam: {
            id: examId,
            course: {
              is_archived: false,
            },
          },
        },
      },
      order: {
        created_at: 'DESC',
      },
      relations: ['submission', 'submission.exam', 'submission.exam.course'],
    });

    if (!exam || exam.length === 0) {
      throw new DisputeSubmissionException(
        ERROR_MESSAGES.examController.disputesNotFound,
      );
    }

    const modifiedResponse: SubmissionDisputeModel[] = exam.map(
      (submissionDispute) =>
        ({
          id: submissionDispute.id,
          status: submissionDispute.status,
          created_at: submissionDispute.created_at,
        }) as SubmissionDisputeModel,
    );
    return modifiedResponse;
  }

  /**
   * Get submission dispute by disputeId
   * @param disputeId {number} - Dispute id
   * @returns {Promise<SubmissionDisputeModel>} - Submission dispute model
   */
  async getSubmissionDisputeByDisputeId(
    disputeId: number,
  ): Promise<SubmissionDisputeModel> {
    const submissionDispute = await SubmissionDisputeModel.findOne({
      where: {
        id: disputeId,
        submission: {
          exam: {
            course: {
              is_archived: false,
            },
          },
        },
      },
      relations: [
        'submission',
        'submission.exam',
        'submission.exam.course',
        'submission.student',
        'submission.student.user',
      ],
    });

    if (!submissionDispute) {
      throw new DisputeSubmissionException(
        ERROR_MESSAGES.examController.disputeNotFound,
      );
    }

    const modifiedResponse: SubmissionDisputeModel = {
      id: submissionDispute.id,
      status: submissionDispute.status,
      description: submissionDispute.description,
      created_at: submissionDispute.created_at,
      updated_at: submissionDispute.updated_at,
      resolved_at: submissionDispute.resolved_at,
      submission: {
        created_at: submissionDispute.submission.created_at,
        score: submissionDispute.submission.score,
        updated_at: submissionDispute.submission.updated_at,
        answers: submissionDispute.submission.answers,
        document_path: submissionDispute.submission.document_path,
        id: submissionDispute.submission.id,
        student: {
          student_id: submissionDispute.submission.student?.student_id,
          id: submissionDispute.submission.student?.id,
          user: {
            id: submissionDispute.submission.student?.user?.id,
            first_name: submissionDispute.submission.student?.user?.first_name,
            last_name: submissionDispute.submission.student?.user?.last_name,
          } as UserModel,
        } as StudentUserModel,
      } as SubmissionModel,
    } as SubmissionDisputeModel;

    return modifiedResponse;
  }

  /**
   * Get submission by id
   * @param courseId {number} - Course id
   * @param submissionId {number} - Submission id
   * @returns {Promise<UserSubmissionExamInterface>} - User submission exam interface
   */
  async getSubmissionById(
    courseId: number,
    submissionId: number,
  ): Promise<UserSubmissionExamInterface> {
    const submission = await SubmissionModel.findOne({
      where: {
        id: submissionId,
      },
      relations: ['exam'],
    });

    const exam = await ExamModel.findOne({
      where: {
        course: {
          id: courseId,
          is_archived: false,
        },
        id: submission?.exam?.id,
      },
      order: {
        submissions: {
          score: 'ASC',
        },
      },
      relations: [
        'course',
        'submissions',
        'submissions.student',
        'submissions.student.user',
      ],
    });

    if (!exam) {
      throw new ExamNotFoundException();
    }

    const currentSubmission = exam.submissions.filter((submission) => {
      return submission.id === submissionId;
    });

    const modifiedResponse: UserSubmissionExamInterface = {
      exam: {
        id: exam.id,
        name: exam.name,
        examDate: exam.exam_date,
      },
      studentSubmission: {
        id: currentSubmission[0].id,
        score: currentSubmission[0].score,
        hasStudent: currentSubmission[0].student !== null,
      },
      course: {
        id: exam.course.id,
        courseName: exam.course.course_name,
        courseCode: exam.course.course_code,
      },
      grades: exam.submissions.map((submission: SubmissionModel) =>
        Number(submission.score),
      ),
      answers: currentSubmission[0].answers,
    };
    return modifiedResponse;
  }

  /**
   * Update submission user by user id
   * @param submissionId {number} - Submission id
   * @param studentUserId {number} - Student user id
   * @param courseId {number} - Course id
   * @returns {Promise<void>} - Promise of void
   */
  async updateSubmissionUserByUserId(
    submissionId: number,
    studentUserId: number,
    courseId: number,
  ): Promise<void> {
    const submission = await SubmissionModel.findOne({
      where: {
        id: submissionId,
      },
      relations: ['student', 'student.user', 'exam'],
    });

    if (!submission) {
      throw new SubmissionNotFoundException();
    }

    if (Number(submission.student?.student_id) === studentUserId) {
      throw new UpdateSubmissionException(
        ERROR_MESSAGES.examController.userAlreadyAssignedToThisSubmission,
      );
    }

    const isStudentAlreadyAssignedToSubmission = await ExamModel.findOne({
      where: {
        id: submission.exam?.id,
        submissions: {
          student: {
            student_id: studentUserId,
          },
        },
      },
      relations: ['submissions', 'submissions.student'],
    });

    if (isStudentAlreadyAssignedToSubmission) {
      throw new UpdateSubmissionException(
        ERROR_MESSAGES.examController.userAlreadyAssignedToSubmission,
      );
    }

    const student = await StudentUserModel.findOne({
      where: {
        student_id: studentUserId,
        user: {
          courses: {
            course: {
              id: courseId,
              is_archived: false,
              exams: {
                id: submission.exam?.id,
              },
            },
          },
        },
      },
      relations: [
        'user',
        'user.courses',
        'user.courses.course',
        'user.courses.course.exams',
      ],
    });

    if (!student) {
      throw new UserNotFoundException();
    }

    submission.student = student;
    await submission.save();
  }
}
