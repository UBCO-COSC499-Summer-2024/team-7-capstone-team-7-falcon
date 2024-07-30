import React from "react";
import CourseEditForm from "../../../../../components/editCourseForm";
import { coursesAPI } from "../../../../../api/coursesAPI";
import {
  Course,
  SelectedButton,
} from "../../../../../typings/backendDataTypes";
import { redirect } from "next/navigation";
import EditCourseButton from "../../../components/editCourseButton";
import CourseHeader from "../../../components/courseHeader";
import Link from "next/link";
import { ArrowLeft } from "flowbite-react-icons/outline";

const EditCourse = async ({ params }: { params: { courseId: string } }) => {
  const cid = Number(params.courseId);
  const course: Course = await coursesAPI.getCourse(cid);

  return (
    <div className="space-y-5 p-0 m-0">
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <CourseHeader
            course_code={course.course_code}
            course_desc={course.course_name}
            course_id={course.id}
            selected={SelectedButton.Edit_Course}
          />
        </div>
        <div className="justify-self-end">
          <Link
            href={`../${course.id}/`}
            className="space-x-4 flex items-center btn-primary"
          >
            <ArrowLeft />
            Back
          </Link>
        </div>
      </div>
      <h1 className="text-xl font-bold">Edit Course Information:</h1>
      <CourseEditForm courseId={course.id} />
    </div>
  );
};

export default EditCourse;
