"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import AccountSetupForm from "../components/accountSetupForm";
import { Status } from "../../typings/backendDataTypes";

export default function AccountSetup() {
  const router = useRouter();

  const [userID, setUserID] = useState({
    student_id: "",
    employee_id: "",
  });

  const handleInputChange = (fieldName: string, value: string) => {
    setUserID({
      ...userID,
      [fieldName]: value,
    });
  };

  async function onSetup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(userID);
  }

  // async function onSetup(event: FormEvent<HTMLFormElement>) {
  //   event.preventDefault();
  //   const jsonPayload = JSON.stringify(user);
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register/`,
  //       {
  //         method: "POST",
  //         body: jsonPayload,
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       },
  //     );
  //     // if (!response.ok) {
  //     //   throw new Error('Failed to submit the data. Please try again.')
  //     // }
  //   } catch (error) {
  //     // Capture the error message to display to the user
  //     setError(error.message);
  //     console.error(error);
  //   }
  //   // } finally {
  //   //   setIsLoading(false)
  //   // }
  // }

  return (
    <AccountSetupForm
      userID={userID}
      handleInputChange={handleInputChange}
      onSetup={onSetup}
    />
  );
}
