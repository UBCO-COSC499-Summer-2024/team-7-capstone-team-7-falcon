import React from "react";
import TableComponent from "../components/viewResultsTable";
import ExamTable from "../components/examTable";
import { TabItem } from "flowbite-react";
/**
 * Renders the page component for the exams the instructor has created.
 * @component
 * @returns TSX Element
 */
const instructorExams: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Instructor Exams</h1>
      <div className="grid grid-cols-6">
        <div className="col-span-4">
          <TableComponent>
            <ExamTable data={nodes} />
          </TableComponent>
        </div>
        <div className="col-span-2">
          <h1>Exam Details</h1>
        </div>
      </div>
    </div>
  );
};

export default instructorExams;
