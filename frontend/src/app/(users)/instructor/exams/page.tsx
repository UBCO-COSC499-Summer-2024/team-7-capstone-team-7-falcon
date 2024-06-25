"use client";
import React, { useEffect, useState } from "react";
import TableComponent from "../components/TableComponent";
import { TabItem } from "flowbite-react";
import { nodes } from "../components/mockData";
import { COLUMNS as columns } from "../components/columns"; //
import { DataItem } from "../components/type";
/**
 * Renders the page component for the exams the instructor has created.
 * @component
 * @returns TSX Element
 */
const instructorExams: React.FC = () => {
  // const [data, setData] = useState<DataItem>({ nodes });
  // const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    //fetches data from the server
    //setcolumns
    // setData
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Instructor Exams</h1>
      <div className="grid grid-cols-6">
        <div className="col-span-4">
          <TableComponent data={nodes} columns={columns}></TableComponent>
        </div>
        <div className="col-span-2">
          <h1>Exam Details</h1>
        </div>
      </div>
    </div>
  );
};

export default instructorExams;
