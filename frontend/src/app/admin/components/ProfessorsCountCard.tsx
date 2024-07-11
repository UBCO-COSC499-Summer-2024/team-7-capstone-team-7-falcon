import React from "react";
import { Card } from "flowbite-react"; // Adjust according to your UI library

interface ProfessorsCountCardProps {
  professorsCount: number; // Required: Number of courses to display
  className?: string; // Optional: Additional CSS classes
}

const ProfessorsCountCard: React.FC<ProfessorsCountCardProps> = ({
  professorsCount,
  className,
}) => {
  return (
    <Card
      className={` max-w-sm bg-purple-700 p-2 rounded-xl shadow-md ${className}`}
    >
      <div className="text-center">
        <div className="text-3xl font-bold text-white mt-2">
          {professorsCount}
        </div>
        <h2 className="text-lg font-semibold text-white">Professors</h2>
      </div>
    </Card>
  );
};

export default ProfessorsCountCard;
