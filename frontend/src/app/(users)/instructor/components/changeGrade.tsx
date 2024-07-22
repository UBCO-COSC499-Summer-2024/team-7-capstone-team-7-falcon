"use client";
import React, { useRef, useState } from "react";
import { examsAPI } from "../../../api/examAPI";

interface ChangeGradeProps {
  examId: number;
  courseId: number;
  submissionId: number;
  currentGrade: number;
}

const ChangeGrade: React.FC<ChangeGradeProps> = ({
  examId,
  courseId,
  submissionId,
  currentGrade,
}) => {
  const [grade, setGrade] = useState(currentGrade);

  const handleInputChange = (e: any) => {
    setGrade(e.target.value);
  };

  const handleKeyPress = async (e: any) => {
    if (e.key === "Enter") {
      examsAPI.updateGrade(examId, courseId, submissionId, grade);
    }
  };

  return (
    <>
      <label htmlFor="grade-input" className="mr-2 font-bold">
        Enter new grade
      </label>
      <input
        type="text"
        value={grade}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        className="border p-2"
      />
    </>
  );
};

export default ChangeGrade;
