import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const healthAPI = {
  /**
   * Checks the health of the backend server.
   *
   * @async
   * @function checkHealth
   * @returns {Promise<any>} - A promise that resolves to the health status of the backend server.
   * @throws Will log an error message to the console if checking the health of the backend server fails.
   */
  isBackendHealthy: async (): Promise<any> => {
    try {
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/health/`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      await instance.get(`${BACKEND_URL}/api/v1/health/`);
      return true;
    } catch (error: any) {
      return false;
    }
  },
};
