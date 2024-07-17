"use client";
import React from "react";
import useFetchUsersCount from "../../admin/components/useFetchUsersCount";
import CountCard from "./CountCard";

interface ProfessorsCountCardProps {
  className?: string;
}

const ProfessorsCountCard: React.FC<ProfessorsCountCardProps> = ({
  className,
}) => {
  const professorsCount = useFetchUsersCount("professor");

  return (
    <CountCard
      count={professorsCount}
      title="Professors"
      className={className}
      width="w-1/4"
    />
  ); // Set the width prop
};

export default ProfessorsCountCard;
