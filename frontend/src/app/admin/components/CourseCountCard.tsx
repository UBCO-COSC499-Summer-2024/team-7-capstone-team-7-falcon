"use client";
import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import { coursesAPI } from "../../api/coursesAPI"; // Adjust the import path accordingly

interface CourseCountCardProps {
  className?: string;
}

const CourseCountCard: React.FC<CourseCountCardProps> = ({
  className = "w-64 mb-4",
}) => {
  const [courseCount, setCourseCount] = useState<number>(0);

  useEffect(() => {
    fetchCourseCount();
  }, []);

  const fetchCourseCount = async () => {
    try {
      console.log("Fetching course count...");
      const count = await coursesAPI.getAllCoursesCount();
      setCourseCount(count);
    } catch (error) {
      console.error("Error fetching course count:", error);
      // Handle error if needed
    }
  };

  return (
    <Card className={`${className} bg-purple-700 p-2 rounded-xl shadow-md`}>
      <div className="text-center">
        <div className="text-3xl font-bold text-white mt-2">{courseCount}</div>
        <h2 className="text-lg font-semibold text-white">Courses</h2>
      </div>
    </Card>
  );
};

export default CourseCountCard;
