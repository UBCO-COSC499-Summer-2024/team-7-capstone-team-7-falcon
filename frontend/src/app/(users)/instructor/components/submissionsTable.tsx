"use client";

import React, { useEffect, useState } from "react";
import { Column, DataItem } from "./type";
import TableComponent from "./tableComponent";
import { Submission } from "../../../typings/backendDataTypes";
import { useSubmissionContext } from "../../../contexts/submissionContext";
import Image from "next/image";

const exam_columns: Column[] = [
  { label: "Id", renderCell: (item) => item.student_id },
  {
    label: "Name",
    renderCell: (item) => (
      <div className="flex space-x-4">
        <Image
          src={item.user.avatar_url}
          alt="Avatar"
          style={{ borderRadius: "50%" }}
          width={35}
          height={35}
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

const SubmissionTable: React.FC<ExamTableProps> = () => {
  const [data, setData] = useState<DataItem<Submission>[]>([]);
  const { submissions } = useSubmissionContext();

  // only rerenders the table if the submission data changes
  useEffect(() => {
    if (submissions) {
      const submissionTableData: DataItem<Submission>[] = submissions.map(
        (item: Submission) => ({
          id: Number(item.student_id),
          name: item.user.name,
          data: {
            student_id: item.student_id,
            user: {
              avatar_url: item.user.avatar_url,
              name: item.user.name,
            },
            score: item.score,
            updated_at: item.updated_at,
          },
        }),
      );
      setData(submissionTableData);
    }
  }, [submissions]);

  if (!data) {
    return <p>Loading...</p>;
  }

  return <TableComponent<Submission> data={data} columns={exam_columns} />;
};

export default SubmissionTable;
