import Link from "next/link";
import { ArrowLeft, ChartMixed, Edit } from "flowbite-react-icons/outline";
import { CSSProperties } from "react";
import { mean, median, quantile } from "d3-array";
import {
  Course,
  SelectedButton,
  StudentSubmission,
} from "../../../../../../../../typings/backendDataTypes";
import { coursesAPI } from "../../../../../../../../api/coursesAPI";
import { examsAPI } from "../../../../../../../../api/examAPI";
import GradeDisplay from "../../../../../../../components/gradeDisplay";
import { Toaster } from "react-hot-toast";
import { Alert, Popover } from "flowbite-react";
import CourseHeader from "../../../../../../components/courseHeader";
import UpdateSubmissionUser from "../../../../../../components/updateSubmissionUser";
import ToggleBubbleSheet from "../../../../../../../components/toggleBubbleSheet";
import ExamOverviewPopover from "@/app/(users)/components/examOverviewPopover";

const InstructorSubmissionPage = async ({
  params,
}: {
  params: { courseId: string; submissionId: string; examId: number };
}) => {
  const cid = Number(params.courseId);
  const submissionId = Number(params.submissionId);
  const course: Course = await coursesAPI.getCourse(cid);

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

  const submissionResponse = await examsAPI.getSubmissionById(
    cid,
    submissionId,
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
          <CourseHeader
            course_code={course.course_code}
            course_desc={course.course_name}
            course_id={course.id}
            selected={SelectedButton.None}
          />
        </div>
        <div className="justify-self-end space-y-4">
          <button type="button" className="btn-primary">
            <Link
              href={`../edit-course`}
              className="space-x-4 flex items-center"
            >
              <Edit />
              Course Settings
            </Link>
          </button>
          <button type="button" className="btn-primary block w-full">
            <Link href={"../"} className="space-x-4 flex items-center w-full">
              <ArrowLeft />
              Back
            </Link>
          </button>
        </div>
      </div>
      <h3 className="text-xl p-1 mt-5 border-b-2 border-gray-300 col-span-2">
        Submission Details
      </h3>
      <div>
        <div className="flex my-5 items-center justify-between">
          <p className="text-xl p-1 font-bold">{submission.exam.name}</p>

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

            <UpdateSubmissionUser
              courseId={submission.course.id}
              submissionId={submission.studentSubmission.id}
            />
          </div>
        </div>

        {!submission.studentSubmission.hasStudent && (
          <Alert color="red" className="w-full mb-3">
            This submission does not have a student associated with it.
          </Alert>
        )}

        <ToggleBubbleSheet
          courseId={cid}
          submissionId={submission.studentSubmission.id}
          examId={params.examId}
          submission={submission}
        />
      </div>
    </div>
  );
};

export default InstructorSubmissionPage;
