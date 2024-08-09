import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";
import { SemesterData } from "../typings/backendDataTypes";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const BACKEND_URL_SERVER = process.env.NEXT_PUBLIC_BACKEND_URL_SERVER;

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
      return response;
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
   * @param semesterData - The data for the new semester.
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

  /**
   * Fetches the information about a specific semester
   * @function getSemester
   * @param semesterId - The ID of the semester to fetch
   * @returns {Promise<SemesterData>}
   * @throws Will log an error message to the console if fetching the semester fails.
   */
  getSemester: async (semesterId: number): Promise<SemesterData> => {
    try {
      const auth_token = await fetchAuthToken();
      const instance = axios.create({
        baseURL: `${BACKEND_URL_SERVER}/api/v1/semester`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });

      const response = await instance.get<SemesterData>(`/${semesterId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to retrieve semester:", error);
      throw error;
    }
  },

  /**
   * Edits a semester
   * @function editSemester
   * @param semesterId - The ID of the semester to edit
   * @returns {Promise<SemesterData>}
   * @throws Will log an error message to the console if editing the semester fails.
   */
  editSemester: async (semesterId: number, semesterData: SemesterData) => {
    try {
      const auth_token = await fetchAuthToken();

      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/semester/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });

      const response = await instance.patch(
        `${BACKEND_URL}/api/v1/semester/${semesterId}`,
        semesterData,
      );
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to edit semester: ", error);

      return error;
    }
  },

  /**
   * Deletes a semester
   * @function deleteSemester
   * @param semesterId - The ID of the semester to delete
   * @returns {Promise<axios.AxiosResponse<any>>} - response from backend
   * @throws Will log an error message to the console if deleting the semester fails.
   */
  deleteSemester: async (semesterId: number) => {
    try {
      const auth_token = await fetchAuthToken();

      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/semester/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth_token,
        },
        withCredentials: true,
      });

      const response = await instance.delete(`/${semesterId}`);
      return response;
    } catch (error: any) {
      //always axios error
      console.error("Failed to delete semester: ", error);

      return error;
    }
  },
};
