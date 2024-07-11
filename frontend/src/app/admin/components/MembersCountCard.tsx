// MembersCountCard.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import { usersAPI } from "../../api/usersAPI";

interface MembersCountCardProps {
  className?: string;
}

const MembersCountCard: React.FC<MembersCountCardProps> = ({ className }) => {
  const [membersCount, setMembersCount] = useState<number>(0);

  useEffect(() => {
    fetchMembersCount();
  }, []);

  const fetchMembersCount = async () => {
    try {
      const response = await usersAPI.getAllUsersCount();
      const totalMembersCount = response.reduce(
        (acc: number, curr: { role: string; count: number }) =>
          acc + curr.count,
        0,
      );
      setMembersCount(totalMembersCount);
      console.log("Members count fetched:", totalMembersCount);
    } catch (error) {
      console.error("Error fetching members count:", error);
    }
  };

  return (
    <Card className={`bg-purple-700 p-2 rounded-xl shadow-md ${className}`}>
      <div className="text-center">
        <div className="text-3xl font-bold text-white mt-2">{membersCount}</div>
        <h2 className="text-lg font-semibold text-white">Members</h2>
      </div>
    </Card>
  );
};

export default MembersCountCard;
