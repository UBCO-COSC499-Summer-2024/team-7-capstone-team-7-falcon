import React from "react";

const GradeDisplay: React.FC<{ progress: number; text: string }> = ({
  progress,
  text,
}) => {
  const radialProgressStyle: React.CSSProperties = {
    "--progress": progress, // Progress value
  } as any;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="radial-progress text-black" style={radialProgressStyle}>
        <div className="relative z-10">
          <p className="text-center">{progress}%</p>
        </div>
      </div>
      <p className="font-bold relative text-center mt-3">{text}</p>
    </div>
  );
};

export default GradeDisplay;
