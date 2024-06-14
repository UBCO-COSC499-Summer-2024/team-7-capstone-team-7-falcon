import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE4Mzg2NzU1LCJleHAiOjE3MTg0NzMxNTV9.PtngcMYHC5uuRTyxuUiqWMcsQ_UzSdtCKsK1GlCBpb8";

interface CourseData {
  course_code: string;
  course_name: string;
  section_name: string;
  semester_id: number;
}

export const coursesAPI = {
  createCourse: async (courseData: CourseData) => {
    try {
      // const response = await fetch(`${BACKEND_URL}/api/v1/course/create`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `auth_token=${AUTH_TOKEN}`,
      //   },
      //   body: JSON.stringify(courseData),
      // });

      // const response = await axios.post(
      //   `${BACKEND_URL}/api/v1/course/create`,
      //   courseData,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Cookie: `auth_token=${AUTH_TOKEN}`,
      //     },
      //   }
      // );
      const instance = axios.create({
        baseURL: `${BACKEND_URL}/api/v1/course/create`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `auth_token=${AUTH_TOKEN}`,
        },
      });

      const response = await instance.post(
        `${BACKEND_URL}/api/v1/course/create`,
        courseData,
      );
      return response;
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  },
};
