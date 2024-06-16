import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import { Toast } from "flowbite-react";
import toast from "react-hot-toast";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface CourseData {
  course_code: string;
  course_name: string;
  section_name: string;
  semester_id: number;
}

export const coursesAPI = {
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
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  },
};
