"use client";
import React, { CSSProperties } from "react";
import GradeDisplay from "../../components/gradeDisplay";
import { useSubmissionContext } from "../../../contexts/submissionContext";
import { Submission } from "../../../typings/backendDataTypes";

const calculateStats = (submissions?: Submission[]) => {
  if (!submissions || submissions.length === 0) {
    return { average: 0, max: 0, min: 0 };
  }

  let total = 0;
  let max = -Infinity;
  let min = Infinity;
  let skip = 0;

  submissions.forEach((item) => {
    const value = item.score;

    // Doesn't add to the total, min, or max if -1 placeholder value is used
    if (value === -1) {
      skip += 1;
      return;
    }
    total += value;
    if (value > max) max = value;
    if (value < min) min = value;
  });

  // Calculate average
  const validCount = submissions.length - skip;
  let average = validCount > 0 ? total / validCount : 0;

  // If all submissions are skipped, set average, max, and min to 0
  if (validCount === 0) {
    average = 0;
    max = 0;
    min = 0;
  }
  average = Math.round(average);
  min = Math.round(min);
  max = Math.round(max);

  return { average, min, max };
};

const ExamPerformance: React.FC = () => {
  const { submissions } = useSubmissionContext();
  const { average, max, min } = calculateStats(submissions);

  return (
    <div className="rounded ring-gray-300 ring-4 p-3">
      <p className="font-bold mb-2">Exam Performance</p>
      <div className="flex flex-wrap lg:justify-between justify-stretch md:justify-center">
        <GradeDisplay
          properties={{ "--progress": average } as CSSProperties}
          text={"Average"}
          progress={`${average}%`}
        />
        <GradeDisplay
          properties={{ "--progress": min } as CSSProperties}
          text={"Minimum"}
          progress={`${min}%`}
        />
        <GradeDisplay
          properties={{ "--progress": max } as CSSProperties}
          text={"Maximum"}
          progress={`${average}%`}
        />
      </div>
    </div>
  );
};

export default ExamPerformance;
