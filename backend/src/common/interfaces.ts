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
interface GradedSubmissionInterface {
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
export interface GradedSubmissionsInterface {
  exams: GradedSubmissionInterface[];
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
  hasStudent?: boolean;
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
  exam: UserSubmissionExamDetailsInterface;
  course: UserSubmissionExamCourseDetailsInterface;
  grades?: number[];
  studentSubmission: UserSubmissionExamStudentSubmissionInterface;
  answers?: JSON;
}

/**
 * Course analytics submission student interface
 */
interface CourseAnalyticsSubmissionStudentInterface {
  student: {
    id: number;
    firstName: string;
    lastName: string;
    submissionScore: number;
    avatarUrl: string;
  };
}

/**
 * Course analytics submission interface
 */
interface CourseAnalyticsSubmissionInterface {
  submissions: CourseAnalyticsSubmissionStudentInterface[];
  exam: {
    id: number;
    title: string;
  };
}

/**
 * Course analytics response interface
 */
export interface CourseAnalyticsResponseInterface {
  courseMembersSize: number;
  courseExamsCount: number;
  examSubmissionsCount: number;
  examSubmissions: CourseAnalyticsSubmissionInterface[];
}

/**
 * User role count interface
 */
export interface UserRoleCount {
  count: number;
  role: string;
}

/**
 * Course details interface
 */
export interface CourseDetailsInterface {
  courseId: number;
  courseCode: string;
  semesterName: string;
  members: number;
  creator: {
    firstName: string;
    lastName: string;
  };
}

/**
 * Exam submissions with disputes count interface
 */
export interface ExamSubmissionsDisputesInterface {
  examId: number;
  examName: string;
  numberOfDisputes: number;
}
