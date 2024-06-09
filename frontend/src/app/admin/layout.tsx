import React from "react";
import PageSidebar from "../components/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="container grid grid-cols-9">
      <div className="sidebar col-span-1">
        <PageSidebar />
      </div>
      <div className="content col-span-8">{children}</div>
    </div>
  );
};

export default Layout;
