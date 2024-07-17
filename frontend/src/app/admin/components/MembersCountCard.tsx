"use client";
import React from "react";
import useFetchUsersCount from "../../admin/components/useFetchUsersCount";
import CountCard from "./CountCard";

interface MembersCountCardProps {
  className?: string;
}

const MembersCountCard: React.FC<MembersCountCardProps> = ({ className }) => {
  const membersCount = useFetchUsersCount();

  return (
    <CountCard
      count={membersCount}
      title="Members"
      className={className}
      width="w-1/4"
    />
  ); // Set the width prop
};

export default MembersCountCard;
