import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE4MzYyNjk1LCJleHAiOjE3MTg0NDkwOTV9.sn-3qc-3jXng-PpAJtt8GqJtsgF26ox9FsUUEYZgSGs";

interface CourseData {
  course_code: string;
  course_name: string;
  section_name: string;
  semester_id: number;
}

export const coursesAPI = {
  createCourse: async (courseData: CourseData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/course/create`, {
        userData: courseData,
        headers: {
          Cookie: `auth_token=${AUTH_TOKEN}`,
        },
        withCredentials: true,
      });
      return await response.data;
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  },
};
