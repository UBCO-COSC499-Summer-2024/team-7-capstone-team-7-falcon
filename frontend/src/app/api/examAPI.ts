import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import {
  Answers,
  BubbleSheetPayload,
  Exam,
  ExamData,
  StudentSubmission,
} from "../typings/backendDataTypes";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const examsAPI = {
  createExam: async (examData: ExamData, courseId: number) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.post<StudentSubmission>(
        `/${courseId}/create`,
        examData,
      );
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to enroll in course: ", error);
      return error;
    }
  },

  getSubmissions: async (course_id: number, exam_id: number) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(
        `/${course_id}/${exam_id}/submissions`,
      );
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to retrieve submissions: ", error);
      return error;
    }
  },

  /**
   * Returns all the information about a specific exam
   * @param exam_id {number} -  exam id
   * @param course_id {number} - course id
   * @returns {Promise<Exam>} {Exam} - exam information
   */
  getExam: async (exam_id: number, course_id: number): Promise<Exam> => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get<Exam>(
        `/${course_id}/exam/${exam_id}`,
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to find exam:", error);
      throw error;
    }
  },

  postBubbleSheet: async (payload: BubbleSheetPayload) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/queue`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.post(
        `/bubble-sheet-creation/add`,
        payload,
      );
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to post bubble sheet data: ", error);
      return error;
    }
  },

  getJobReadyStatus: async (job_id: string) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/queue`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(`/bubble-sheet-creation/${job_id}`);
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to get queue job data: ", error);
      return error;
    }
  },

  downloadBubbleSheet: async (fileId: string) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(`/custom_bubble_sheet/${fileId}`, {
        responseType: "blob",
      });
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to download bubble sheet: ", error);
      return error;
    }
  },

  getStudentSubmission: async (
    examId: number,
    courseId: number,
    userId: number,
  ) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(
        `/${examId}/${courseId}/user/${userId}/grade`,
      );
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to retrieve exam info: ", error);
      return error;
    }
  },

  getStudentSubmissionPDF: async (
    courseId: number,
    submissionId: number,
    userId: number,
  ) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(
        `/${courseId}/submission/${submissionId}/user/${userId}`,
        { responseType: "arraybuffer" },
      );
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to post bubble sheet data: ", error);
      return error;
    }
  },

  /**
   * Release exam grades
   * @param examId {number} exam id
   * @param courseId {number} course id
   * @returns {Promise<AxiosResponse<any> | Error>}
   */
  releaseExamGrades: async (
    examId: number,
    courseId: number,
  ): Promise<any | Error> => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.patch(
        `/${examId}/${courseId}/release_grades`,
      );
      return response;
    } catch (error: any) {
      return error;
    }
  },

  /**
   * Hide exam grades
   * @param examId {number} - exam id
   * @param courseId {number} - course id
   * @returns {Promise<any | Error>} - response
   */
  hideExamGrades: async (
    examId: number,
    courseId: number,
  ): Promise<any | Error> => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.patch(
        `/${examId}/${courseId}/hide_grades`,
      );
      return response;
    } catch (error: any) {
      return error;
    }
  },

  /**
   * Upload exam submissions
   * @param formData {FormData} - form data
   * @param examId {number} - exam id
   * @param courseId {number} - course id
   * @returns {Promise<any | Error>} - response
   */
  uploadExamSubmissions: async (
    formData: FormData,
    examId: number,
    courseId: number,
  ): Promise<any | Error> => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.post(
        `/${examId}/${courseId}/upload`,
        formData,
      );
      return response;
    } catch (error: any) {
      // always axios error
      console.error("Failed to upload exam submissions: ", error);
      return error;
    }
  },

  /**
   * Download submission grades as CSV
   * @param examId {number} exam id
   * @param courseId {number} course id
   * @returns {Promise<AxiosResponse<any> | Error>}
   */
  downloadSubmissionGrades: async (
    examId: number,
    courseId: number,
  ): Promise<any | Error> => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(
        `/${examId}/${courseId}/download_grades`,
        { responseType: "blob" },
      );
      return response;
    } catch (error: any) {
      return error;
    }
  },

  /**
   * Gets a list of all exams for a course
   * @param course_id
   * @returns {Promise<axios.AxiosResponse<any>>} - post response from backend
   */
  getAllExams: async (course_id: number) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/course/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(`/${course_id}/exams/`);
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to retrieve exams: ", error);
      return error;
    }
  },

  /**
   * Gets a list of all exams that are graded for a course
   * @param course_id
   * @returns {Promise<axios.AxiosResponse<any>>} - post response from backend
   */
  getAllExamsGraded: async (course_id: number) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/course/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(`/${course_id}/exams/graded`);
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to retrieve exams: ", error);
      return error;
    }
  },

  /**
   * Gets all upcoming exams for a course
   * @param course_id
   * @returns {Promise<axios.AxiosResponse<any>>} - post response from backend
   */
  getAllExamsUpcoming: async (course_id: number) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/course/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(`/${course_id}/exams/upcoming`);
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to retrieve exams: ", error);
      return error;
    }
  },

  /**
   * Gets all graded exams for a student
   * @returns {Promise<AxiosResponse<any>>}
   */
  getExamsGraded: async () => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(`/graded`);
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to retrieve submissions: ", error);
      return error;
    }
  },

  /**
   * Gets all upcoming exams for a student
   * @returns {Promise<AxiosResponse<any>>}
   */
  getExamsUpcoming: async () => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(`/upcoming`);
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to retrieve submissions: ", error);
      return error;
    }
  },

  /**
   * Delete exam
   * @param examId {number} exam id
   * @param courseId {number} course id
   * @returns {Promise<AxiosResponse<any> | Error>}
   */
  deleteExam: async (
    examId: number,
    courseId: number,
  ): Promise<any | Error> => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.delete(`/${examId}/${courseId}`);
      return response;
    } catch (error: any) {
      return error;
    }
  },

  /**
   * Create a dispute for a submission
   * @param submissionId {number} - submission id
   * @param courseId {number} - course id
   * @param description {string} - description of dispute
   * @returns {Promise<any | Error>}
   */
  async createSubmissionDispute(
    submissionId: number,
    courseId: number,
    description: string,
  ): Promise<any | Error> {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.post(
        `/${courseId}/submission/${submissionId}/dispute`,
        {
          description,
        },
      );
      return response;
    } catch (error: any) {
      return error;
    }
  },

  /**
   * Get all disputes submissions for an exam
   * @param courseId {number} - course id
   * @param examId {number} - exam id
   * @returns {Promise<any | Error>}
   */
  async getExamSubmissionsDisputes(
    courseId: number,
    examId: number,
  ): Promise<any | Error> {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(
        `/${examId}/${courseId}/submissions_disputes`,
      );
      return response;
    } catch (error: any) {
      return error;
    }
  },

  /**
   * Get a submission dispute for an exam
   * @param courseId {number} - course id
   * @param disputeId {number} - dispute id
   * @returns {Promise<any | Error>} - response
   */
  async getExamSubmissionDispute(
    courseId: number,
    disputeId: number,
  ): Promise<any | Error> {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(
        `/${courseId}/${disputeId}/exam_submission_dispute`,
      );
      return response;
    } catch (error: any) {
      return error;
    }
  },

  /**
   * Update the status of a dispute
   * @param courseId {number} - course id
   * @param disputeId {number} - dispute id
   * @param status {string} - status
   * @returns {Promise<any | Error>} - response
   */
  async updateExamSubmissionDisputeStatus(
    courseId: number,
    disputeId: number,
    status: string,
  ): Promise<any | Error> {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.patch(
        `/${courseId}/${disputeId}/update_dispute_status`,
        {
          status,
        },
      );
      return response;
    } catch (error: any) {
      return error;
    }
  },

  /**
   * Updates the grade for a user submission
   * @param examId
   * @param courseId
   * @param submissionId
   * @param answers
   * @returns {Promise<AxiosResponse<any>>}
   */
  updateGrade: async (
    examId: number,
    courseId: number,
    submissionId: number,
    answers: Answers,
  ) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });

      const payload = {
        answers: answers,
      };

      const response = await instance.patch(
        `${examId}/course/${courseId}/submission/${submissionId}/grade`,
        payload,
      );
      return response;
    } catch (error: any) {
      return error;
    }
  },
  /*
   * Get submission by id
   * @param courseId {number}
   * @param submissionId {number}
   */
  getSubmissionById: async (courseId: number, submissionId: number) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(`/${courseId}/${submissionId}/grade`);
      return response;
    } catch (error: any) {
      //always axios error
      return error;
    }
  },

  /**
   * Get submission PDF by submission id
   * @param courseId {number} - course id
   * @param submissionId {number} - submission id
   */
  getSubmissionPDFbySubmissionId: async (
    courseId: number,
    submissionId: number,
  ) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(
        `/${courseId}/submission/${submissionId}/graded_submission`,
        { responseType: "arraybuffer" },
      );
      return response;
    } catch (error: any) {
      //always axios error
      return error;
    }
  },

  /**
   * Update submission student
   * @param courseId {number} - course id
   * @param submissionId {number} - submission id
   * @param studentId {number} - student id
   * @returns {Promise<any | Error>} - response
   */
  updateSubmissionStudent: async (
    courseId: number,
    submissionId: number,
    studentId: number,
  ): Promise<any | Error> => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/exam`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });

      const response = await instance.patch(
        `/${courseId}/${submissionId}/update_submission_user`,
        {
          studentId,
        },
      );
      return response;
    } catch (error: any) {
      console.error("Failed to update submission: ", error);
      return error;
    }
  },
};
