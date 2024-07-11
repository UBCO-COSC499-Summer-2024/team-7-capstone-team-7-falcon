"use client";
import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import { usersAPI } from "../../api/usersAPI";

interface ProfessorsCountCardProps {
  className?: string;
}

const ProfessorsCountCard: React.FC<ProfessorsCountCardProps> = ({
  className,
}) => {
  const [professorsCount, setProfessorsCount] = useState<number>(0);

  useEffect(() => {
    fetchProfessorsCount();
  }, []);

  const fetchProfessorsCount = async () => {
    try {
      const response = await usersAPI.getAllUsersCount();
      const professors = response.find(
        (item: { role: string }) => item.role === "professor",
      );
      if (professors) {
        setProfessorsCount(professorsCount);
      }
    } catch (error) {
      console.error("Error fetching professors count:", error);
    }
  };

  return (
    <Card className={`bg-purple-700 p-2 rounded-xl shadow-md ${className}`}>
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
