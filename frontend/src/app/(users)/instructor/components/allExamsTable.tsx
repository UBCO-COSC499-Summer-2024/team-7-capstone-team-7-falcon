"use client";
import React, { useEffect, useState } from "react";
import { Column, DataItem } from "../../../components/type";
import { StudentExam } from "../../../typings/tableTypes";
import TableComponent from "../../../components/tableComponent";
import { examsAPI } from "../../../api/examAPI";
import Link from "next/link";
import { UserEdit } from "flowbite-react-icons/solid";

const exam_columns_upcoming: Column[] = [
  { label: "Name", renderCell: (item) => item.name },
  {
    label: "Exam Date",
    renderCell: (item) => <div className="p-2">{item.exam_date}</div>,
  },
  {
    label: "Actions",
    renderCell: (item) => (
      <Link href={`course/${item.course_id}/exam/${item.id}`}>
        <button
          type="button"
          className="btn-primary flex p-1 px-4 items-center space-x-1"
        >
          <UserEdit />
          <span>Edit</span>
        </button>
      </Link>
    ),
  },
];

type TableFilter = "Upcoming";

const AllExamsTable: React.FC = () => {
  const [data_upcoming, setDataUpcoming] = useState<
    DataItem<StudentExam>[] | null
  >(null);

  const [active_header, setActiveHeader] = useState("Upcoming");

  const handleClick = (header: TableFilter) => {
    setActiveHeader(header);
  };

  // gets the data once on mount
  useEffect(() => {
    const fetchData = async () => {
      const result_upcoming = await examsAPI.getExamsUpcoming();
      if (result_upcoming.status === 200) {
        const exams_upcoming: DataItem<StudentExam>[] =
          result_upcoming.data.flatMap((item: any) =>
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
          className={`cursor-pointer ${active_header === "Upcoming" ? "text-purple-500" : "text-gray-500"}`}
          onClick={() => handleClick("Upcoming")}
        >
          Upcoming Exams
        </h2>
      </div>
      <div className="p-0 mt-0">
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

export default AllExamsTable;
