import { coursesAPI } from "../../../../../api/coursesAPI";
import {
  Course,
  CourseData,
  SelectedButton,
} from "../../../../../typings/backendDataTypes";
import CourseHeader from "../../../components/courseHeader";
import EditCourseButton from "../../../components/editCourseButton";
import ExamTable from "../../../components/examTable";

const ExamPage = async ({ params }: { params: { course_id: string } }) => {
  const cid = Number(params.course_id);
  const response = await coursesAPI.getCourse(cid);
  const course: Course = response?.data;
  const courseData: CourseData = { ...course };
  return (
    <div>
      <div className="grid grid-cols-2">
        <span className="col-span-2">Graded Exams</span>
        <div className="col-span-1">
          <CourseHeader
            course_code={courseData.course_code}
            course_desc={courseData.course_name}
            course_id={course.id}
            selected={SelectedButton.None}
          />
        </div>
        <div className="col-span-1 justify-self-end space-y-4">
          <EditCourseButton />
        </div>
        <div className="col-span-2 mt-4 justify-self-start">
          <ExamTable course_id={Number(params.course_id)} />
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
