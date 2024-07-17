import { coursesAPI } from "../../../../../api/coursesAPI";
import { Course } from "../../../../../typings/backendDataTypes";
import CourseSubmissionsTable from "../../../components/courseSubmissionsTable";

const StudentExamPage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  const cid = Number(params.courseId);
  const course: Course = await coursesAPI.getCourse(cid);

  return (
    <div className="p-2">
      <h1 className="text-4xl font-bold p-1">{course.course_code}</h1>
      <h2 className="text-xl p-1">{course.course_name}</h2>
      <CourseSubmissionsTable course_id={cid} />
    </div>
  );
};

export default StudentExamPage;
