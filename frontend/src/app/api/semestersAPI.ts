import axios from "axios";
import { fetchAuthToken } from "./cookies/cookieAPI";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const semestersAPI = {
  getAllSemesters: async () => {
    try {
      const auth_cookie = await fetchAuthToken();
      const response = await axios.get(`${BACKEND_URL}/api/v1/semester/all`, {
        headers: {
          Authorization: auth_cookie,
        },
        withCredentials: true,
      });
      return await response.data;
    } catch (error) {
      console.error("Failed to fetch semesters:", error);
    }
  },
};
