import React from "react";
import { coursesAPI } from "../../../../../api/coursesAPI";
import { Course, CourseData } from "../../../../../typings/backendDataTypes";
import ModalMessage from "../../../../components/modalMessage";
import JoinCourseModal from "../../../components/joinCourseModal";

const JoinCourse = async ({
  params,
  searchParams,
}: {
  params: { course_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const course: Course = await coursesAPI.getCourse(Number(params.course_id));
  const courseData: CourseData = { ...course };
  const code = searchParams?.code;

  return <JoinCourseModal courseData={courseData} inviteCode={String(code)} />;
};

export default JoinCourse;
