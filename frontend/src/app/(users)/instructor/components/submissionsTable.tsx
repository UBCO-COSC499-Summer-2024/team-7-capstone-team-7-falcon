"use client";

import React, { useEffect, useState } from "react";
import { Column, DataItem } from "./type";
import { examsAPI } from "../../../api/examAPI";
import TableComponent from "./tableComponent";
import { Submission } from "../../../typings/backendDataTypes";

const exam_columns: Column[] = [
  { label: "Id", renderCell: (item) => item.student_id },
  {
    label: "Name",
    renderCell: (item) => (
      <div className="flex space-x-4">
        <img
          src={item.user.avatar_url}
          alt="Avatar"
          style={{ width: 35, height: 35, borderRadius: "50%" }}
        />
        <span className="mt-1">{item.user.name}</span>
      </div>
    ),
  },
  {
    label: "Score",
    renderCell: (item) => (
      <div className="rounded text-purple-700 bg-gray-100 text-center mx-8 py-1 my-4 font-bold">
        {item.score === -1 ? "N/A" : item.score}
      </div>
    ),
  },
  {
    label: "Exam Graded",
    renderCell: (item) => <div className="font-bold">{item.updated_at}</div>,
  },
];

type ExamTableProps = {
  course_id: number;
  exam_id: number;
};

const SubmissionTable: React.FC<ExamTableProps> = ({ course_id, exam_id }) => {
  const [data, setData] = useState<DataItem<Submission>[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await examsAPI.getSubmissions(course_id, exam_id);
      console.log("submission raw: ", result);
      const submissions: DataItem<Submission>[] = result.data.map(
        (item: any) => ({
          id: item.student.student_id,
          name:
            item.student.user.first_name + " " + item.student.user.last_name,
          data: {
            student_id: item.student.student_id,
            user: {
              avatar_url: item.student.user.avatar_url,
              name:
                item.student.user.first_name +
                " " +
                item.student.user.last_name,
            },
            score: item.score,
            updated_at: new Date(Number(item.updated_at)).toLocaleString(),
          },
        }),
      );
      setData(submissions);
      console.log("submission data: ", submissions);
    };

    fetchData();
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  return <TableComponent<Submission> data={data} columns={exam_columns} />;
};

export default SubmissionTable;
