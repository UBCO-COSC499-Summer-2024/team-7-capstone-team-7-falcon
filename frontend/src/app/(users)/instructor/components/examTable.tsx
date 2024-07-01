"use client";
import React, { useEffect, useState } from "react";
import { Column, DataItem } from "./type";
import TableComponent from "./tableComponent";
import { coursesAPI } from "../../../api/coursesAPI";
import { Exam } from "../../../typings/backendDataTypes";
import Link from "next/link";
import { UserEdit } from "flowbite-react-icons/solid";

const exam_columns: Column[] = [
  { label: "Name", renderCell: (item) => item.name },
  { label: "Exam Published", renderCell: (item) => item.exam_date },
  {
    label: "Grade Released",
    renderCell: (item) => (
      <div className="py-3 p-1">
        {item.grades_released_at === null ? "N/A" : item.grades_released_at}
      </div>
    ),
  },
  {
    label: "Actions",
    renderCell: (item) => (
      <Link href={`./exam/${item.id}`}>
        <button type="button" className="btn-primary flex p-1 px-4">
          <UserEdit />
          Edit
        </button>
      </Link>
    ),
  },
];

const exam_columns_upcoming: Column[] = [
  { label: "Name", renderCell: (item) => item.name },
  { label: "Exam Published", renderCell: (item) => item.exam_date },
  {
    label: "Grade Released",
    renderCell: (item) => (
      <div className="py-3 p-1">
        {item.grades_released_at === null ? "N/A" : item.grades_released_at}
      </div>
    ),
  },
  {
    label: "Actions",
    renderCell: (item) => (
      <Link href={`./exam/${item.id}`}>
        <button type="button" className="btn-primary flex p-1 px-4">
          <UserEdit />
          Edit
        </button>
      </Link>
    ),
  },
];

type ExamTableProps = {
  course_id: number;
};

type TableFilter = "Graded" | "Upcoming";

const ExamTable: React.FC<ExamTableProps> = ({ course_id }) => {
  const [data, setData] = useState<DataItem<Exam>[] | null>(null);
  const [data_upcoming, setDataUpcoming] = useState<DataItem<Exam>[] | null>(
    null,
  );
  const [active_header, setActiveHeader] = useState("Graded");

  const handleClick = (header: TableFilter) => {
    setActiveHeader(header);
  };

  // gets the data once on mount
  useEffect(() => {
    const fetchData = async () => {
      const result = await coursesAPI.getAllExams(course_id);

      if (result.status === 200) {
        const exams: DataItem<Exam>[] = result.data.data.map((item: any) => ({
          name: item.name,
          id: item.id,
          data: {
            name: item.name,
            exam_date: new Date(Number(item.exam_date)).toLocaleString(),
            grades_released_at: item.grades_released_at
              ? new Date(Number(item.grades_released_at)).toLocaleString()
              : null,
            id: item.id,
          },
        }));
        setData(exams);
      }

      const result_upcoming = await coursesAPI.getAllExamsUpcoming(course_id);
      if (result_upcoming.status === 200) {
        const exams_upcoming: DataItem<Exam>[] = result_upcoming.data.map(
          (item: any) => ({
            name: item.name,
            id: item.id,
            data: {
              name: item.name,
              exam_date: new Date(Number(item.exam_date)).toLocaleString(),
              grades_released_at: item.grades_released_at
                ? new Date(Number(item.grades_released_at)).toLocaleString()
                : null,
              id: item.id,
            },
          }),
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
            {data ? (
              <TableComponent<Exam>
                data={data}
                columns={exam_columns}
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
              <TableComponent<Exam>
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

export default ExamTable;
