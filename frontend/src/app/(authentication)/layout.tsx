import React from "react";
import { FormUserInfoProvider } from "../contexts/SignUpFormContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <FormUserInfoProvider>
      {/* <div className="flex">
                {children}
            </div> */}
      {children}
    </FormUserInfoProvider>
  );
};

export default Layout;
