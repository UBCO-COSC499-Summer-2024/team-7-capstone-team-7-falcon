import React from "react";
import Sidebar from "../components/sidebar";
import { UserInfoProvider } from "../contexts/userContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <UserInfoProvider>
        <div className="sidebar flex-none w-80">
          <Sidebar />
        </div>
        <div className="content flex-grow">{children}</div>
      </UserInfoProvider>
    </div>
  );
};

export default Layout;
