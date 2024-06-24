import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import { ExamData } from "../typings/backendDataTypes";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const examsAPI = {
  createExam: async (examData: ExamData, courseId: number) => {
    console.log("here");
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

  getExamStats: async () => {},
};
