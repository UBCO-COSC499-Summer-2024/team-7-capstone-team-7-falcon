"use client";
import React from "react";
import DashboardDataProvider from "../admin/components/DashboardData";

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <DashboardDataProvider />
    </div>
  );
};

export default AdminDashboard;
