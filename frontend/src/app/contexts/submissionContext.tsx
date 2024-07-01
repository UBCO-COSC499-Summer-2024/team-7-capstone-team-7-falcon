"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Submission } from "../typings/backendDataTypes";

interface SubmissionContextType {
  submissions?: Submission[];
}

const SubmissionContext = createContext<SubmissionContextType>({});

// provider provides context and parses the information into Submission[]
const SubmissionProvider = ({
  children,
  submissions,
}: {
  submissions: Submission[];
  children: ReactNode;
}) => {
  return (
    <SubmissionContext.Provider value={{ submissions }}>
      {children}
    </SubmissionContext.Provider>
  );
};

export const useSubmissionContext = () => {
  const context = useContext(SubmissionContext);
  if (context === undefined) {
    throw new Error(
      "useSubmissionContext must be used within a SubmissionProvider",
    );
  }

  return context;
};

export default SubmissionProvider;
