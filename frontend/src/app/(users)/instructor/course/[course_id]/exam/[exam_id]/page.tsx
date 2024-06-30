import React from "react";
import { coursesAPI } from "../../../../../../api/coursesAPI";
import {
  Course,
  CourseData,
  Exam,
  SelectedButton,
} from "../../../../../../typings/backendDataTypes";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  Download,
  CheckPlusCircle,
  Edit,
} from "flowbite-react-icons/solid";
import ExamPerformance from "../../../../components/examPerformance";
import DangerZone from "../../../../components/dangerZone";
import SubmissionTable from "../../../../components/submissionsTable";
import CourseHeader from "../../../../components/courseHeader";
import { examsAPI } from "../../../../../../api/examAPI";
import { ArrowLeft } from "flowbite-react-icons/outline";
import SubmissionProvider from "../../../../../../contexts/submissionContext";

const ViewExam = async ({
  params,
}: {
  params: { course_id: string; exam_id: string };
}) => {
  const cid = Number(params.course_id);
  const exam_id = Number(params.exam_id);
  const response = await coursesAPI.getCourse(cid);
  const course: Course = response?.data;
  const courseData: CourseData = { ...course };
  const exam_response = await examsAPI.getExam(exam_id, cid);
  const exam: Exam = exam_response.data;
  console.log("response", exam);

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
    <SubmissionProvider course_id={1} exam_id={1}>
      <div className="p-0">
        <div className="grid grid-cols-2">
          <div className="col-span-1">
            <CourseHeader
              course_code={courseData.course_code}
              course_desc={courseData.course_name}
              course_id={course.id}
              selected={SelectedButton.None}
            />
            <p className="text-3xl font-bold mt-4">{exam.name}</p>
          </div>
          <div className="justify-self-end space-y-4">
            <button type="button" className="btn-primary">
              <Link href={""} className="space-x-4 flex items-center">
                <Edit />
                Course Settings
              </Link>
            </button>
            <button type="button" className="btn-primary block">
              <Link href={"../exam"} className="space-x-4 flex items-center">
                <ArrowLeft />
                Back
              </Link>
            </button>
          </div>
        </div>

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
      <div></div>
    </SubmissionProvider>
  );
};

export default ViewExam;
