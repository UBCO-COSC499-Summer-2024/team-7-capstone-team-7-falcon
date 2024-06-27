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

type ExamTableProps = {
  course_id: number;
};

const ExamTable: React.FC<ExamTableProps> = ({ course_id }) => {
  const [data, setData] = useState<DataItem<Exam>[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await coursesAPI.getAllExams(course_id);
      const exams: DataItem<Exam>[] = result.data.data.map((item: any) => ({
        name: item.name,
        id: item.id,
        data: {
          name: item.name,
          exam_date: new Date(Number(item.exam_date)).toLocaleString(),
          grades_released_at: item.grades_released_at
            ? new Date(Number(item.grades_released_at)).toLocaleString()
            : null,
          edit: "",
          id: item.id,
        },
      }));
      setData(exams);
    };

    fetchData();
  }, []);

  if (!data) {
    return <p>Data not found</p>;
  }

  return <TableComponent<Exam> data={data} columns={exam_columns} />;
};

export default ExamTable;
