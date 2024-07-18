"use client";
import { Edit } from "flowbite-react-icons/solid";
import Link from "next/link";
import React from "react";

interface EditCourseButtonProps {
  course_id: number;
}

const EditCourseButton: React.FC<EditCourseButtonProps> = ({ course_id }) => {
  return (
    <button type="button" className="btn-primary">
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
