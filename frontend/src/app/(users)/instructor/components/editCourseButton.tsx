"use client";
import { Edit } from "flowbite-react-icons/solid";
import Link from "next/link";
import React from "react";
import { Course } from "../../../typings/backendDataTypes";
import ButtonTemplate from "../../../components/buttonTemplate";
import { FileCirclePlus } from "flowbite-react-icons/solid";

interface EditCourseButtonProps {
  course_id: number;
  className?: string;
}

const EditCourseButton: React.FC<EditCourseButtonProps> = ({
  course_id,
  className,
}) => {
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
