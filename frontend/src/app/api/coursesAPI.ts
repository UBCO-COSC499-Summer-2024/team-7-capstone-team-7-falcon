import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

interface CourseData {
  course_code: string;
  course_name: string;
  section_name: string;
  semester_id: number;
}

export const coursesAPI = {
  createCourse: async (
    courseData: string,
    creatorRole: string = "instructor",
  ) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/course/create`, {
        data: courseData,
        headers: {
          Authorization: `auth_token=${AUTH_TOKEN}`,
        },
        withCredentials: true,
      });
      if (creatorRole === "instructor") {
      }
      return await response.data;
    } catch (error) {
      console.error("Failed to fetch semesters:", error);
    }
  },
};
