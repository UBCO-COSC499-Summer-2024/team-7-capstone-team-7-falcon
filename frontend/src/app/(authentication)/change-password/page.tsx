"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Button, Checkbox, Label, TextInput, Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import RedirectModal from "../components/redirectModal";
import {
  Status,
  FormValid,
  redirectModalData,
} from "../../typings/backendDataTypes";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState(Status.Pending);
  const [formValid, setFormValid] = useState(FormValid.Invalid);
  const searchParams = useSearchParams();
  const [resetPassword, setResetPassword] = useState({
    token: "",
    password: "",
    confirm_password: "",
  });

  // stores data needed for the redirect modal
  const [redirectInfo, setRedirectInfo] = useState<redirectModalData>({
    message: "",
    redirectPath: "",
    buttonText: "",
  });

  const reset_token = searchParams.get("reset_token");

  // only run this code once - else we get stuck in an infinite rerender loop
  useEffect(() => {
    if (reset_token === null) {
      setRedirectInfo({
        message: "You do not have permission to access this page.",
        redirectPath: "/login",
        buttonText: "Go to Home",
      });
      setStatus(Status.Redirect);
    }

    // update reset token
    // needs to be defined outside of onPasswordUpdate for the hook to work.
    const updateInfo = async () => {
      setResetPassword({ ...resetPassword, token: reset_token });
    };

    updateInfo();
  }, [reset_token]);

  const onPasswordUpdate = async () => {
    event.preventDefault();
    setStatus(Status.Pending);

    if (resetPassword.password !== resetPassword.confirm_password) {
      setFormValid(FormValid.PasswordsDoNotMatch);
      return;
    }

    setFormValid(FormValid.Valid);

    // send data to the database
    const jsonPayload = JSON.stringify(resetPassword);

    let response;

    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/password/reset`,
        {
          method: "POST",
          body: jsonPayload,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // if response is ok, display confirmation message, and redirect to login page
      if (response.ok) {
        setRedirectInfo({
          message: "Password successfully updated!",
          redirectPath: "/login",
          buttonText: "Back to login",
        });
      }
    } catch (error) {
      let errMessage = "Failed to update password. Please try again.";

      if (response.status === 403) {
        errMessage = "Your link has expired. Please request for a new one.";
      }

      setRedirectInfo({
        message: errMessage,
        redirectPath: "/login",
        buttonText: "Try again",
      });
    } finally {
      setStatus(Status.Redirect);
    }
  };

  return (
    <>
      {status === Status.Redirect && (
        <RedirectModal
          message={redirectInfo.message}
          redirectPath={redirectInfo.redirectPath}
          buttonText={redirectInfo.buttonText}
        />
      )}
      <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-screen py-">
        <form className="w-full max-w-lg mx-auto bg-white p-8 rounded-md shadow-md ">
          <h1 className="text-center font-bold mb-3">OwlMark OMS Portal</h1>
          <h2 className="text-md mb-6 text-center text-gray-400">
            Change your password
          </h2>

          <div className="mb-4">
            <Label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="newPassword"
            >
              Password
            </Label>
            <TextInput
              className="w-full  border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              id="newPassword"
              type="password"
              value={resetPassword.password}
              onChange={(e) =>
                setResetPassword({ ...resetPassword, password: e.target.value })
              }
              placeholder="********"
            />
          </div>

          <div className="mb-4">
            <Label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="reenteredPassword"
            >
              Confirm Password
            </Label>
            <TextInput
              className="w-full  border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              id="reenteredPassword"
              type="password"
              value={resetPassword.confirm_password}
              onChange={(e) =>
                setResetPassword({
                  ...resetPassword,
                  confirm_password: e.target.value,
                })
              }
              placeholder="********"
            />
          </div>

          {formValid === FormValid.PasswordsDoNotMatch && (
            <div className="mb-4">
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">Passwords do not match!</span>
              </Alert>
            </div>
          )}

          <Button
            onClick={onPasswordUpdate}
            color="purple"
            size="xs"
            className="w-full text-white text-xl font-bold py-3 rounded-md transition duration-300"
          >
            Update Password
          </Button>
        </form>
      </div>
    </>
  );
}
