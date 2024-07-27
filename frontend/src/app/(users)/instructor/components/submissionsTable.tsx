"use client";

import React, { useEffect, useState } from "react";
import { Column, DataItem } from "../../../components/type";
import { Submission } from "../../../typings/backendDataTypes";
import { useSubmissionContext } from "../../../contexts/submissionContext";
import TableComponent from "../../../components/tableComponent";
import Link from "next/link";
import { Badge } from "flowbite-react";

const exam_columns: Column[] = [
  {
    label: "Name",
    renderCell: (item) => (
      <div className="flex space-x-4 items-center">
        {!item.user.first_name && !item.user.last_name && (
          <div className="mt-1 truncate flex-1 text-red-600">
            Missing user details
          </div>
        )}

        {item.user.first_name && (
          <div className="font-medium">
            {item.user.first_name} {item.user.last_name ?? ""}
          </div>
        )}
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
    renderCell: (item) => <div className="font-medium">{item.updated_at}</div>,
  },
  {
    label: "Status",
    renderCell: (item) => (
      <>
        {item.answers.isFlagged && (
          <Badge className="p-2" color="red">
            Requires attention
          </Badge>
        )}
        {!item.answers.isFlagged && (
          <Badge className="p-2" color="green">
            Completed
          </Badge>
        )}
      </>
    ),
  },
  {
    label: "Actions",
    renderCell: (item) => (
      <Link href={`../exam/${item.exam_id}/submissions/${item.submission_id}`}>
        <button type="button" className="btn-primary flex p-1 px-4">
          View
        </button>
      </Link>
    ),
  },
];

type ExamTableProps = {
  exam_id: number;
};

const SubmissionTable: React.FC<ExamTableProps> = ({ exam_id }) => {
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
              id: item.user.id,
              first_name: item.user.first_name,
              last_name: item.user?.last_name,
            },
            submission_id: item.submission_id,
            score: item.score,
            updated_at: item.updated_at,
            answers: item.answers,
            exam_id: String(exam_id),
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
