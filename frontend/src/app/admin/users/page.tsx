import React from "react";
import UserTable from "../components/usersTable";
import { Toaster } from "react-hot-toast";

/**
 * Renders the admin user management page.
 * @component
 * @returns TSX element
 */
const AdminUserManagement: React.FC = () => {
  return (
    <div>
      <p className="p-2 text-4xl font-bold border-b-2 mb-4">Users</p>
      <Toaster />
      <UserTable />
    </div>
  );
};

export default AdminUserManagement;
