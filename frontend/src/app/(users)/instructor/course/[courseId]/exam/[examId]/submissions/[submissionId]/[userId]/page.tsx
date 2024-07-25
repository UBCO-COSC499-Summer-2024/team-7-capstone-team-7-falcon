import Link from "next/link";
import { ArrowLeft } from "flowbite-react-icons/outline";
import { CSSProperties } from "react";
import { mean, median, quantile } from "d3-array";
import {
  Course,
  StudentSubmission,
} from "../../../../../../../../../typings/backendDataTypes";
import { coursesAPI } from "../../../../../../../../../api/coursesAPI";
import { examsAPI } from "../../../../../../../../../api/examAPI";
import PdfViewer from "../../../../../../../../student/components/pdfViewer";
import GradeDisplay from "../../../../../../../../components/gradeDisplay";
import ChangeGrade from "../../../../../../../components/changeGrade";
import { Toaster } from "react-hot-toast";

const InstructorSubmissionPage = async ({
  params,
}: {
  params: { courseId: string; examId: string; userId: string };
}) => {
  const cid = Number(params.courseId);
  const eid = Number(params.examId);
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

  const submissionResponse = await examsAPI.getStudentSubmission(
    eid,
    cid,
    Number(params.userId),
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
            href={`../../`}
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
      <div className="grid grid-cols-5">
        <div className="col-span-4">
          <p className="text-xl p-1 py-4 font-bold">{submission.exam.name}</p>
          <PdfViewer
            courseId={cid}
            submissionId={submission.exam.id}
            userId={Number(params.userId)}
          />
        </div>
        <div className="col-span-1 text-xl">
          <p className="mt-4 mb-8 font-bold">Grade Overview</p>
          <GradeDisplay
            progress={String(submission.studentSubmission.score)}
            text=""
            properties={
              {
                "--size": "6rem",
                "--thickness": "0.7rem",
                "--progress": String(submission.studentSubmission.score),
              } as CSSProperties
            }
            textStyle={"font-normal text-normal"}
          />
          <ChangeGrade
            examId={eid}
            courseId={cid}
            submissionId={submission.studentSubmission.id}
            currentGrade={submission.studentSubmission.score}
          />
          <div className="text-normal mt-8 space-y-2">
            <p>Mean: {stats.meanValue}</p>
            <p>High: {stats.max}</p>
            <p>Low: {stats.min}</p>
            <p>Upper Quartile: {stats.upperQuartile}</p>
            <p>Lower Quartile: {stats.lowerQuartile}</p>
            <p>Median: {stats.medianValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSubmissionPage;