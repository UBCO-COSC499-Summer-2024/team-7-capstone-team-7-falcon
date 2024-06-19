import React from "react";
import Component from "../components/Coursetable";

/**
 * Renders the page component for the exams the Student has taken or is scheduled to take.
 * @component
 * @returns TSX Element
 */
const StudentExams: React.FC = () => {
  return (
    <div>
      <h1>Student Exams</h1>
      <Component />
    </div>
  );
};

export default StudentExams;
