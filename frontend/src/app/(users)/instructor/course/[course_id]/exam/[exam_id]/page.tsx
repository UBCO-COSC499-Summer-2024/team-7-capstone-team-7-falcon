import React from "react";
import CreateExamButton from "../../../../../components/createExamButton";
import PeopleButton from "../../../../../components/peopleButton";
import AnalyticsButton from "../../../../../components/analyticsButton";
import { coursesAPI } from "../../../../../../api/coursesAPI";
import {
  Course,
  CourseData,
  SelectedButton,
} from "../../../../../../typings/backendDataTypes";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Upload, Download, CheckPlusCircle } from "flowbite-react-icons/solid";
import ExamPerformance from "../../../../components/examPerformance";
import DangerZone from "../../../../components/dangerZone";
import ExamTable from "../../../../components/examTable";
import SubmissionTable from "../../../../components/submissionsTable";
import CourseHeader from "../../../../components/courseHeader";
import { examsAPI } from "../../../../../../api/examAPI";

const ViewExam = async ({
  params,
}: {
  params: { course_id: string; exam_id: string };
}) => {
  const cid = Number(params.course_id);
  const exam_id = Number(params.exam_id);
  const response = await coursesAPI.getCourse(cid);
  //const exam_response = await examsAPI.getExam(cid);
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
    <div className="p-0">
      <CourseHeader
        course_code={courseData.course_code}
        course_desc={courseData.course_name}
        course_id={course.id}
        selected={SelectedButton.None}
      />
      <div className="grid grid-cols-5 gap-24 mt-4 border-t-2 border-black">
        <div className="col-span-3 p-4">
          <p className="">{}</p>
          <SubmissionTable course_id={cid} exam_id={exam_id} />
        </div>
        <div className="space-y-4 col-span-2 pr-8 p-4">
          <button
            type="button"
            className="btn-primary flex justify-center bg-purple w-full"
          >
            <Link href={""} className="space-x-4 flex items-center">
              <Upload />
              Upload Submissions
            </Link>
          </button>
          <button
            type="button"
            className="btn-primary flex justify-center bg-purple w-full"
          >
            <Link href={""} className="space-x-4 flex items-center">
              <Download />
              Download Results CSV
            </Link>
          </button>
          <button
            type="button"
            className="btn-primary flex justify-center bg-purple w-full"
          >
            <Link href={""} className="space-x-4 flex items-center">
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
