import React from "react";
import AllExamsTable from "../components/allExamsTable";

/**
 * Renders the page component for the exams the instructor has created.
 * @component
 * @returns TSX Element
 */
const instructorExams: React.FC = () => {
  return (
    <div>
      <p className="p-2 text-4xl font-bold">Exams</p>
      <AllExamsTable />
    </div>
  );
};

export default instructorExams;
