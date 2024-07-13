import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import {
  SignUpFormData,
  userLoginData,
  resetPasswordData,
  requestResetPasswordData,
} from "../typings/backendDataTypes";
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
      if (error.response) {
        // The request was made and the server responded with a status code
        return error.response.status;
      }
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

  /**
   * Requests to reset a user's password.
   *
   * @async
   * @function requestResetPassword
   * @param {requestResetPasswordData} jsonPayload - The user's email data.
   * @returns {Promise<axios.AxiosResponse<any>>} - The response from the backend API.
   * @throws Will log an error message to the console if the request fails.
   */
  requestResetPassword: async (jsonPayload: requestResetPasswordData) => {
    try {
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/user/password/request_reset/`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await instance.post(
        `${BACKEND_URL}/api/v1/user/password/request_reset/`,
        jsonPayload,
      );
      return response;
    } catch (error: any) {
      // not throwing error here, as we want to handle the error in the component
      console.error("Failed to request to reset password: ", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        return error.response.status;
      }
    }
  },

  /**
   * Resets a user's password.
   *
   * @async
   * @function resetPassword
   * @param {resetPasswordData} jsonPayload - The user's new password data.
   * @returns {Promise<axios.AxiosResponse<any>>} - The response from the backend API.
   * @throws Will log an error message to the console if resetting the password fails.
   */
  resetPassword: async (jsonPayload: resetPasswordData) => {
    try {
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/user/password/reset`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await instance.post(
        `${BACKEND_URL}/api/v1/user/password/reset`,
        jsonPayload,
      );
      return response;
    } catch (error: any) {
      // not throwing error here, as we want to handle the error in the component
      console.error("Failed to reset password: ", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        return error.response.status;
      }
    }
  },
};
