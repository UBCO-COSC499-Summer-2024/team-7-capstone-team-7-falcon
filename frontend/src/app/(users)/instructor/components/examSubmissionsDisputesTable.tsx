"use client";
import { examsAPI } from "@/app/api/examAPI";
import TableComponent from "@/app/components/tableComponent";
import { Column, DataItem } from "@/app/components/type";
import { ExamSubmissionsDisputes } from "@/app/typings/backendDataTypes";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type ExamDisputesTableProps = {
  courseId: number;
  examId: number;
};

const dispute_columns: Column[] = [
  { label: "#", renderCell: (item) => item.disputeId },
  { label: "Status", renderCell: (item) => item.status },
  {
    label: "Created At",
    renderCell: (item) => new Date(Number(item.createdAt)).toLocaleString(),
  },
  {
    label: "Actions",
    renderCell: (item) => (
      <Link href={`./${item.examId}/dispute/${item.disputeId}`}>
        <button type="button" className="btn-primary flex p-1 px-4">
          View
        </button>
      </Link>
    ),
  },
];

const ExamSubmissionsDisputesTable: React.FC<ExamDisputesTableProps> = ({
  courseId,
  examId,
}) => {
  const [data, setData] = useState<DataItem<ExamSubmissionsDisputes>[] | null>(
    null,
  );

  const transformDisputeStatus = (status: string) => {
    switch (status) {
      case "CREATED":
        return "Needs Review";
      case "RESOLVED":
        return "Resolved";
      case "REJECTED":
        return "Rejected";
      case "REVIEWING":
        return "Reviewing";
      default:
        return status;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await examsAPI.getExamSubmissionsDisputes(
        courseId,
        examId,
      );

      const disputes: DataItem<ExamSubmissionsDisputes>[] = result.data.map(
        (item: ExamSubmissionsDisputes) => ({
          id: item.id,
          name: `${item.id}`,
          data: {
            disputeId: item.id,
            examId,
            status: transformDisputeStatus(item.status),
            createdAt: item.created_at,
          },
        }),
      );
      setData(disputes);
    };
    fetchData();
  }, []);

  if (!data) {
    return <p>Data not found</p>;
  }

  return (
    <TableComponent<ExamSubmissionsDisputes>
      data={data}
      columns={dispute_columns}
      showPagination={false}
      inputPlaceholderText="Search by dispute id"
    />
  );
};

export default ExamSubmissionsDisputesTable;
