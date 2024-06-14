import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE4Mzc4Mjg0LCJleHAiOjE3MTg0NjQ2ODR9.wpXv7-dckoJc5KiOh8zj-ZwRvpatqIE6j2HM1b21xxI";

interface CourseData {
  course_code: string;
  course_name: string;
  section_name: string;
  semester_id: number;
}

export const coursesAPI = {
  createCourse: async (courseData: CourseData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/course/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `auth_token=${AUTH_TOKEN}`,
        },
        body: JSON.stringify(courseData),
      });

      return await response.json();
    } catch (error) {
      console.error("Failed to create course:", error);
      // Optionally rethrow the error or return a specific error object/value
      throw error;
    }
  },
};
