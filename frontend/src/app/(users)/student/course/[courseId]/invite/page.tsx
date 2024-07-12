import React from "react";
import { coursesAPI } from "../../../../../api/coursesAPI";
import { Course, CourseData } from "../../../../../typings/backendDataTypes";
import JoinCourseModal from "../../../components/joinCourseModal";

const JoinCourse = async ({
  params,
  searchParams,
}: {
  params: { courseId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const courseData: CourseData = await coursesAPI.getCoursePublic(
    Number(params.courseId),
  );
  const code = searchParams?.code;

  return <JoinCourseModal courseData={courseData} inviteCode={String(code)} />;
};

export default JoinCourse;
