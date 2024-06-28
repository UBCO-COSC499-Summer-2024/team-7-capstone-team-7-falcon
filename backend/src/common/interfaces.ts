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
 * Graded exam interface
 */
interface GradedExamInterface {
  examId: number;
  examName: string;
  examDate: number;
  examReleasedAt: number;
  examScore: number;
  courseId: number;
}

/**
 * Graded exams interface
 */
export interface GradedExamsInterface {
  exams: GradedExamInterface[];
}
