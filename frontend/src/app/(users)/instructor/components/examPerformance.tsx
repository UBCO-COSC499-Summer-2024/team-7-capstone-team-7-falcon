import React from "react";
import { examsAPI } from "../../../api/examAPI";
import GradeDisplay from "./gradeDisplay";

const ExamPerformance: React.FC = async () => {
  const examStats = await examsAPI.getExamStats();

  return (
    <div className="rounded ring-gray-300 ring-4 p-3">
      <p className="font-bold mb-2">Exam Performance</p>
      <div className="space-x-12 flex">
        <GradeDisplay progress={50} text={"Average"} />
        <GradeDisplay progress={50} text={"Minimum"} />
        <GradeDisplay progress={50} text={"Maximum"} />
      </div>
    </div>
  );
};

export default ExamPerformance;
