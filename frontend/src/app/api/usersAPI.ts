import axios from "axios";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

export const usersAPI = {
  findAllCoursesById: async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/courses`, {
        headers: {
          Authorization: `auth_token=${AUTH_TOKEN}`,
        },
        withCredentials: true,
      });
      return await response.data;
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  },
};
