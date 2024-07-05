import React from "react";
import InputExam from "../../../components/createExam";
import { coursesAPI } from "../../../../../api/coursesAPI";
import {
  Course,
  CourseData,
  SelectedButton,
} from "../../../../../typings/backendDataTypes";
import { redirect } from "next/navigation";
import CourseHeader from "../../../components/courseHeader";

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
      <CourseHeader
        course_code={courseData.course_code}
        course_desc={courseData.course_name}
        course_id={course.id}
        selected={SelectedButton.Create_Exam}
      />
      <h1 className="text-xl font-bold">Create Exam:</h1>
      <InputExam course_id={cid} />
    </div>
  );
};

export default CreateExam;
