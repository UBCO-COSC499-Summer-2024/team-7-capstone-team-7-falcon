import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";

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

      const response = await instance.post(
        `${BACKEND_URL}/api/v1/course/create`,
        courseData,
      );
      return response;
    } catch (error) {
      console.error("Failed to create course:", error);
      // Optionally rethrow the error or return a specific error object/value
      throw error;
    }
  },
};
