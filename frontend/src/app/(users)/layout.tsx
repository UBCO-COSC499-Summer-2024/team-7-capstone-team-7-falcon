import React from "react";
import Sidebar from "../components/sidebar";
import { UserInfoProvider } from "../contexts/userContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-9">
      <UserInfoProvider>
        <div className="sidebar col-span-1">
          <Sidebar />
        </div>
        <div className="content col-span-8">{children}</div>
      </UserInfoProvider>
    </div>
  );
};

export default Layout;
