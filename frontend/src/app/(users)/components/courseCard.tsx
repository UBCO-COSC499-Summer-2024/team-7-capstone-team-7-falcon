import React from "react";
import { Card, Button } from "flowbite-react";

interface CourseCardProps {
  courseCode: String;
  courseName: String;
  courseRole: String;
}

function openCourse() {
  // Add a get request here to redirect to the course page
}

const CourseCard: React.FC<CourseCardProps> = ({
  courseCode,
  courseName,
  courseRole,
}) => {
  return (
    <Card className="max-w-sm">
      <div className="flex justify-end">
        <p className="text-purple-700 font-bold text-sm">
          {courseRole.toUpperCase()}
        </p>
      </div>
      <div>
        <h1 className="font-bold text-2xl">{courseCode}</h1>
        <h2 className="text-lg text-wrap">{courseName}</h2>
        <Button
          color="purple"
          className="mt-4 w-full"
          onClick={() => openCourse()}
        >
          Open course
        </Button>
      </div>
    </Card>
  );
};

export default CourseCard;
