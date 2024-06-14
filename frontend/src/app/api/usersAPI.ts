import axios from "axios";
import { fetchAuthToken } from "./cookieAPI";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

export const usersAPI = {
  findAllCoursesById: async () => {
    try {
      const auth_token = await fetchAuthToken();

      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/user/courses`,
        headers: {
          Authorization: auth_token,
        },
        withCredentials: true,
      });

      const response = await instance.get(`${BACKEND_URL}/api/v1/user/courses`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
    // try {
    //   const auth_token = await fetchAuthToken();
    //   const response = await axios.get(`${BACKEND_URL}/api/v1/user/courses`, {
    //     headers: {
    //       Authorization: auth_token,
    //     },
    //     withCredentials: true,
    //   });
    //   return await response.data;
    // } catch (error) {
    //   console.error("Failed to fetch courses:", error);
    // }
  },
};
