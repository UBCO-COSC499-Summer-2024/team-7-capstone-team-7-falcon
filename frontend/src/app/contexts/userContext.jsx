'use client'
import React, { createContext, useState, useContext } from 'react';

const userInfoContext = createContext();

export const UserInfoProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({
      "firstName": "john",
      "lastName": null,
      "email": null,
      "role": null,
    });
    
  return (
    <userInfoContext.Provider value={{userInfo, setUserInfo}}>
      {children}
    </userInfoContext.Provider>
  );
};

export const useUserInfo = () => useContext(userInfoContext);