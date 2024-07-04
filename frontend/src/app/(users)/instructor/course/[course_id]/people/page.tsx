import { useState } from "react";
import { coursesAPI } from "../../../../../api/coursesAPI";
import {
  Course,
  CourseData,
  CourseUser,
  SelectedButton,
} from "../../../../../typings/backendDataTypes";
import CourseHeader from "../../../components/courseHeader";
import AddStudentButton from "../../../components/AddStudentButton";
import PeopleTable from "../../../components/PeopleTable";

const PeoplePage = async ({ params }: { params: { course_id: string } }) => {
  const cid = Number(params.course_id);
  const response = await coursesAPI.getCourse(cid);
  const course: Course = response?.data;
  const courseData: CourseData = { ...course };

  return (
    <div>
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <CourseHeader
            course_code={courseData.course_code}
            course_desc={courseData.course_name}
            course_id={course.id}
            selected={SelectedButton.None}
          />
        </div>
        <div className="col-span-1 justify-self-end space-y-4">
          <AddStudentButton />
        </div>
        <div className="col-span-2 mt-4 justify-center">
          <PeopleTable course_id={Number(params.course_id)} />
        </div>
      </div>
    </div>
  );
};

export default PeoplePage;
