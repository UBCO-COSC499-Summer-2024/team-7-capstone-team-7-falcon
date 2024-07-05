import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import { ExamData } from "../typings/backendDataTypes";

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
      const response = await instance.post(`/${courseId}/create`, examData);
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
};
