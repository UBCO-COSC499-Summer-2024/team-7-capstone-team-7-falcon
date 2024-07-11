import React from "react";
import { Card } from "flowbite-react"; // Adjust according to your UI library

interface CourseCountCardProps {
  courseCount: number; // Required: Number of courses to display
  className: "max-w-sm";
}

const CourseCountCard: React.FC<CourseCountCardProps> = ({
  courseCount,
  className,
}) => {
  return (
    <Card className={` bg-purple-700 p-2 rounded-xl shadow-md ${className}`}>
      <div className="text-center">
        <div className="text-3xl font-bold text-white mt-2">{courseCount}</div>
        <h2 className="text-lg font-semibold text-white">Courses</h2>
      </div>
    </Card>
  );
};

export default CourseCountCard;
