import { Injectable } from '@nestjs/common';
import { ExamCreateDto } from './dto/exam-create.dto';
import {
  CourseNotFoundException,
  ExamCreationException,
  ExamNotFoundException,
  SubmissionNotFoundException,
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
} from '../../common/interfaces';
import { StudentUserModel } from '../user/entities/student-user.entity';

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
}
