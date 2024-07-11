import React from "react";
import { Card } from "flowbite-react"; // Adjust according to your UI library

interface MembersCountCardProps {
  membersCount: number; // Required: Number of courses to display
  className?: string; // Optional: Additional CSS classes
}

const MembersCountCard: React.FC<MembersCountCardProps> = ({
  membersCount,
  className,
}) => {
  return (
    <Card className={` bg-purple-700 p-2 rounded-xl shadow-md ${className}`}>
      <div className="text-center">
        <div className="text-3xl font-bold text-white mt-2">{membersCount}</div>
        <h2 className="text-lg font-semibold text-white">Members</h2>
      </div>
    </Card>
  );
};

export default MembersCountCard;
