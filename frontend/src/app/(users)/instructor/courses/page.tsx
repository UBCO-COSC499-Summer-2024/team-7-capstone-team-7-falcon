import React from "react";
import UserTable from "../components/peopleTable";
import TableComponent from "../components/viewResultsTable";

/**
 * Renders the page component for the exams the Student has taken or is scheduled to take.
 * @component
 * @returns TSX Element
 */
const StudentExams: React.FC = () => {
  return (
    <div>
      <h1>COSC 304 People</h1>
      <TableComponent>
        <UserTable />
      </TableComponent>
    </div>
  );
};

export default StudentExams;
