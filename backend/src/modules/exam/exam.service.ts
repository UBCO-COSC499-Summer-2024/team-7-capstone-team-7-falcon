import { Injectable } from '@nestjs/common';
import { ExamCreateDto } from './dto/exam-create.dto';
import {
  CourseNotFoundException,
  ExamCreationException,
  ExamNotFoundException,
  ExamUploadException,
  SubmissionNotFoundException,
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
    const queryBuilder = SubmissionModel.createQueryBuilder('submission')
      .leftJoin('submission.exam', 'exam')
      .leftJoinAndSelect('submission.student', 'student')
      .leftJoinAndSelect('student.user', 'user')
      .where('exam.id = :examId', { examId })
      .orderBy('submission.score', 'DESC');

    const submissions = await queryBuilder.getMany();

    // Modify the submissions to only include the necessary fields
    const modifiedSubmissions: SubmissionModel[] = submissions.map(
      (submission) => ({
        id: submission.id,
        score: submission.score,
        created_at: submission.created_at,
        updated_at: submission.updated_at,
        student: {
          ...submission.student,
          user: pick(submission.student.user, [
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
      return submission.student.user.id === user.id;
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
   * Update grade
   * @param eid {number} - Exam id
   * @param cid {number} - Course id
   * @param sid {number} - Submission id
   * @param grade {number} - Grade
   */
  async updateGrade(
    eid: number,
    cid: number,
    sid: number,
    grade: number,
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

    submission.score = grade;
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
      const studentId = examSubmission.student.student_id;
      const grade = examSubmission.score;
      csvStream.push(`${studentId},${grade}\n`);
    });

    // End the stream
    csvStream.push(null);

    return csvStream;
  }
}
