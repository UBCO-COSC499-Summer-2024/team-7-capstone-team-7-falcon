import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE4MzUzNTU4LCJleHAiOjE3MTg0Mzk5NTh9.yWJplbbagH1MrN9AWENbzIJMsjjZLO1lEzGLhNtI8AU";

interface CourseData {
  course_code: string;
  course_name: string;
  section_name: string;
  semester_id: number;
}

interface userData {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url: string;
}

export const coursesAPI = {
  createCourse: async (
    courseData: CourseData,
    creatorRole: string = "instructor",
  ) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/course/create`, {
        userData: courseData,
        headers: {
          Authentication: `auth_token=${AUTH_TOKEN}`,
        },
        withCredentials: true,
      });
      return await response.data;
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  },
};
