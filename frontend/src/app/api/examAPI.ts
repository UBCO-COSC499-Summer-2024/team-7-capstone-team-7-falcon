import axios, { AxiosResponse } from "axios";
import { fetchAuthToken } from "./cookieAPI";
import {
  BubbleSheetPayload,
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

  getExam: async (exam_id: number, course_id: number) => {
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
      const response = await instance.get(`/${course_id}/exam/${exam_id}`);
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to retrieve exam info: ", error);
      return error;
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
      console.log("exam response", response);
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
      console.error("Failed to retrieve exam info: ", error);
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
};
