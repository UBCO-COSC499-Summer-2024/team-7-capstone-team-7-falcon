import { useState } from "react";
import { coursesAPI } from "../../../../../api/coursesAPI";
import {
  Course,
  CourseData,
  SelectedButton,
} from "../../../../../typings/backendDataTypes";
import CourseHeader from "../../../components/courseHeader";
import EditCourseButton from "../../../components/editCourseButton";
import ExamTable from "../../../components/examTable";

const ExamPage = async ({ params }: { params: { courseId: string } }) => {
  const cid = Number(params.courseId);
  const course: Course = await coursesAPI.getCourse(cid);

  return (
    <div>
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <CourseHeader
            course_code={course.course_code}
            course_desc={course.course_name}
            course_id={course.id}
            selected={SelectedButton.None}
          />
        </div>
        <div className="col-span-1 justify-self-end space-y-4">
          <EditCourseButton />
        </div>
        <div className="col-span-2 mt-4 justify-self-start">
          <ExamTable course_id={Number(params.courseId)} />
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
