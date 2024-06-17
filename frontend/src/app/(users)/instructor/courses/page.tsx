import React from "react";
import Component from "../components/peopleTable";

/**
 * Renders the page component for the exams the Student has taken or is scheduled to take.
 * @component
 * @returns TSX Element
 */
const StudentExams: React.FC = () => {
  return (
    <div>
      <h1>COSC 304 People</h1>
      <Component />
    </div>
  );
};

export default StudentExams;
