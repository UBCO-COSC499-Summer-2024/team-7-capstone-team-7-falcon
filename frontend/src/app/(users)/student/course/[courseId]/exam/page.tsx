import { redirect } from "next/navigation";
import { coursesAPI } from "../../../../../api/coursesAPI";
import { Course, CourseData } from "../../../../../typings/backendDataTypes";
import CourseSubmissionsTable from "../../../components/courseSubmissionsTable";

const StudentExamPage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  const cid = Number(params.courseId);
  const response = await coursesAPI.getCourse(cid);
  const course: Course = response?.data;
  const courseData: CourseData = { ...course };

  if (!course || !response) {
    redirect(`../../`);
  }

  return (
    <div className="p-2">
      <h1 className="text-4xl font-bold p-1">{courseData.course_code}</h1>
      <h2 className="text-xl p-1">{courseData.course_name}</h2>
      <CourseSubmissionsTable course_id={cid} />
    </div>
  );
};

export default StudentExamPage;
