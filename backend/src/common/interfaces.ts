/**
 * Google OAuth user payload interface
 */
export interface OAuthGoogleUserPayload {
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
}

/**
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
