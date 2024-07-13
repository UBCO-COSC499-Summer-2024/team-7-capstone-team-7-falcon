import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import {
  Course,
  CourseData,
  CourseEditData,
} from "../typings/backendDataTypes";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const BACKEND_URL_CLIENT = process.env.NEXT_PUBLIC_BACKEND_URL_CLIENT;
const BACKEND_URL_SERVER = process.env.NEXT_PUBLIC_BACKEND_URL_SERVER;

export const coursesAPI = {
  /**
   * Returns all the info about a course
   * @param courseId
   * @returns {Promise<Course>}
   */
  getCourse: async (courseId: number): Promise<Course> => {
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

      const response = await instance.get<Course>(`/${courseId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to find course:", error);
      throw error;
    }
  },

  /**
   * Gets a subset of the course info used for users who are not enrolled
   * @param courseId
   * @returns {Promise<axios.AxiosResponse<any>>} - post response from backend
   */
  getCoursePublic: async (courseId: number) => {
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

      const response = await instance.get<CourseData>(`/${courseId}/public`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to find course:", error);
      throw error;
    }
  },

  /**
   * Enrolls the user in a course
   * @param courseId
   * @param invite_code
   * @returns {Promise<axios.AxiosResponse<any>>} - post response from backend
   */
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
      console.log(response);
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
   * Gets a list of all exams that are graded
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
   * Gets all upcoming exams
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
   * Gets all members in a course by course id
   * @param course_id
   * @returns {Promise<axios.AxiosResponse<any>>} - post response from backend
   */
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

  /**
   * Gets all graded exams for the logged in student
   * @returns {Promise<axios.AxiosResponse<any>>} - post response from backend
   */
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

  /**
   * Gets all upcoming exams for the logged in student
   * @returns {Promise<axios.AxiosResponse<any>>} - post response from backend
   */
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
  editCourse: async (courseId: number, courseData: CourseEditData) => {
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

      const response = await instance.patch(
        `${BACKEND_URL}/api/v1/course/${courseId}`,
        courseData,
      );
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to edit users: ", error);

      return error;
    }
  },
};
