import React from "react";
import { coursesAPI } from "../../../../../../api/coursesAPI";
import {
  Course,
  CourseData,
  Exam,
  SelectedButton,
  Submission,
} from "../../../../../../typings/backendDataTypes";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Edit } from "flowbite-react-icons/solid";
import ExamPerformance from "../../../../components/examPerformance";
import DangerZone from "../../../../components/dangerZone";
import SubmissionTable from "../../../../components/submissionsTable";
import CourseHeader from "../../../../components/courseHeader";
import { examsAPI } from "../../../../../../api/examAPI";
import { ArrowLeft } from "flowbite-react-icons/outline";
import SubmissionProvider from "../../../../../../contexts/submissionContext";
import ExamSettings from "@/app/(users)/instructor/components/examSettings";
import { Toaster } from "react-hot-toast";

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

  const res = await examsAPI.getSubmissions(cid, exam_id);
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

  // need to handle more checks here
  if (!course || !response) {
    redirect(`../..`);
  }

  return (
    <SubmissionProvider submissions={submissionData}>
      <Toaster />
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
            <ExamSettings courseId={cid} examId={exam_id} />
            <ExamPerformance />
            <DangerZone courseId={cid} examId={exam_id} />
          </div>
        </div>
      </div>
      <div></div>
    </SubmissionProvider>
  );
};

export default ViewExam;
