import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import { CourseData } from "../typings/backendDataTypes";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const BACKEND_URL_CLIENT = process.env.NEXT_PUBLIC_BACKEND_URL_CLIENT;
const BACKEND_URL_SERVER = process.env.NEXT_PUBLIC_BACKEND_URL_SERVER;

export const coursesAPI = {
  getCourse: async (courseId: number) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL_SERVER}/api/v1/course`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get(`/${courseId}/public`);
      return response;
    } catch (error: any) {
      // always axios error
      console.error("Failed to find course:", error);
      return error;
    }
  },

  enrollCourse: async (courseId: number, invite_code: string) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL_CLIENT}/api/v1/course/`,
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
    } catch (error: any) {
      //always axios error
      console.error("Failed to enroll in course: ", error);
      return error;
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

  getCourseMembers: async (course_id: number) => {
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
      const response = await instance.get(`/${course_id}/members`);
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to retrieve users: ", error);

      return error;
    }
  },

  getAllExamsGradedStudent: async () => {
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
      console.error("Failed to retrieve exams: ", error);
      return error;
    }
  },

  getAllExamsUpcomingStudent: async () => {
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
      console.error("Failed to retrieve exams: ", error);
      return error;
    }
  },

  ///:cid/submission/:sid/user/:uid
  getAllExamsGradedStudentCourse: async (
    course_id: number,
    student_id: number,
    user_id: number,
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
        `/${course_id}/submission/${student_id}/user/${user_id}`,
      );
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to retrieve exams: ", error);
      return error;
    }
  },

  getAllExamsUpcomingStudentCourse: async (
    course_id: number,
    student_id: number,
    user_id: number,
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
        `/${course_id}/submission/${student_id}/user/${user_id}`,
      );
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to retrieve exams: ", error);
      return error;
    }
  },
  getAllCoursesCount: async () => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL_SERVER}/api/v1/course/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get("/all/count");
      return response.data.count;
    } catch (error: any) {
      console.error("Failed to get all courses count:", error);
      throw error;
    }
  },
};
