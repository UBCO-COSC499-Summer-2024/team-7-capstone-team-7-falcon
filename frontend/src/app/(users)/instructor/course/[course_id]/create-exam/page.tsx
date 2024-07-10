import React from "react";
import { coursesAPI } from "../../../../../api/coursesAPI";
import {
  Course,
  CourseData,
  SelectedButton,
} from "../../../../../typings/backendDataTypes";
import { redirect } from "next/navigation";
import CourseHeader from "../../../components/courseHeader";
import CreateExamForm from "../../../components/createExamForm";
import InputExam from "../../../components/createExam";
import Link from "next/link";
import { Edit } from "flowbite-react-icons/solid";
import { ArrowLeft } from "flowbite-react-icons/outline";

const CreateExam = async ({ params }: { params: { course_id: string } }) => {
  const cid = Number(params.course_id);
  const response = await coursesAPI.getCourse(cid);
  const course: Course = response?.data;
  const courseData: CourseData = { ...course };

  if (!course || !response) {
    return redirect(`../../`);
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
        <div className="justify-self-end space-y-4">
          <button type="button" className="btn-primary">
            <Link href={""} className="space-x-4 flex items-center">
              <Edit />
              Course Settings
            </Link>
          </button>
          <Link
            href={`../${course.id}/exam`}
            className="space-x-4 flex items-center btn-primary"
          >
            <ArrowLeft />
            Back
          </Link>
        </div>
      </div>
      <h1 className="text-xl font-bold">Create Exam:</h1>
      <CreateExamForm course_id={course.id} />
    </div>
  );
};

export default CreateExam;
