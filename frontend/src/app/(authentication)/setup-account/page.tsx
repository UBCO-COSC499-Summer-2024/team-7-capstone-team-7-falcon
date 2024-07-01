"use client";
import React, { useState, FormEvent } from "react";
import { usersAPI } from "@/app/api/usersAPI";
import { User } from "@/app/typings/backendDataTypes";
import { useRouter } from "next/navigation";
import { Status } from "../../typings/backendDataTypes";
import AccountSetupForm from "../components/accountSetupForm";
import RedirectModal from "../components/redirectModal";

export default function AccountSetup() {
  const router = useRouter();
  const [status, setStatus] = useState(Status.Pending);

  // stores data needed for the redirect modal
  const [redirectInfo, setRedirectInfo] = useState({
    message: "",
    redirectPath: "",
    buttonText: "",
  });

  // stores data to be sent to the database
  const [userIDs, setUserIDs] = useState({
    student_id: "",
    employee_id: "",
  });

  const handleInputChange = (fieldName: string, value: string) => {
    setUserIDs({
      ...userIDs,
      [fieldName]: value,
    });
  };

  async function onSetup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const userDetails: User = await usersAPI.getUserDetails();
      const userIdPk: string = userDetails.id; // primary key in user database

      // update user details in database

      // set any error messages
    } catch (error) {
      throw error;
    }
  }

  return (
    <AccountSetupForm
      userID={userIDs}
      handleInputChange={handleInputChange}
      onSetup={onSetup}
    />
  );
}
