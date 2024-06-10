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
    <Sidebar id="sidebar"
    className="absolute inset-y-0 left-0 flex h-full flex-col border-r bg-[#F7F7F7] lg:flex">
      <div className="flex flex-col items-center py-4">
        <h1 className="text-2xl font-bold mb-4">OwlMark</h1>
      </div>
     { /* Profile navigation */ }
     { /* Separate component */ }
     { /* Sign out */ }
    </Sidebar>
  );
};

export default PageSidebar;
