import React from "react";
import Sidebar from "../components/sidebar";
import { UserInfoProvider } from "../contexts/userContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <UserInfoProvider>
      <div className="flex">
        <Sidebar />
        <div className="relative h-full w-full overflow-y-auto">
          {children}
        </div>
      </div>
    </UserInfoProvider>
  );
};

export default Layout;
