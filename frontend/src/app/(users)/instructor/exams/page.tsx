import React from "react";
import Component from "../components/viewResultsTable";
/**
 * Renders the page component for the exams the instructor has created.
 * @component
 * @returns TSX Element
 */
const instructorExams: React.FC = () => {
  return (
    <div>
      <h1>Instructor Exams</h1>
      <Component />
    </div>
  );
};

export default instructorExams;
