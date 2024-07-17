import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import { User } from "@/app/typings/backendDataTypes";
import { UpdatedUser } from "../typings/backendDataTypes";

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
   * @returns {Promise<User | null>} - A promise that resolves to the details of an authenticated user. Returns null when the user does not have any IDs set.
   * @throws Will log an error message to the console if fetching the user details fails.
   */
  getUserDetails: async (): Promise<User | null> => {
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
    } catch (error: any) {
      if (
        error.response &&
        error.response.status === 403 &&
        error.response.data.errorCode === "STUDENT_OR_EMPLOYEE_ID_NOT_PRESENT"
      ) {
        // handle the case where no IDs are set for the user
        return null;
      } else {
        throw error;
      }
    }
  },

  /**
   * Fetches user details and extracts the role property.
   *
   * @async
   * @function getUserRole
   * @returns {Promise<string>} - A promise that resolves to the role of the user.
   * @throws Will log an error message to the console if fetching the user details fails.
   */
  getUserRole: async () => {
    try {
      const userDetails: User | null = await usersAPI.getUserDetails();
      const userRole: string = userDetails?.role ?? "";
      return userRole;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Updates an authenticated user's details.
   *
   * @async
   * @function updateUserDetails
   * @param {string} userId - The user ID (primary key) of the authenticated user.
   * @param {UpdatedUser} newUserDetails - The updated user details.
   * @returns {Promise<axios.AxiosResponse<any>>} - The response from the backend API.
   * @throws Will log an error message to the console and rethrow the error if updating user details fails
   */
  updateUserDetails: async (userId: string, newUserDetails: UpdatedUser) => {
    try {
      const auth_token = await fetchAuthToken();

      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/user/${userId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
      });

      await instance
        .patch(`${BACKEND_URL}/api/v1/user/${userId}`, newUserDetails)
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
      console.error("Error, failed to update user details", error);
    }
  },
};
