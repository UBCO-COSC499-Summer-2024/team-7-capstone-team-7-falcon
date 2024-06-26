import React, { useEffect, useState } from "react";
import TableComponent from "../components/TableComponent";
import { TabItem } from "flowbite-react";
import { ExamColumn } from "../components/columns"; //
import { DataItem } from "../components/type";
import ExamTable from "../components/examTable";
import { coursesAPI } from "../../../api/coursesAPI";
import { Course, CourseData } from "../../../typings/backendDataTypes";

/**
 * Renders the page component for the exams the instructor has created.
 * @component
 * @returns TSX Element
 */
const ViewExam = async ({
  params,
}: {
  params: { course_id: string; exam_id: string };
}) => {
  const cid = Number(params.course_id);
  const response = await coursesAPI.getCourse(cid);
  const course: Course = response?.data;
  const courseData: CourseData = { ...course };

  return (
    <div>
      <h1 className="text-2xl font-bold">Instructor Exams</h1>
      <div className="grid grid-cols-6">
        <div className="col-span-4">
          <ExamTable course_id={cid} />
        </div>
        <div className="col-span-2">
          <h1>Exam Details</h1>
        </div>
      </div>
    </div>
  );
};

export default ViewExam;
