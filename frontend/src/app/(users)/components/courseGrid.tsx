import React, { useEffect } from "react";
import CourseCard from "./courseCard";
import { usersAPI } from "@/app/api/usersAPI";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  updated_at: string;
  auth_type: string;
  email: string;
  password: string | null;
  avatar_url: string;
}

interface Course {
  id: number;
  course_code: string;
  course_name: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  invite_code: string;
  section_name: string;
}

interface CourseRole {
  id: number;
  course_role: string;
  user: User;
  course: Course;
}

const CourseGrid: React.FC = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [userCourses, setUserCourses] = React.useState([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const data = await usersAPI.findAllCoursesById();
        setUserCourses(data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchDataAsync();
  }, []);

  if (!isLoaded) return <div>Loading...</div>;
  if (userCourses.length === 0 || userCourses[0] === "")
    return <div>No courses found</div>;
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {userCourses.map((course: CourseRole) => (
          <CourseCard
            key={course.course.id}
            courseCode={course.course.course_code}
            courseName={course.course.course_name}
            courseRole={course.course_role}
          />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {userCourses.slice(4).map((course: CourseRole) => (
          <CourseCard
            key={course.course.id}
            courseCode={course.course.course_code}
            courseName={course.course.course_name}
            courseRole={course.course_role}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;
