import React from "react";
import PeopleButton from "../../../components/peopleButton";
import AnalyticsButton from "../../../components/analyticsButton";
import CourseEditForm from "../../../components/courseEditForm";
import { coursesAPI } from "../../../../../api/coursesAPI";
import { Course, CourseData } from "../../../../../typings/backendDataTypes";
import { redirect } from "next/navigation";
import CourseSettingsButton from "../../../components/courseSettingsButton";

const EditCourse = async ({ params }: { params: { course_id: string } }) => {
  const cid = Number(params.course_id);
  const response = await coursesAPI.getCourse(cid);
  const course: Course = response?.data;
  const courseData: CourseData = { ...course };

  if (!course || !response) {
    redirect(`../../`);
  }

  return (
    <div className="space-y-5 ">
      <h1 className="text-4xl">{courseData.course_name}</h1>
      <h2 className="text-xl">{courseData.course_code}</h2>
      <div className="flex space-x-6">
        <CourseSettingsButton
          course_id={cid}
          className="bg-purple-700 ring-purple-800 text-white"
        />
        <PeopleButton course_id={cid} />
        <AnalyticsButton course_id={cid} />
      </div>
      <h1 className="text-xl font-bold">Edit Course Information</h1>
      <CourseEditForm course_id={cid} />
    </div>
  );
};

export default EditCourse;
