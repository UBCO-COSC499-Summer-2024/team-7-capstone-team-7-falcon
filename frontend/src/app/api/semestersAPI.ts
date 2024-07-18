import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import { SemesterData } from "../typings/backendDataTypes";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const semestersAPI = {
  /**
   * Fetches all semesters, with limited information, from the backend API.
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

  /**
   * Fetches all semester, including the number of courses for each, from the backend API.
   *
   * @async
   * @function getAllSemesters
   * @returns {Promise<any>} - A promise that resolves to the data containing all semesters and the count of courses.
   * @throws Will log an error message to the console if fetching the semesters fails.
   */
  getAllSemesters: async (): Promise<any> => {
    try {
      const auth_token = await fetchAuthToken();

      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/semester/all`,
        headers: {
          Authorization: auth_token,
        },
        withCredentials: true,
      });

      const response = await instance.get(`${BACKEND_URL}/api/v1/semester/all`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch semesters:", error);
      throw error;
    }
  },

  /**
   * Creates a new semester.
   *
   * @async
   * @function createSemester
   * @returns {Promise<axios.AxiosResponse<any>>} - The response from the backend API.
   * @throws Will log an error message to the console if creating the semester fails.
   */
  createSemester: async (semesterData: SemesterData) => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/semester/create`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });
      const response = await instance.post(
        `${BACKEND_URL}/api/v1/semester/create`,
        semesterData,
      );
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to create semester: ", error);
      return error;
    }
  },
};
