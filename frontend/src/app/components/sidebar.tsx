import React from "react";
import { Sidebar } from "flowbite-react";

/**
 * Renders the sidebar component which shows on all pages in routes
 *
 * @component
 * @returns TSX Element
 */
const PageSidebar: React.FC = () => {
  return (
    <Sidebar id="sidebar">
      <div className="flex flex-col items-center py-4">
        <h1 className="text-2xl font-bold mb-4">OwlMark</h1>
      </div>
    </Sidebar>
  );
};

export default PageSidebar;
