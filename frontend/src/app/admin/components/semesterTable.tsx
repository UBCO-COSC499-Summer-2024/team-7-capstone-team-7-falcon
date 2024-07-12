"use client";
import React, { useEffect, useState } from "react";
import { Column, DataItem } from "./type";
import TableComponent from "../components/tableComponent";
import Link from "next/link";
import { SemesterData } from "@/app/typings/backendDataTypes";
import { semestersAPI } from "@/app/api/semestersAPI";

const user_columns: Column[] = [
  { label: "#", renderCell: (item) => item.id },
  {
    label: "Semester Name",
    renderCell: (item) => item.semester_name,
  },
  { label: "Start Date", renderCell: (item) => item.starts_at },
  { label: "End Date", renderCell: (item) => item.ends_at },
  { label: "Courses", renderCell: (item) => item.course_count },
  {
    label: "Actions",
    renderCell: (item) => (
      <Link href={"/semesters"}>
        <button type="button" className="btn-primary flex p-1 px-4">
          Edit
        </button>
      </Link>
    ),
  },
];

const SemesterTable: React.FC<> = () => {
  const [data, setData] = useState<DataItem<SemesterData>[] | null>(null);

  // gets the data once on mount
  useEffect(() => {
    const fetchData = async () => {
      const result = await semestersAPI.getAllSemesters();

      const semesters: DataItem<SemesterData>[] = result.map(
        (item: SemesterData) => ({
          id: item.id,
          name: item.name,
          data: {
            id: item.id,
            semester_name: item.name,
            starts_at: item.starts_at,
            ends_at: item.ends_at,
            course_count: item.course_count,
          },
        }),
      );

      setData(semesters);
    };
    fetchData();
  }, []);

  if (!data) {
    return <p>No semesters found</p>;
  }

  return <TableComponent<SemesterData> data={data} columns={user_columns} />;
};

export default SemesterTable;
