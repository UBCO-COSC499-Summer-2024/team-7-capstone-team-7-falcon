"use client";
import React, { useEffect, useState } from "react";
import { coursesAPI } from "../../api/coursesAPI";
import CountCard from "./CountCard";

interface CourseCountCardProps {
  className?: string;
}

const CourseCountCard: React.FC<CourseCountCardProps> = ({ className }) => {
  const [courseCount, setCourseCount] = useState<number>(0);

  useEffect(() => {
    fetchCourseCount();
  }, []);

  const fetchCourseCount = async () => {
    try {
      const count = await coursesAPI.getAllCoursesCount();
      setCourseCount(count);
    } catch (error) {}
  };

  return (
    <CountCard
      count={courseCount}
      title="Courses"
      className={className}
      width="w-1/4"
    />
  ); // Set the width prop
};

export default CourseCountCard;
