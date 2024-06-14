import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const semestersAPI = {
  getAllSemesters: async () => {
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
    }
  },
};
