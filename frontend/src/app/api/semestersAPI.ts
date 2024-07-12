import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const semestersAPI = {
  /**
   * Fetches all semesters from the backend API.
   *
   * @async
   * @function getAllSemestersLimited
   * @returns {Promise<any>} - A promise that resolves to the data containing all semesters.
   * @throws Will log an error message to the console if fetching the semesters fails.
   */
  getAllSemestersLimited: async (): Promise<any> => {
    try {
      const auth_token = await fetchAuthToken();

      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/semester/limited/all`,
        headers: {
          Authorization: auth_token,
        },
        withCredentials: true,
      });

      const response = await instance.get(
        `${BACKEND_URL}/api/v1/semester/limited/all`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch semesters:", error);
      throw error;
    }
  },
};
