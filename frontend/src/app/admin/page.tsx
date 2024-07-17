"use client";
import React from "react";
import CourseCountCard from "../admin/components/CourseCountCard";
import MembersCountCard from "../admin/components/MembersCountCard";
import ProfessorsCountCard from "../admin/components/ProfessorsCountCard";

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="flex space-x-2">
        <CourseCountCard />
        <MembersCountCard />
        <ProfessorsCountCard />
      </div>
    </div>
  );
};

export default Dashboard;
