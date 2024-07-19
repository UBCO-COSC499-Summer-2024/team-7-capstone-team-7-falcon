import React from "react";
import { coursesAPI } from "../../../../../api/coursesAPI";
import {
  Course,
  SelectedButton,
} from "../../../../../typings/backendDataTypes";
import CourseHeader from "../../../components/courseHeader";
import CreateExamForm from "../../../components/createExamForm";
import Link from "next/link";
import { Edit } from "flowbite-react-icons/solid";
import { ArrowLeft } from "flowbite-react-icons/outline";

const CreateExam = async ({ params }: { params: { courseId: string } }) => {
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