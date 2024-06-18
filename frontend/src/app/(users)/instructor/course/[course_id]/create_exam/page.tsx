import React, { useState } from "react";
import CreateExamButton from "../../../../components/createExamButton";
import PeopleButton from "../../../../components/peopleButton";
import AnalyticsButton from "../../../../components/analyticsButton";
import InputExam from "../../../components/createExam";
import { coursesAPI } from "../../../../../api/coursesAPI";
import { Course, CourseData } from "../../../../../typings/backendDataTypes";
import { redirect } from "next/navigation";

type ButtonType = "Exam" | "People" | "Analytics";

const CreateExam = async ({ params }: { params: { course_id: string } }) => {
  const response = await coursesAPI.getCourse(Number(params.course_id));
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
        <CreateExamButton className="bg-purple-700 ring-purple-800 text-white" />
        <PeopleButton />
        <AnalyticsButton />
      </div>
      <h1 className="text-xl font-bold">Create Exam:</h1>
      <InputExam />
    </div>
  );
};

export default CreateExam;
