"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { usersAPI } from "@/app/api/usersAPI";
import { authAPI, verifyIdPresence } from "@/app/api/authAPI";
import { deleteAuthToken } from "@/app/api/cookieAPI";
import { useRouter } from "next/navigation";
import AccountSetupForm from "../components/accountSetupForm";

export default function AccountSetup() {
  const router = useRouter();

  // since this page is excluded from the middleware, we need to check if the user is authenticated
  // if not, redirect to the login page
  useEffect(() => {
    checkAuthentication();
  }, []);

  async function checkAuthentication() {
    const hasVerifiedToken = await authAPI.hasVerifiedToken();
    if (!hasVerifiedToken) {
      await deleteAuthToken();
      router.push("/login");
    }

    // if the user is authenticated, check if they have at least one ID set
    // if yes, redirect to the dashboard page
    const hasID = await verifyIdPresence();
    if (hasID) {
      // the middleware will handle the redirect based on roles
      router.push("/");
    }
  }

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
      const newUserDetails = {
        student_id:
          userIDs.student_id !== "" ? Number(userIDs.student_id) : null,
        employee_id:
          userIDs.employee_id !== "" ? Number(userIDs.employee_id) : null,
      };

      // update user details in database
      await usersAPI.updateUserDetails("-1", newUserDetails);

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
