import React, { useState } from "react";
import CreateExamButton from "../../../../../components/createExamButton";
import PeopleButton from "../../../../../components/peopleButton";
import AnalyticsButton from "../../../../../components/analyticsButton";
import { coursesAPI } from "../../../../../../api/coursesAPI";
import { Course, CourseData } from "../../../../../../typings/backendDataTypes";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Upload, Download, CheckPlusCircle } from "flowbite-react-icons/solid";
import { Button } from "flowbite-react";
import ExamPerformance from "../../../../components/examPerformance";
import DangerZone from "../../../../components/dangerZone";

const ViewExam = async ({
  params,
}: {
  params: { course_id: string; exam_id: string };
}) => {
  const cid = Number(params.course_id);
  const response = await coursesAPI.getCourse(cid);
  const course: Course = response?.data;
  const courseData: CourseData = { ...course };

  if (!course || !response) {
    return redirect(`../../`);
  }

  const uploadSubmissions = () => {
    return null;
  };

  const getCSV = () => {
    return;
  };

  const releaseGrades = () => {
    return;
  };

  return (
    <div className="space-y-5 ">
      <h1 className="text-4xl">{courseData.course_name}</h1>
      <h2 className="text-xl">{courseData.course_code}</h2>
      <div className="flex space-x-6">
        <CreateExamButton course_id={cid} />
        <PeopleButton course_id={cid} />
        <AnalyticsButton course_id={cid} />
      </div>
      <h1 className="text-xl font-bold">Filler text:</h1>
      <div className="grid grid-cols-3 gap-4 ">
        <div className="col-span-2"></div>
        <div className="space-y-4">
          <button type="button" className="btn-primary block">
            <Link href={""} className="flex space-x-4">
              <Upload />
              Upload Submissions
            </Link>
          </button>
          <button type="button" className="btn-primary block">
            <Link href={""} className="flex space-x-7">
              <Download />
              Download Results CSV
            </Link>
          </button>
          <button type="button" className="btn-primary block">
            <Link href={""} className="flex space-x-7">
              <CheckPlusCircle />
              Release Grades
            </Link>
          </button>
          <ExamPerformance />
          <DangerZone />
        </div>
      </div>
    </div>
  );
};

export default ViewExam;
