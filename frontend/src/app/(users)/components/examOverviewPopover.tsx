import { CSSProperties } from "react";
import GradeDisplay from "./gradeDisplay";

interface ExamOverviewPopoverProps {
  stats: {
    meanValue?: number;
    upperQuartile?: number;
    max?: number;
    medianValue?: number;
    min?: number;
    lowerQuartile?: number;
  };
}

const ExamOverviewPopover: React.FC<ExamOverviewPopoverProps> = ({ stats }) => {
  return (
    <div className="p-3">
      <p className="text-lg font-bold">Exam Overview</p>
      <div className="grid mt-4 grid-rows-2 grid-flow-col gap-4">
        <GradeDisplay
          progress={String(stats.meanValue)}
          text="Mean"
          properties={
            {
              "--size": "4rem",
              "--thickness": "0.4rem",
              "--progress": String(stats.meanValue),
            } as CSSProperties
          }
          textStyle={"font-normal text-normal"}
        />

        <GradeDisplay
          progress={String(stats.upperQuartile)}
          text="Upper Quartile"
          properties={
            {
              "--size": "4rem",
              "--thickness": "0.4rem",
              "--progress": String(stats.upperQuartile),
            } as CSSProperties
          }
          textStyle={"font-normal text-normal"}
        />
        <GradeDisplay
          progress={String(stats.max)}
          text="Max"
          properties={
            {
              "--size": "4rem",
              "--thickness": "0.4rem",
              "--progress": String(stats.max),
            } as CSSProperties
          }
          textStyle={"font-normal text-normal"}
        />

        <GradeDisplay
          progress={String(stats.medianValue)}
          text="Median"
          properties={
            {
              "--size": "4rem",
              "--thickness": "0.4rem",
              "--progress": String(stats.medianValue),
            } as CSSProperties
          }
          textStyle={"font-normal text-normal"}
        />

        <GradeDisplay
          progress={String(stats.min)}
          text="Min"
          properties={
            {
              "--size": "4rem",
              "--thickness": "0.4rem",
              "--progress": String(stats.min),
            } as CSSProperties
          }
          textStyle={"font-normal text-normal"}
        />

        <GradeDisplay
          progress={String(stats.lowerQuartile)}
          text="Lower Quartile"
          properties={
            {
              "--size": "4rem",
              "--thickness": "0.4rem",
              "--progress": String(stats.lowerQuartile),
            } as CSSProperties
          }
          textStyle={"font-normal text-normal"}
        />
      </div>
    </div>
  );
};

export default ExamOverviewPopover;
