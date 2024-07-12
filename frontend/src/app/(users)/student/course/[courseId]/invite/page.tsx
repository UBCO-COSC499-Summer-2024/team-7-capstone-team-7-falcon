import React from "react";
import { fetchAuthToken } from "../../../../../api/cookieAPI";
import { coursesAPI } from "../../../../../api/coursesAPI";
import { Course, CourseData } from "../../../../../typings/backendDataTypes";
import ModalMessage from "../../../../components/modalMessage";
import { redirect } from "next/navigation";
import JoinCourseModal from "../../../components/joinCourseModal";

const JoinCourse = async ({
  params,
  searchParams,
}: {
  params: { courseId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const authToken = await fetchAuthToken();
  if (authToken === "") {
    redirect(`/login`);
  }

  const response = await coursesAPI.getCourse(Number(params.courseId));
  const code = searchParams?.code;
  const course: Course = response?.data;
  const courseData: CourseData = { ...course };

  if (!course || !response) {
    return (
      <ModalMessage message={"This course could not be found"}></ModalMessage>
    );
  }

  return <JoinCourseModal courseData={courseData} inviteCode={String(code)} />;
};

export default JoinCourse;
