"use client";
import React, { useState, FormEvent } from "react";
import { usersAPI } from "@/app/api/usersAPI";
import { User } from "@/app/typings/backendDataTypes";
import { useRouter } from "next/navigation";
import { redirectModalData } from "../../typings/backendDataTypes";
import AccountSetupForm from "../components/accountSetupForm";
import RedirectModal from "../components/redirectModal";

export default function AccountSetup() {
  const router = useRouter();

  // stores data needed for the redirect modal
  const [redirectInfo, setRedirectInfo] = useState<redirectModalData>({
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
      const userFirstName: string = userDetails.first_name; // required argument by the backend

      const newUserDetails = {
        first_name: userFirstName,
        student_id:
          userIDs.student_id !== "" ? Number(userIDs.student_id) : null,
        employee_id:
          userIDs.employee_id !== "" ? Number(userIDs.employee_id) : null,
      };

      // update user details in database
      await usersAPI.updateUserDetails(userIdPk, newUserDetails);

      // if no errors, redirect to the dashboard
      router.push("/");

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
