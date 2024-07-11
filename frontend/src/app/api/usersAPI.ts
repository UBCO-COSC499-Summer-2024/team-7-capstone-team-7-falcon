import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import { User } from "@/app/typings/backendDataTypes";

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
   * Fetches the details of an authenticated user from the backend API.
   *
   * @async
   * @function getUserDetails
   * @returns {Promise<User>} - A promise that resolves to the details of an authenticated user.
   * @throws Will log an error message to the console if fetching the user details fails.
   */
  getUserDetails: async (): Promise<User> => {
    try {
      const auth_token = await fetchAuthToken();

      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/user/`,
        headers: {
          Authorization: auth_token,
        },
        withCredentials: true,
      });

      const response = await instance.get<User>(`${BACKEND_URL}/api/v1/user/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllUsersCount: async () => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/user`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.get("/all/count");
      return response.data; // Assuming response.data contains { role: string, count: number }
    } catch (error: any) {
      console.error("Failed to get all users count:", error);
      throw error;
    }
  },
};
