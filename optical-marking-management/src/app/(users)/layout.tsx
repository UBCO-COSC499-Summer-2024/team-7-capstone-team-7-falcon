import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="container grid grid-cols-9">
      <div className="sidebar col-span-1">
        {/* Put the sidebar component here when it's ready */}
        <h1>Sidebar</h1>
      </div>
      <div className="content col-span-8">{children}</div>
    </div>
  );
};

export default Layout;
