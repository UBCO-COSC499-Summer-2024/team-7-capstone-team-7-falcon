import { redirect } from "next/navigation";
import { coursesAPI } from "../../../../../../api/coursesAPI";
import {
  Course,
  CourseData,
  StudentSubmission,
  User,
} from "../../../../../../typings/backendDataTypes";
import Link from "next/link";
import { ArrowLeft } from "flowbite-react-icons/outline";
import { examsAPI } from "../../../../../../api/examAPI";
import GradeDisplay from "../../../../../components/gradeDisplay";
import { CSSProperties } from "react";
import { mean, median, quantile } from "d3-array";
import PdfViewer from "../../../../components/pdfViewer";
import { usersAPI } from "../../../../../../api/usersAPI";

const StudentExamPage = async ({
  params,
}: {
  params: { courseId: string; examId: string };
}) => {
  const cid = Number(params.courseId);
  const eid = Number(params.examId);
  const response = await coursesAPI.getCourse(cid);
  const course: Course = response?.data;
  const courseData: CourseData = { ...course };
  const user: User = await usersAPI.getUserDetails();

  if (!course || !response || !user) {
    redirect(`../../`);
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
    redirect(`../../`);
  }

  const stats = calculateStats(submission.grades);
  if (!stats) {
    redirect(`../../`);
  }

  return (
    <div className="p-2">
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <h1 className="text-4xl font-bold p-1">{courseData.course_code}</h1>
          <h2 className="text-xl p-1">{courseData.course_name}</h2>
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
      <div className="grid grid-cols-5">
        <div className="col-span-4">
          <p className="text-xl p-1 py-4 font-bold">{submission.exam.name}</p>
          <PdfViewer
            courseId={cid}
            submissionId={submission.exam.id}
            userId={user.id}
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

export default StudentExamPage;