import React from "react";
import CoursesTable from "../components/coursesTable";

/**
 * Renders the admin course management page.
 * @component
 * @returns TSX element
 */
const AdminCourseManagement: React.FC = () => {
  return (
    <div>
      <div className="mt-2">
        <h2 className="text-2xl font-bold mb-4">Courses</h2>
        <hr />
        <CoursesTable />
      </div>
    </div>
  );
};

export default AdminCourseManagement;
