import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const usersAPI = {
  /**
   * Fetches all courses for a user by their ID from the backend API.
   *
   * @async
   * @function findAllCoursesById
   * @returns {Promise<any>} - A promise that resolves to the data containing all courses for the user.
   * @throws Will log an error message to the console if fetching the courses fails.
   */
  findAllCoursesById: async (): Promise<any> => {
    try {
      const auth_token = await fetchAuthToken();

      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/user/courses`,
        headers: {
          Authorization: auth_token,
        },
        withCredentials: true,
      });

      const response = await instance.get(`${BACKEND_URL}/api/v1/user/courses`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      throw error;
    }
  },

  /**
   * Fetches the role of an authenticated user from the backend API.
   *
   * @async
   * @function getUserRole
   * @returns {Promise<string>} - A promise that resolves to the role of an authenticated user.
   * @throws Will log an error message to the console if fetching the user role fails.
   */
  getUserRole: async (): Promise<string> => {
    try {
      const auth_token = await fetchAuthToken();

      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/user/`,
        headers: {
          Authorization: auth_token,
        },
        withCredentials: true,
      });

      const response = await instance.get(`${BACKEND_URL}/api/v1/user/`);
      return response.data["role"];
    } catch (error) {
      console.error("Failed to fetch user role:", error);
      throw error;
    }
  },
};
