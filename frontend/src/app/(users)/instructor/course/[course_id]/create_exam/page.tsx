import React, { useState } from "react";
import CreateExamButton from "../../../components/createExamButton";
import PeopleButton from "../../../components/peopleButton";
import AnalyticsButton from "../../../components/analyticsButton";
import CreateExamForm from "../../../components/createExamForm";
import { coursesAPI } from "../../../../../api/coursesAPI";
import { Course, CourseData } from "../../../../../typings/backendDataTypes";
import { redirect } from "next/navigation";

const CreateExam = async ({ params }: { params: { course_id: string } }) => {
  const cid = Number(params.course_id);
  const response = await coursesAPI.getCourse(cid);
  const course: Course = response?.data;
  const courseData: CourseData = { ...course };

  if (!course || !response) {
    return redirect(`../../`);
  }

  return (
    <div className="space-y-5 ">
      <h1 className="text-4xl">{courseData.course_name}</h1>
      <h2 className="text-xl">{courseData.course_code}</h2>
      <div className="flex space-x-6">
        <CreateExamButton
          course_id={cid}
          className="bg-purple-700 ring-purple-800 text-white"
        />
        <PeopleButton course_id={cid} />
        <AnalyticsButton course_id={cid} />
      </div>
      <h1 className="text-xl font-bold">Create Exam:</h1>
      <CreateExamForm course_id={cid} />
    </div>
  );
};

export default CreateExam;
