import React from "react";
import { Avatar, Sidebar } from "flowbite-react";

const PageSidebar: React.FC<PageSidebarProps> = () => {
  return (
    <Sidebar id="sidebar">
      <div className="flex flex-col items-center py-4">
        <h1 className="text-2xl font-bold mb-4">OwlMark</h1>
      </div>
    </Sidebar>
  );
};

export default PageSidebar;
