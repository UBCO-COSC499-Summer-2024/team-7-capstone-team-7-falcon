import React from "react";
import PeopleButton from "../../../components/peopleButton";
import AnalyticsButton from "../../../components/analyticsButton";
import CourseEditForm from "../../../components/courseEditForm";
import { coursesAPI } from "../../../../../api/coursesAPI";
import {
  Course,
  CourseData,
  Status,
  SelectedButton,
} from "../../../../../typings/backendDataTypes";
import { redirect } from "next/navigation";
import EditCourseButton from "../../../components/editCourseButton";
import { Label, TextInput, FileInput } from "flowbite-react";
import CourseHeader from "../../../components/courseHeader";
import Link from "next/link";
import { Edit } from "flowbite-react-icons/solid";
import { ArrowLeft } from "flowbite-react-icons/outline";

const EditCourse = async ({ params }: { params: { course_id: number } }) => {
  const cid = Number(params.course_id);
  const response = await coursesAPI.getCourse(cid);
  const course: Course = response?.data;
  const courseData: CourseData = { ...course };

  if (!course || !response) {
    redirect(`../../`);
  }

  return (
    <div className="space-y-5 p-0 m-0">
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <CourseHeader
            course_code={courseData.course_code}
            course_desc={courseData.course_name}
            course_id={course.id}
            selected={SelectedButton.None}
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
      <CourseEditForm course_id={course.id} />
    </div>
  );
};

export default EditCourse;
