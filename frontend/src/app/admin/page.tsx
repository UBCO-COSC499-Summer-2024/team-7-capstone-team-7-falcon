import React from "react";
import CourseCountCard from "../admin/components/CourseCountCard";
import MembersCountCard from "../admin/components/MembersCountCard";
import ProfessorsCountCard from "../admin/components/ProfessorsCountCard";

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 gap-1 mb-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <CourseCountCard className="w-64" />
        <MembersCountCard className="w-64" />
        <ProfessorsCountCard className="w-64" />
      </div>
    </div>
  );
};

export default AdminDashboard;
