import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import { SignUpFormData, userLoginData } from "../typings/backendDataTypes";
import { json } from "stream/consumers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const authAPI = {
  /**
   * Registers a new user.
   *
   * @async
   * @function registerUser
   * @param {SignUpFormData} jsonPayload - The user's registration data.
   * @returns {Promise<axios.AxiosResponse<any>>} - The response from the backend API.
   * @throws Will log an error message to the console if registering the user fails.
   */
  registerUser: async (jsonPayload: SignUpFormData) => {
    try {
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/auth/register/`,
        headers: {
          "Content-Type": "application/json",
          body: jsonPayload,
        },
      });
      const response = await instance.post(
        `${BACKEND_URL}/api/v1/auth/register/`,
        jsonPayload,
      );
      return response;
    } catch (error: any) {
      // not throwing error here, as we want to handle the error in the component
      console.error("Failed to register user: ", error);
    }
  },

  /**
   * Validates a user's email using a confirmation token.
   *
   * @async
   * @function validateEmail
   * @param {string} confirm_token - The confirmation token sent to the user's email.
   * @returns {Promise<axios.AxiosResponse<any>>} - The response from the backend API.
   * @throws Will log an error message to the console if email validation fails.
   */
  validateEmail: async (confirm_token: string) => {
    try {
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/token`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await instance.patch(`${BACKEND_URL}/api/v1/token`, {
        token: confirm_token,
      });
      return response;
    } catch (error) {
      // not throwing error here, as we want to handle the error in the component
      console.error("Error, failed to validate email", error);
    }
  },

  /**
   * Logs in a registered user.
   *
   * @async
   * @function loginUser
   * @param {userLoginData} user - The user's login data.
   * @returns {Promise<axios.AxiosResponse<any>>} - The response from the backend API.
   * @throws Will log an error message to the console if login fails.
   */
  loginUser: async (user: userLoginData) => {
    try {
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/auth/login/`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await instance.post(
        `${BACKEND_URL}/api/v1/auth/login/`,
        user,
      );
      return response;
    } catch (error) {
      // not throwing error here, as we want to handle the error in the component
      console.error("Error, failed to login user", error);
    }
  },
};
