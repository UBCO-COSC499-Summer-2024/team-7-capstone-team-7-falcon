"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Column, DataItem } from "./type";
import { examsAPI } from "../../../api/examAPI";
import TableComponent from "./TableComponent";
import { coursesAPI } from "../../../api/coursesAPI";
import { Exam } from "../../../typings/backendDataTypes";

const exam_columns: Column[] = [
  { label: "Name", renderCell: (item) => item.name },
  { label: "Created At", renderCell: (item) => item.created_at },
  { label: "Updated At", renderCell: (item) => item.updated_at },
  { label: "Exam Date", renderCell: (item) => item.exam_date },
];

type ExamTableProps = {
  course_id: number;
};

const ExamTable: React.FC<ExamTableProps> = ({ course_id }) => {
  const [data, setData] = useState<DataItem<Exam>[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await coursesAPI.getAllExams(course_id);
      console.log("exam data: ", result);
      const exams: DataItem<Exam>[] = result.data.data.map((item: any) => ({
        name: item.name,
        id: item.id,
        data: {
          name: item.name,
          created_at: item.created_at,
          updated_at: item.updated_at,
          exam_date: item.exam_date,
        },
      }));
      setData(exams);
      console.log("exam data: ", exams);
    };

    fetchData();
  }, []);

  if (!data) {
    return <p>Data not found</p>;
  }

  return <TableComponent<Exam> data={data} columns={exam_columns} />;
};

export default ExamTable;
