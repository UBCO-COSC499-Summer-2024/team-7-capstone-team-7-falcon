import React, { useEffect } from "react";
import CourseCard from "./courseCard";
import { usersAPI } from "@/app/api/usersAPI";
import { CourseRole } from "@/app/typings/backendDataTypes";

/**
 * CourseGrid component that displays a grid of course cards.
 * @returns {React.JSX.Element} - The CourseGrid component.
 */
const CourseGrid: React.FC = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [userCourses, setUserCourses] = React.useState<CourseRole[]>([]);

  /**
   * Fetches the courses of the user from the API.
   * @async
   * @function
   * @returns {Promise<void>}
   */
  useEffect(() => {
    const fetchDataAsync = async (): Promise<void> => {
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
  if (
    userCourses === undefined ||
    userCourses.length === 0 ||
    userCourses[0].course_role === ""
  )
    return <div>No courses found</div>;
  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {userCourses.map((course: CourseRole) => (
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
