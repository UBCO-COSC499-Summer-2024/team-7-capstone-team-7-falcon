'use client'
import React, { createContext, useState, useContext } from 'react';

const userInfoContext = createContext();

export const UserInfoProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({
      "firstName": "John",
      "lastName": "Doe",
      "email": null,
      "role": "student",
      "avatarUrl": 'https://lh3.googleusercontent.com/a/ACg8ocJGyUr16ouiYlFqBT3aDdB-KovZMc7vFuUslZdT93kJekVonRLY=s96-c',
    });

  return (
    <userInfoContext.Provider value={{userInfo, setUserInfo}}>
      {children}
    </userInfoContext.Provider>
  );
};

export const useUserInfo = () => useContext(userInfoContext);
