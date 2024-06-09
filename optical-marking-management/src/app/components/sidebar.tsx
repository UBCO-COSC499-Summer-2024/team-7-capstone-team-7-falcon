import React from "react";
import { Avatar, Sidebar } from "flowbite-react";
import {
  HiBookOpen,
  HiOutlineDocument,
  HiOutlineQuestionMarkCircle,
  HiOutlineLogout,
} from "react-icons/hi";

interface PageSidebarProps {}

const PageSidebar: React.FC<PageSidebarProps> = (props) => {
  return (
    <Sidebar id="sidebar">
      <div className="flex flex-col items-center py-4">
        <h1 className="text-2xl font-bold mb-4">Falcon</h1>
        <Avatar
          img="/path/to/avatar.jpg"
          size="xl"
          rounded={true}
          className="mb-4"
        />
        <div className="text-center mb-4">
          <p className="text-gray-600">Welcome back,</p>
          <p className="text-gray-900 font-bold">John Doe</p>
        </div>
      </div>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            href="#"
            icon={HiBookOpen}
            className="text-white bg-purple-600 hover:bg-purple-700"
          >
            Courses
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiOutlineDocument} disabled>
            Exams
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiOutlineQuestionMarkCircle} disabled>
            Help
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
      <div className="flex justify-center p-4">
        <button className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100">
          <HiOutlineLogout className="w-5 h-5" />
          <span className="ml-3">Sign-out</span>
        </button>
      </div>
    </Sidebar>
  );
};

export default PageSidebar;
