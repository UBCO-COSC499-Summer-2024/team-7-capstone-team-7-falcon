import React, { createContext, useContext, useState, ReactNode } from "react";
import { examsAPI } from "../api/examAPI";

interface GradeContextType {
  grades: { [key: string]: number };
  updateGrade: (key: string, grade: number) => void;
}

const GradeContext = createContext<GradeContextType | undefined>(undefined);

export const GradeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [grades, setGrades] = useState<{ [key: string]: number }>({});

  const updateGrade = (key: string, grade: number) => {
    setGrades((prevGrades) => ({ ...prevGrades, [key]: grade }));
  };

  return (
    <GradeContext.Provider value={{ grades, updateGrade }}>
      {children}
    </GradeContext.Provider>
  );
};

export const useGrade = (
  examId: number,
  courseId: number,
  submissionId: number,
  grade: number,
) => {
  const context = useContext(GradeContext);
  examsAPI.updateGrade(examId, courseId, submissionId, grade);
  if (!context) {
    throw new Error("useGrade must be used within a GradeProvider");
  }
  return context;
};
