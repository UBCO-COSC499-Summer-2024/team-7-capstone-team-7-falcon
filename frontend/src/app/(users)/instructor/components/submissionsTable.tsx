"use client";

import React, { useEffect, useState } from "react";
import { Column, DataItem } from "./type";
import TableComponent from "../../components/tableComponent";
import { Submission } from "../../../typings/backendDataTypes";
import { useSubmissionContext } from "../../../contexts/submissionContext";
import Avatar from "../../../components/avatar";

const exam_columns: Column[] = [
  { label: "Id", renderCell: (item) => item.student_id },
  {
    label: "Name",
    renderCell: (item) => (
      <div className="flex space-x-4 items-center">
        <Avatar
          avatarUrl={item.user.avatar_url}
          firstName={item.user.first_name}
          lastName={item.user.last_name}
          imageHeight={48}
          imageWidth={48}
          imageTextHeight={`w-12`}
          imageTextWidth={`w-12`}
          textSize={1}
        />
        <span className="mt-1">
          {item.user.first_name} {item.user.last_name ?? ""}
        </span>
      </div>
    ),
  },
  {
    label: "Score",
    renderCell: (item) => (
      <div className="rounded text-purple-700 bg-gray-100 text-center mx-1 py-1 my-4 font-bold">
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
          name: `${item.user.first_name} ${item.user.last_name}`,
          data: {
            student_id: item.student_id,
            user: {
              avatar_url: item.user.avatar_url,
              first_name: item.user.first_name,
              last_name: item.user?.last_name,
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
