import React from "react";
import Sidebar from "../components/sidebar";
import { UserInfoProvider } from "../contexts/userContext";
import Background from "../components/background";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <UserInfoProvider>
      <div className="flex">
        <Sidebar />
        {/* <div className="relative h-screen w-full overflow-y-auto"> */}
        <Background>
          {children}
        </Background>
        {/* </div> */}
      </div>
    </UserInfoProvider>
  );
};

export default Layout;
