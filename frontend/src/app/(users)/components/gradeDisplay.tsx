import React from "react";

const GradeDisplay: React.FC<{
  progress: string;
  text: string;
  properties: React.CSSProperties;
  textStyle?: string;
}> = ({ progress, text, properties, textStyle }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="radial-progress text-black" style={properties}>
        <p className={`relative z-10 text-center ${textStyle}`}>{progress}</p>
      </div>
      <p className="font-bold text-center mt-3">{text}</p>
    </div>
  );
};

export default GradeDisplay;
