"use client";
import Link from "next/link";
import React, { useRef, useState, FormEvent, KeyboardEvent } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import RedirectModal from "../components/redirectModal";
import {
  Status,
  redirectModalData,
  requestResetPasswordData,
} from "../../typings/backendDataTypes";
import { authAPI } from "@/app/api/authAPI";

export default function ResetPasswordPage() {
  const [status, setStatus] = useState(Status.Pending);
  const [userEmail, setUserEmail] = useState<requestResetPasswordData>({
    email: "",
  });

  // stores data needed for the redirect modal
  const redirectInfo = useRef<redirectModalData>({
    message: "",
    redirectPath: "",
    buttonText: "",
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      const form = event.currentTarget.closest("form");
      if (form) {
        onReset(new Event("submit") as unknown as FormEvent<HTMLFormElement>);
      }
    }
  };

  async function onReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(Status.Pending);

    let response;

    try {
      response = await authAPI.requestResetPassword(userEmail);

      // if response is ok, display message to check email, and redirect to login page
      if (response.status === 200) {
        redirectInfo.current.message =
          "Please check your email for the password reset link.";
        redirectInfo.current.redirectPath = "/login";
        redirectInfo.current.buttonText = "Ok!";
      } else {
        throw new Error();
      }
    } catch (error) {
      let errMessage = "Failed to submit the data. Please try again.";

      if (response === 403) {
        errMessage =
          "An error occurred. Your email is either not verified or used for google authentication instead. Please try again.";
      }

      if (response === 404) {
        errMessage =
          "We could not find the email you provided. Please try again.";
      }

      redirectInfo.current.message = errMessage;
      redirectInfo.current.redirectPath = "/reset-password";
      redirectInfo.current.buttonText = "Try again";
    } finally {
      setStatus(Status.Redirect);
    }
  }

  return (
    <>
      {status === Status.Redirect && (
        <RedirectModal
          message={redirectInfo.current.message}
          redirectPath={redirectInfo.current.redirectPath}
          buttonText={redirectInfo.current.buttonText}
        />
      )}
      <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-screen py-">
        <form
          className="w-full max-w-lg mx-auto bg-white p-8 rounded-md shadow-md"
          onSubmit={onReset}
        >
          <h1 className="text-center font-bold mb-3">OwlMark OMS Portal</h1>
          <h2 className="text-md mb-6 text-center text-gray-400">
            Reset your password
          </h2>

          <div className="mb-4">
            <Label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </Label>
            <TextInput
              className="w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              id="email"
              type="email"
              value={userEmail.email}
              onChange={(e) =>
                setUserEmail({ ...userEmail, email: e.target.value })
              }
              onKeyDown={handleKeyDown}
              placeholder="john123@gmail.com"
              required
            />
          </div>

          <Button
            onClick={(e: any) => onReset(e)}
            color="purple"
            size="xs"
            className="w-full text-white text-xl font-bold py-3 rounded-md transition duration-300"
          >
            Send Reset Link
          </Button>

          <Link
            href="/login"
            className="text-purple-500 font-medium text-primary-600 hover:underline dark:text-primary-500 flex items-center justify-center mt-4"
          >
            Go Back
          </Link>
        </form>
      </div>
    </>
  );
}
