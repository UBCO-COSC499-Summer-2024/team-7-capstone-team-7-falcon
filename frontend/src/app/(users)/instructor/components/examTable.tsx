"use client";
import React, { useEffect, useState } from "react";
import { Column, DataItem } from "../../../components/type";
import { Exam } from "../../../typings/backendDataTypes";
import Link from "next/link";
import { UserEdit } from "flowbite-react-icons/solid";
import TableComponent from "../../../components/tableComponent";
import { examsAPI } from "../../../api/examAPI";

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

type ExamTableProps = {
  course_id: number;
};

type TableFilter = "All" | "Graded" | "Upcoming";

const ExamTable: React.FC<ExamTableProps> = ({ course_id }) => {
  const [data_all, setDataAll] = useState<DataItem<Exam>[] | null>(null);
  const [data_graded, setDataGraded] = useState<DataItem<Exam>[] | null>(null);
  const [data_upcoming, setDataUpcoming] = useState<DataItem<Exam>[] | null>(
    null,
  );
  const [active_header, setActiveHeader] = useState("All");

  const handleClick = (header: TableFilter) => {
    setActiveHeader(header);
  };

  // gets the data once on mount
  useEffect(() => {
    const fetchData = async () => {
      const result_all = await examsAPI.getAllExams(course_id);

      if (result_all.status === 200) {
        const exams: DataItem<Exam>[] = result_all.data.data.map(
          (item: any) => ({
            name: item.name,
            id: item.id,
            data: {
              name: item.name,
              exam_date: new Date(Number(item.exam_date)).toLocaleString(),
              grades_released_at:
                item.grades_released_at &&
                Number(item.grades_released_at) !== -1
                  ? new Date(Number(item.grades_released_at)).toLocaleString()
                  : null,
              id: item.id,
            },
          }),
        );
        setDataAll(exams);
      }

      const result_graded = await examsAPI.getAllExamsGraded(course_id);
      if (result_graded.status === 200) {
        const exams: DataItem<Exam>[] = result_graded.data.map((item: any) => ({
          name: item.name,
          id: item.id,
          data: {
            name: item.name,
            exam_date: new Date(Number(item.exam_date)).toLocaleString(),
            grades_released_at:
              item.grades_released_at && Number(item.grades_released_at) !== -1
                ? new Date(Number(item.grades_released_at)).toLocaleString()
                : null,
            id: item.id,
          },
        }));
        setDataGraded(exams);
      }

      const result_upcoming = await examsAPI.getAllExamsUpcoming(course_id);
      if (result_upcoming.status === 200) {
        const exams_upcoming: DataItem<Exam>[] = result_upcoming.data.map(
          (item: any) => ({
            name: item.name,
            id: item.id,
            data: {
              name: item.name,
              exam_date: new Date(Number(item.exam_date)).toLocaleString(),
              grades_released_at:
                item.grades_released_at &&
                Number(item.grades_released_at) !== -1
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
          className={`cursor-pointer ${active_header === "All" ? "text-purple-500" : "text-gray-500"}`}
          onClick={() => handleClick("All")}
        >
          All Exams
        </h2>
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
        {active_header === "All" && (
          <>
            {data_all ? (
              <TableComponent<Exam>
                data={data_all}
                columns={exam_columns}
                showSearch={false}
              />
            ) : (
              <div className="pl-3 pt-4 p-2">No data available</div>
            )}
          </>
        )}
        {active_header === "Graded" && (
          <>
            {data_graded ? (
              <TableComponent<Exam>
                data={data_graded}
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
                columns={exam_columns}
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
