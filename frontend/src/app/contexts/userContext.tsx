'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';

enum Role {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
}

// Define type for user information
interface UserInfo {
  firstName: string;
  lastName: string;
  email: string | null;
  role: Role;
  avatarUrl: string;
}

// Define context type
interface UserInfoContextType {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}

// Create context
const userInfoContext = createContext<UserInfoContextType | undefined>(undefined);

// Define props type for UserInfoProvider
interface UserInfoProviderProps {
  children: ReactNode;
}

/**
 * Provider for user information
 * @param param0 {UserInfoProviderProps} - Children
 * @returns {JSX.Element} - User info provider
 */
export const UserInfoProvider: React.FC<UserInfoProviderProps> = ({ children }: UserInfoProviderProps): JSX.Element => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "John",
    lastName: "Doe",
    email: null,
    role: Role.STUDENT,
    avatarUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJGyUr16ouiYlFqBT3aDdB-KovZMc7vFuUslZdT93kJekVonRLY=s96-c',
  });

  return (
    <userInfoContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </userInfoContext.Provider>
  );
};

/**
 * Hook to use user information
 * @returns {UserInfoContextType} - User information context
 */
export const useUserInfo = (): UserInfoContextType => {
  const context = useContext(userInfoContext);

  if (context === undefined) {
    throw new Error('useUserInfo must be used within a UserInfoProvider');
  }

  return context;
};