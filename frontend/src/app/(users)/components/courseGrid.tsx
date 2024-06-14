import React, { useEffect } from "react";
import CourseCard from "./courseCard";
import { usersAPI } from "@/app/api/usersAPI";

interface Course {
  courseCode: string;
  courseName: string;
  courseRole: string;
}

const CourseGrid: React.FC = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [userCourses, setUserCourses] = React.useState([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const data = await usersAPI.findAllCoursesById(); // Call your async function here
        setIsLoaded(true);
        // Do something with the data
      } catch (error) {
        // Handle error
      }
    };

    fetchDataAsync();
  }, []);

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <CourseCard
          courseCode="COSC 111"
          courseName="Introduction to Computer Science"
          courseRole="instructor"
        />
        <CourseCard
          courseCode="COSC 111"
          courseName="Introduction to Computer Science"
          courseRole="instructor"
        />
        <CourseCard
          courseCode="COSC 111"
          courseName="Introduction to Computer Science"
          courseRole="instructor"
        />
        <CourseCard
          courseCode="COSC 111"
          courseName="Introduction to Computer Science"
          courseRole="instructor"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <CourseCard
          courseCode="COSC 111"
          courseName="Introduction to Computer Science"
          courseRole="instructor"
        />
        <CourseCard
          courseCode="COSC 111"
          courseName="Introduction to Computer Science"
          courseRole="instructor"
        />
        <CourseCard
          courseCode="COSC 111"
          courseName="Introduction to Computer Science"
          courseRole="instructor"
        />
      </div>
    </div>
  );
};

export default CourseGrid;
