"use client";
import React, { CSSProperties, useEffect, useState } from "react";
import Link from "next/link";
import { UserEdit } from "flowbite-react-icons/solid";
import { Column, DataItem } from "../../instructor/components/type";
import { coursesAPI } from "../../../api/coursesAPI";
import { StudentExam } from "../../../typings/tableTypes";
import TableComponent from "../../components/tableComponent";
import GradeDisplay from "../../components/gradeDisplay";

const exam_columns_graded: Column[] = [
  { label: "Name", renderCell: (item) => item.name },
  { label: "Exam Date", renderCell: (item) => item.exam_date },
  {
    label: "Grade Released",
    renderCell: (item) => (
      <div className="p-1">
        {item.grades_released_at === null ? "N/A" : item.grades_released_at}
      </div>
    ),
  },
  {
    label: "Grade",
    renderCell: (item) => (
      <div className="p-1 font-normal">
        {item.grade === null ? (
          "N/A"
        ) : (
          <GradeDisplay
            progress={item.grade}
            text=""
            properties={
              {
                "--size": "3rem",
                "--thickness": "0.4rem",
                "--progress": item.grade,
              } as CSSProperties
            }
            textStyle={"font-normal text-xs"}
          />
        )}
      </div>
    ),
  },
  {
    label: "Actions",
    renderCell: (item) => (
      <Link href={`./exam/${item.id}`}>
        <button
          type="button"
          className="btn-primary flex p-1 px-4 items-center space-x-1"
        >
          <UserEdit />
          <span>View</span>
        </button>
      </Link>
    ),
  },
];

const exam_columns_upcoming: Column[] = [
  { label: "Name", renderCell: (item) => item.name },
  {
    label: "Exam Date",
    renderCell: (item) => <div className="p-2">{item.exam_date}</div>,
  },
];

type TableFilter = "Graded" | "Upcoming";

const CourseSubmissionsTable: React.FC<{ course_id: number }> = ({
  course_id,
}) => {
  const [data_graded, setDataGraded] = useState<DataItem<StudentExam>[] | null>(
    null,
  );
  const [data_upcoming, setDataUpcoming] = useState<
    DataItem<StudentExam>[] | null
  >(null);

  const [active_header, setActiveHeader] = useState("Graded");

  const handleClick = (header: TableFilter) => {
    setActiveHeader(header);
  };

  // gets the data once on mount
  useEffect(() => {
    const fetchData = async () => {
      const result_graded = await coursesAPI.getAllExamsGradedStudent();
      if (result_graded.status === 200) {
        const exams: DataItem<StudentExam>[] = result_graded.data[0].exams
          .filter((item: any) => item.courseId === course_id)
          .map((item: any) => ({
            name: item.examName,
            id: item.examId,
            data: {
              course_id: item.courseId,
              name: item.examName,
              id: item.examId,
              grade: item.examScore,
              exam_date: new Date(Number(item.examDate)).toLocaleString(),
              grades_released_at: item.examReleasedAt
                ? new Date(Number(item.examReleasedAt)).toLocaleString()
                : null,
            },
          }));
        setDataGraded(exams);
      }

      const result_upcoming = await coursesAPI.getAllExamsUpcomingStudent();
      if (result_upcoming.status === 200) {
        const exams_upcoming: DataItem<StudentExam>[] = result_upcoming.data
          .filter((item: any) => item.courseId === course_id)
          .flatMap((item: any) =>
            item.exams.map((exam: any) => ({
              id: exam.id,
              name: exam.name,
              data: {
                name: exam.name,
                id: exam.id,
                exam_date: new Date(Number(exam.examDate)).toLocaleString(),
                grade: -1,
                grades_released_at: -1,
                course_id: item.courseId,
              },
            })),
          );
        setDataUpcoming(exams_upcoming);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-left">
      <div className="flex space-x-8 pt-4 pl-3">
        <h2
          className={`cursor-pointer ${active_header === "Graded" ? "text-purple-500" : "text-gray-500"}`}
          onClick={() => handleClick("Graded")}
        >
          Graded Exams
        </h2>
        <h2
          className={`cursor-pointer ${active_header === "Upcoming" ? "text-purple-500" : "text-gray-500"}`}
          onClick={() => handleClick("Upcoming")}
        >
          Upcoming Exams
        </h2>
      </div>
      <div className="p-0 mt-0">
        {active_header === "Graded" && (
          <>
            {data_graded ? (
              <TableComponent<StudentExam>
                data={data_graded}
                columns={exam_columns_graded}
                showSearch={false}
              />
            ) : (
              <div className="pl-3 pt-4 p-2">No data available</div>
            )}
          </>
        )}
        {active_header === "Upcoming" && (
          <>
            {data_upcoming ? (
              <TableComponent<StudentExam>
                data={data_upcoming}
                columns={exam_columns_upcoming}
                showSearch={false}
              />
            ) : (
              <div className="pl-3 pt-4 p-2">No data available</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseSubmissionsTable;
