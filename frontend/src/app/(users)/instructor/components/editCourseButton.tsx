"use client";
import { Edit } from "flowbite-react-icons/solid";
import Link from "next/link";
import { FC } from "react";

interface EditCourseButtonProps {
  course_id: number;
  className?: string;
}

const EditCourseButton: FC<EditCourseButtonProps> = ({
  course_id,
  className,
}) => {
  return (
    <button type="button" className={`btn-primary ${className}`}>
      <Link
        href={`/instructor/course/${course_id}/edit-course`}
        className="space-x-4 flex items-center"
      >
        <Edit />
        Course Settings
      </Link>
    </button>
  );
};

export default EditCourseButton;
