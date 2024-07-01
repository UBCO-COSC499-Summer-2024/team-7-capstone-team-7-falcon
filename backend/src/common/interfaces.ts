import { PageOptionsDto } from '../dto/page-options.dto';

/**
 * Google OAuth user payload interface
 */
export interface OAuthGoogleUserPayload {
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
}

/*
 * Jobs queue service interface
 */
export interface IJobQueueService {
  createJob(data: any): Promise<any>;
  getJobById(jobId: string): Promise<any>;
  pickUpJob(): Promise<any>;
  markJobAsComplete(jobId: string, result: any): Promise<void>;
}

/**
 * Bubble sheet payload interface
 */
export interface IBubbleSheetPayload {
  numberOfQuestions: number;
  defaultPointsPerQuestion: number;
  numberOfAnswers: number;
  instructions: string;
}

/**
 * Page meta dto parameters
 */
export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

/**
 * Individual exam interface for upcoming exams
 */
interface UpcomingExamsExamInterface {
  id: number;
  name: string;
  examDate: number;
}

/**
 * Upcoming exams interface
 */
export interface UpcomingExamsInterface {
  courseId: number;
  courseName: string;
  courseCode: string;
  exams: UpcomingExamsExamInterface[];
}

/**
 * User submission exam course details interface
 */
interface UserSubmissionExamCourseDetailsInterface {
  id: number;
  courseName: string;
  courseCode: string;
}

/**
 * User submission exam student submission interface
 */
interface UserSubmissionExamStudentSubmissionInterface {
  id: number;
  score: number;
}

/**
 * User submission exam details interface
 */
interface UserSubmissionExamDetailsInterface {
  id: number;
  name: string;
  examDate: number;
}

/**
 * User submission exam interface
 */
export interface UserSubmissionExamInterface {
  exam: UserSubmissionExamDetailsInterface,
  course: UserSubmissionExamCourseDetailsInterface;
  grades: number[];
  studentSubmission: UserSubmissionExamStudentSubmissionInterface;
}
