import React from "react";
import { coursesAPI } from "../../../../../../api/coursesAPI";
import {
  Course,
  Exam,
  SelectedButton,
  Submission,
} from "../../../../../../typings/backendDataTypes";
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
  params: { courseId: string; examId: string };
}) => {
  const cid = Number(params.courseId);
  const examId = Number(params.examId);

  const course: Course = await coursesAPI.getCourse(cid);
  const exam: Exam = await examsAPI.getExam(examId, cid);

  const res = await examsAPI.getSubmissions(cid, examId);
  const submissionData: Submission[] = res.data.map((item: any) => ({
    student_id: item.student.id,
    user: {
      avatar_url: item.student.user.avatar_url,
      first_name: item.student.user.first_name,
      last_name: item.student.user.last_name,
    },
    score: item.score,
    updated_at: new Date(Number(item.updated_at)).toLocaleString(),
  }));

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
    <SubmissionProvider submissions={submissionData}>
      <div className="p-0">
        <div className="grid grid-cols-2">
          <div className="col-span-1">
            <CourseHeader
              course_code={course.course_code}
              course_desc={course.course_name}
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
            <SubmissionTable course_id={cid} exam_id={examId} />
          </div>
          <div className="space-y-4 col-span-2 pr-8 p-4">
            <button
              type="button"
              className="btn-primary flex justify-center bg-purple w-full"
            >
              <Link href={""} className="space-x-4 flex items-center">
                <Upload />
                <span>Upload Submissions</span>
              </Link>
            </button>
            <button
              type="button"
              className="btn-primary flex justify-center bg-purple w-full"
            >
              <Link href={""} className="space-x-4 flex items-center">
                <Download />
                <span>Download Results CSV</span>
              </Link>
            </button>
            <button
              type="button"
              className="btn-primary flex justify-center bg-purple w-full"
            >
              <Link href={""} className="space-x-4 flex items-center">
                <CheckPlusCircle />
                <span>Release Grades</span>
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
