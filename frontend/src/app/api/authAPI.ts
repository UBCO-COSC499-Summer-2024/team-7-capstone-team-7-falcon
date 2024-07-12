import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import { SignUpFormData } from "../typings/backendDataTypes";
import { json } from "stream/consumers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const authAPI = {
  /**
   * Registers a new user.
   *
   * @async
   * @function registerUser
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
      //always axios error
      console.error("Failed to register user: ", error);
      throw error;
    }
  },
};
