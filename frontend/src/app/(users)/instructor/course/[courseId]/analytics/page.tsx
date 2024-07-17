import dynamic from "next/dynamic";
import { coursesAPI } from "../../../../../api/coursesAPI";
import {
  AnalyticsSubmission,
  Course,
  CourseAnalytics,
  SelectedButton,
} from "../../../../../typings/backendDataTypes";
import CourseHeader from "../../../components/courseHeader";
import EditCourseButton from "../../../components/editCourseButton";
import Avatar from "../../../../../components/avatar";
import GradeDisplay from "../../../../components/gradeDisplay";
import { CSSProperties } from "react";

// Ensures the component is rendered client-side only
const DynamicLineChart = dynamic(
  () => import("../../../components/lineChart"),
  {
    ssr: false,
  },
);

interface StudentScore {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  averageScore: number;
  scores: number[];
}

const AnalyticsPage = async ({ params }: { params: { courseId: string } }) => {
  const cid = Number(params.courseId);
  const course: Course = await coursesAPI.getCourse(cid);
  const analyticsData: CourseAnalytics = await coursesAPI.getCourseStats(cid);

  if (!analyticsData.examSubmissions)
    throw new Error("Submission data unavailable");

  // Given all the submissions for an exam, calculates the average score
  const calculateAverageScore = (exam: AnalyticsSubmission) => {
    if (exam.submissions.length === 0) return 0;

    const totalScore = exam.submissions.reduce(
      (acc, submission) => acc + submission.student.submissionScore,
      0,
    );
    return Math.round(totalScore / exam.submissions.length);
  };

  // Gets names of all exams
  const examTitles = analyticsData.examSubmissions.map(
    (examSubmission) => examSubmission.exam.title,
  );

  // Gets average score per exam in an array
  const averageScores = analyticsData.examSubmissions.map((examSubmission) =>
    calculateAverageScore(examSubmission),
  );

  // Calculates a single number average exam score
  const average = averageScores.length
    ? Math.round(
        averageScores.reduce((acc, score) => acc + score, 0) /
          averageScores.length,
      )
    : 0;

  const studentScoresMap = new Map<string, StudentScore>();

  // Array of students with their info + average grade
  analyticsData.examSubmissions.forEach((examSubmission) => {
    // Iterate over submissions for the current exam
    examSubmission.submissions.forEach((submission) => {
      const studentKey = `${submission.student.id}`;
      let studentScore = studentScoresMap.get(studentKey);

      // If student score object doesn't exist, initialize it
      if (!studentScore) {
        studentScore = {
          id: submission.student.id,
          firstName: submission.student.firstName,
          lastName: submission.student.lastName,
          avatarUrl: submission.student.avatarUrl,
          averageScore: 0,
          scores: [],
        };
        studentScoresMap.set(studentKey, studentScore);
      }

      // Add submission score to student's scores array
      studentScore.scores.push(submission.student.submissionScore);
    });
  });

  // Convert map values to array
  const studentScores: StudentScore[] = Array.from(studentScoresMap.values());

  // Calculate average score for each student
  studentScores.forEach((studentScore) => {
    const sum = studentScore.scores.reduce((acc, score) => acc + score, 0);
    studentScore.averageScore = Math.round(sum / studentScore.scores.length);
  });

  // Gets top 5 scores
  studentScores.sort((a, b) => b.averageScore - a.averageScore);
  const topScores = studentScores.slice(0, 5);

  return (
    <div className="grid grid-cols-2">
      <div className="col-span-1">
        <CourseHeader
          course_code={course.course_code}
          course_desc={course.course_name}
          course_id={course.id}
          selected={SelectedButton.Analytics}
        />
      </div>
      <div className="col-span-1 justify-self-end space-y-4">
        <EditCourseButton />
      </div>
      <div className="border-t-2 border-gray-300 my-4 col-span-1 h-full">
        <div className="grid grid-cols-3">
          <div className="p-3 px-4 text-black items-center ring ring-gray-200 rounded-lg mt-4 ml-1 col-span-1 mx-8">
            <p>Class Size</p>
            <p className="mt-2 text-purple-700 font-bold text-2xl">
              {analyticsData.courseExamsCount}
            </p>
          </div>
          <div className="p-3 px-4 text-black items-center ring ring-gray-200 rounded-lg mt-4 ml-1 col-span-1 mx-8">
            <p>Exam Average</p>
            <p className="mt-2 text-purple-700 font-bold text-2xl">
              {average}%
            </p>
          </div>
          <div className="p-3 px-4 text-black items-center ring ring-gray-200 rounded-lg mt-4 ml-1 col-span-1 mr-1">
            <p>Number of Exams</p>
            <p className="mt-2 text-purple-700 font-bold text-2xl">
              {analyticsData.courseExamsCount}
            </p>
          </div>
          <div className="col-span-3 my-4">
            <DynamicLineChart x_label={examTitles} data={averageScores} />
          </div>
        </div>
      </div>
      <div className="col-span-1 p-3 px-4 m-6 text-black items-center ring ring-gray-200 rounded-lg col-span-1 w-1/2">
        <p className="mt-2 font-bold text-2xl mb-4">Top Performing Students</p>
        <ul className="flex flex-col">
          {topScores.map((studentScore) => (
            <div
              key={studentScore.id}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center">
                <Avatar
                  avatarUrl={studentScore.avatarUrl}
                  firstName={studentScore.firstName}
                  lastName={studentScore.lastName}
                  imageHeight={48}
                  imageWidth={48}
                  imageTextHeight={`w-12`}
                  imageTextWidth={`w-12`}
                  textSize={1}
                />
                <li className="ml-2">
                  {studentScore.firstName} {studentScore.lastName}
                </li>
              </div>
              <div className="ml-auto">
                <GradeDisplay
                  progress={String(studentScore.averageScore)}
                  text=""
                  properties={
                    {
                      "--size": "3rem",
                      "--thickness": "0.4rem",
                      "--progress": studentScore.averageScore,
                    } as CSSProperties
                  }
                  textStyle="font-normal text-xs"
                />
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsPage;
