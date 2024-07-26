import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import {
  Course,
  CourseAdminDetails,
  CourseEditData,
  CourseAnalytics,
  CourseData,
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
   * {Function} - Gets all courses
   * @returns {Promise<axios.AxiosResponse<any>>} - post response from backend
   */
  getAllCourses: async () => {
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

      const response = await instance.get<CourseAdminDetails[]>("/all");
      return response;
    } catch (error: any) {
      console.error("Failed to find course:", error);
      throw error;
    }
  },

  /**
   * Archives a course
   * @param courseId {number} - The id of the course to archive
   * @returns {Promise<axios.AxiosResponse<any>>} - post response from backend
   */
  archiveCourse: async (courseId: number) => {
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
      const response = await instance.patch(`/${courseId}/archive`, {
        archive: true,
      });
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to archive course: ", error);
      return error;
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
   * Gets all stats for a course
   * @param courseId
   * @returns {Promise<AxiosResponse<any>>}
   */
  getCourseStats: async (courseId: number) => {
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
      const response = await instance.get<CourseAnalytics>(
        `/${courseId}/analytics`,
      );
      return response.data;
    } catch (error: any) {
      throw error;
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

  /**
   * Gets all disputes for a course
   * @param courseId {number} - The id of the course to get disputes for
   */
  getExamSubmissionsDisputes: async (courseId: number) => {
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
      const response = await instance.get(
        `${courseId}/exams_submissions_disputes`,
      );
      return response;
    } catch (error: any) {
      console.error("Failed to get exam disputes:", error);
      throw error;
    }
  },
};
