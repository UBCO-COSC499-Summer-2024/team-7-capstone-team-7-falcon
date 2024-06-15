import React from "react";
import Sidebar from "../components/sidebar";
import { UserInfoProvider } from "../contexts/userContext";
import ContentContainer from "../components/contentContainer";
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <UserInfoProvider>
      <div className="flex">
        <Sidebar />
        <ContentContainer>{children}</ContentContainer>
      </div>
    </UserInfoProvider>
  );
};

export default Layout;
