"use client";
import { coursesAPI } from "@/app/api/coursesAPI";
import TableComponent from "@/app/components/tableComponent";
import { Column, DataItem } from "@/app/components/type";
import { ExamDisputes } from "@/app/typings/backendDataTypes";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type ExamDisputesTableProps = {
  courseId: number;
};

const dispute_columns: Column[] = [
  { label: "#", renderCell: (item) => item.id },
  { label: "Exam Name", renderCell: (item) => item.examName },
  {
    label: "Number of Active Disputes",
    renderCell: (item) => item.numberOfDisputes,
  },
  {
    label: "Actions",
    renderCell: (item) => (
      <Link href={`./disputes/exam/${item.id}`}>
        <button type="button" className="btn-primary flex p-1 px-4">
          View
        </button>
      </Link>
    ),
  },
];

const ExamsSubmissionsDisputesTable: React.FC<ExamDisputesTableProps> = ({
  courseId,
}) => {
  const [data, setData] = useState<DataItem<ExamDisputes>[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await coursesAPI.getExamSubmissionsDisputes(courseId);

      const disputes: DataItem<ExamDisputes>[] = result.data.map(
        (item: ExamDisputes) => ({
          id: item.examId,
          name: item.examName,
          data: {
            id: item.examId,
            examName: item.examName,
            numberOfDisputes: item.numberOfDisputes,
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
    <TableComponent<ExamDisputes>
      data={data}
      columns={dispute_columns}
      showPagination={false}
    />
  );
};

export default ExamsSubmissionsDisputesTable;
