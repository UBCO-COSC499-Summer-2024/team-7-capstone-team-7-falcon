"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define type for user information
interface FormUserInfo {
  first_name: string;
  last_name: string | null;
  email: string;
  password: string;
  confirm_password: string;
  student_id: number | null;
  employee_id: number | null;
}

// Define context type
interface FormUserInfoContextType {
  formUserInfo: FormUserInfo;
  setFormUserInfo: React.Dispatch<React.SetStateAction<FormUserInfo>>;
}

// Create context
const formUserInfoContext = createContext<FormUserInfoContextType | undefined>(
  undefined,
);

// Define props type for FormUserInfoProvider
interface FormUserInfoProviderProps {
  children: ReactNode;
}

/**
 * Provider for form user information
 * @param param0 {FormUserInfoProviderProps} - Children
 * @returns {JSX.Element} - Form User info provider
 */
export const FormUserInfoProvider: React.FC<FormUserInfoProviderProps> = ({
  children,
}: FormUserInfoProviderProps): JSX.Element => {
  const [formUserInfo, setFormUserInfo] = useState<FormUserInfo>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    student_id: null,
    employee_id: null,
  });

  return (
    <formUserInfoContext.Provider value={{ formUserInfo, setFormUserInfo }}>
      {children}
    </formUserInfoContext.Provider>
  );
};

/**
 * Hook to use form user information
 * @returns {FormUserInfoContextType} - Form User information context
 */
export const useFormUserInfo = (): FormUserInfoContextType => {
  const context = useContext(formUserInfoContext);

  if (context === undefined) {
    throw new Error(
      "useFormUserInfo must be used within a FormUserInfoProvider",
    );
  }

  return context;
};
