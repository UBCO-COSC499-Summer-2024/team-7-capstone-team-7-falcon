import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import { CourseData } from "../typings/backendDataTypes";
import { Toast } from "flowbite-react";
import toast from "react-hot-toast";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const BACKEND_URL_CLIENT = process.env.NEXT_PUBLIC_BACKEND_URL_CLIENT;
const BACKEND_URL_SERVER = process.env.NEXT_PUBLIC_BACKEND_URL_SERVER;
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE4MzgxODU3LCJleHAiOjE3MTg0NjgyNTd9.j6j-KNfSd1HTxiblVBPcgvN3YKsJ9TsPWCZfkNVlvCo";

export const coursesAPI = {
    getCourse: async (courseId: number) => {
    try {
      const auth_token = await fetchAuthToken();
      console.log(auth_token);
      const instance = axios.create({
        baseURL: `${BACKEND_URL_SERVER}/api/v1/course`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(`/${courseId}`);
      return response;
    } catch (error) {
      console.error("Failed to find course:", error);
      return null;
    }
  },

  enrollCourse: async (courseId: number, invite_code: string) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL_CLIENT}/api/v1/course`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });

      const enrollData = {
        invite_code: invite_code,
      };
      const response = await instance.post(`/${courseId}/enroll`, enrollData);
      return response;
    } catch (error) {
      console.error("Failed to enroll in course: ", error);
      return null;
    }
  },
  
  /**
   * Creates a new course using the provided course data.
   *
   * @async
   * @function createCourse
   * @param {CourseData} courseData - The data for the course to be created.
   * @returns {Promise<axios.AxiosResponse<any>>} - The response from the backend API.
   * @throws Will log an error message to the console and rethrow the error if creating the course fails.
   */
  createCourse: async (courseData: CourseData) => {
    try {
      const auth_token = await fetchAuthToken();

      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/course/create`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
      });

      await instance
        .post(`${BACKEND_URL}/api/v1/course/create`, courseData)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            console.error(error.response.data);
            console.error(error.response.status);
          } else if (error.request) {
            // The request was made but no response was received
            console.error(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error", error.message);
          }
        });
    } catch (error) {
      console.error("Error, failed to create course", error);
    }
  },
};
