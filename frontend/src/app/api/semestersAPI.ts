import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

export const semestersAPI = {
  getAllSemesters: async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/semester/all`, {
        headers: {
          Authorization: `auth_token=${AUTH_TOKEN}`,
        },
        withCredentials: true,
      });
      return await response.data;
    } catch (error) {
      console.error("Failed to fetch semesters:", error);
    }
  },
};
