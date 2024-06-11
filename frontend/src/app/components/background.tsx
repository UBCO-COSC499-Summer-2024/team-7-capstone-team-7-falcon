import React from "react";

interface BackgroundProps {
  children: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <div className="bg-gray-100 w-full">
      <div className="relative h-screen w-full bg-[#f8f9fb] rounded-3xl shadow-md   ">{children}</div>
    </div>
  );
};

export default Background;
