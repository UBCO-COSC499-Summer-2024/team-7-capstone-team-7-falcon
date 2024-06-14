import React from "react";
import { Card, Button } from "flowbite-react";

interface CourseCardProps {
  courseCode: String;
  courseName: String;
  courseRole: String;
  className?: string;
}

/**
 * CourseCard component displays information about a course.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.courseCode - The code of the course.
 * @param {string} props.courseName - The name of the course.
 * @param {string} props.courseRole - The role of the user in the course.
 * @param {string} [props.className="max-w-sm"] - The CSS class name for the component.
 * @returns {JSX.Element} The rendered CourseCard component.
 */
const CourseCard: React.FC<CourseCardProps> = ({
  courseCode,
  courseName,
  courseRole,
  className = "max-w-sm",
}) => {
  /**
   * Opens the course.
   */
  const openCourse = () => {
    // Add your logic to open the course here
  };

  return (
    <Card className={className}>
      <div className="flex justify-end">
        <p className="text-purple-700 font-bold text-sm">
          {courseRole.toUpperCase()}
        </p>
      </div>
      <div>
        <h1 className="font-bold text-2xl">{courseCode}</h1>
        <h2 className="text-md mt-2 text-wrap text-[#858585]">{courseName}</h2>
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
