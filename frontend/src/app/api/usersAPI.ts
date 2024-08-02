import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import {
  UpdatedUser,
  User,
  UserEditData,
} from "@/app/typings/backendDataTypes";
import toast from "react-hot-toast";

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
      } else if (error.response && error.response.status === 404) {
        throw new Error("User not found");
      } else {
        console.error("Failed to fetch user details:", error);
        throw error;
      }
    }
  },

  /**
   * Fetches the details of a user by their ID from the backend API.
   * @param userId {number} - The ID of the user to fetch
   * @returns {Promise<User | null>} - A promise that resolves to the details of the user. Returns null when the user does not have any IDs set.
   */
  getUserDetailsById: async (userId: number): Promise<User | null> => {
    try {
      const auth_token = await fetchAuthToken();

      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/user/`,
        headers: {
          Authorization: auth_token,
        },
        withCredentials: true,
      });

      const response = await instance.get<User>(
        `${BACKEND_URL}/api/v1/user/${userId}`,
      );
      return response.data;
    } catch (error: any) {
      if (
        error.response &&
        error.response.status === 403 &&
        error.response.data.errorCode === "STUDENT_OR_EMPLOYEE_ID_NOT_PRESENT"
      ) {
        // handle the case where no IDs are set for the user
        return null;
      } else if (error.response && error.response.status === 404) {
        throw new Error("User not found");
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
      console.error("Failed to fetch user role:", error);
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
      return response.data;
    } catch (error: any) {
      console.error("Failed to get all users count:", error);
      throw error;
    }
  },

  /**
   * Returns data for all users in the system
   * @returns {Promise<axios.AxiosResponse<any>>}
   */
  getAllUsers: async () => {
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
      const response = await instance.get("/all");
      return response;
    } catch (error: any) {
      console.log("Failed to get all users:", error);
      throw error;
    }
  },

  /**
   * Updates the role for any user
   * @param user_id
   * @param new_role new role that the user is being set to
   * @returns {Promise<axios.AxiosResponse<any>>}
   */
  updateUserRole: async (userId: number, new_role: string) => {
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
      const payload = {
        userRole: new_role,
      };
      const response = await instance.patch(`/${userId}/change_role`, payload);
      if (response.status == 204) {
        toast.success("Role updated successfully!");
      } else {
        toast.error("Failed to change user role");
      }
    } catch (error: any) {
      console.log("Failed to change user role", error);
      toast.error("Failed to change user role");
    }
  },

  editUser: async (userId: number, userData: UserEditData) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/user/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });

      const response = await instance.patch(
        `${BACKEND_URL}/api/v1/user/${userId}`,
        userData,
      );
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to edit user: ", error);

      return error;
    }
  },

  deleteProfilePicture: async (userId: number) => {
    try {
      const auth_token = await fetchAuthToken();
      await axios.delete(
        `${BACKEND_URL}/api/v1/user/${userId}/delete_profile_picture`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth_token,
          },
        },
      );
      return true;
    } catch (error) {
      console.error("Failed to delete profile picture: ", error);
      return false;
    }
  },
};
