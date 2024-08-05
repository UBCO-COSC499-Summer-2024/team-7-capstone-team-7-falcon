import { coursesAPI } from "../../../../../../api/coursesAPI";
import {
  Course,
  StudentSubmission,
  User,
} from "../../../../../../typings/backendDataTypes";
import Link from "next/link";
import { ArrowLeft, ChartMixed } from "flowbite-react-icons/outline";
import { examsAPI } from "../../../../../../api/examAPI";
import GradeDisplay from "../../../../../components/gradeDisplay";
import { CSSProperties } from "react";
import { mean, median, quantile } from "d3-array";
import { usersAPI } from "../../../../../../api/usersAPI";
import ReportSubmissionIssue from "../../../../components/reportSubmissionIssue";
import { Toaster } from "react-hot-toast";
import ToggleBubbleSheet from "../../../../../components/toggleBubbleSheet";
import { Popover } from "flowbite-react";
import ExamOverviewPopover from "../../../../../components/examOverviewPopover";

const StudentExamPage = async ({
  params,
}: {
  params: { courseId: string; examId: string };
}) => {
  const cid = Number(params.courseId);
  const eid = Number(params.examId);
  const course: Course = await coursesAPI.getCourse(cid);
  const user: User = (await usersAPI.getUserDetails()) as User;

  if (!user) {
    throw new Error("User does not exist");
  }

  const calculateStats = (arr: number[]) => {
    if (!arr.length) return null;
    const lowerQuartile = quantile(arr, 0.25);
    const upperQuartile = quantile(arr, 0.75);
    const meanValue = mean(arr);
    const medianValue = median(arr);
    const max = arr[arr.length - 1];
    const min = arr[0];
    return { lowerQuartile, upperQuartile, meanValue, medianValue, min, max };
  };

  const submissionResponse = await examsAPI.getStudentSubmission(
    eid,
    cid,
    user.id,
  );
  const submission: StudentSubmission = submissionResponse.data;

  if (!submissionResponse || !submission) {
    throw new Error("Submission does not exist");
  }

  const stats = calculateStats(submission.grades);
  if (!stats) {
    throw new Error("Error calculating stats");
  }

  return (
    <div className="p-2">
      <Toaster />
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <h1 className="text-4xl font-bold p-1">{course.course_code}</h1>
          <h2 className="text-xl p-1">{course.course_name}</h2>
        </div>
        <div className="justify-self-end space-y-4">
          <Link
            href={`../exam`}
            className="space-x-4 flex items-center btn-primary px-8"
          >
            <ArrowLeft /> Back
          </Link>
        </div>
        <h3 className="text-xl p-1 mt-10 border-b-2 border-gray-300 col-span-2">
          Submission Details
        </h3>
        <div></div>
      </div>
      <div className="">
        <div className="flex my-5 items-center justify-between">
          <p className="text-xl p-1 py-4 font-bold">{submission.exam.name}</p>
          <GradeDisplay
            progress={String(submission.studentSubmission.score)}
            text="Exam Grade"
            properties={
              {
                "--size": "4rem",
                "--thickness": "0.4rem",
                "--progress": String(submission.studentSubmission.score),
              } as CSSProperties
            }
            textStyle={"font-normal text-normal"}
          />

          <div className="space-y-4">
            <Popover
              content={<ExamOverviewPopover stats={stats} />}
              trigger="hover"
              arrow={false}
            >
              <button className="btn-primary flex items-center space-x-3 w-full">
                <ChartMixed />
                <span>Exam Statistics</span>
              </button>
            </Popover>

            <ReportSubmissionIssue
              submissionId={submission.studentSubmission.id}
              courseId={cid}
            />
          </div>
          <ReportSubmissionIssue
            submissionId={submission.studentSubmission.id}
            courseId={cid}
          />
        </div>

        <ToggleBubbleSheet
          courseId={cid}
          submissionId={submission.studentSubmission.id}
          examId={Number(params.examId)}
          userId={user.id}
          submission={submission}
          disableEdit={true}
        />
      </div>
    </div>
  );
};

export default StudentExamPage;
