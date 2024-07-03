"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import RedirectModal from "../components/redirectModal";
import { Status, redirectModalData } from "../../typings/backendDataTypes";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState(Status.Pending);
  const [userEmail, setUserEmail] = useState({
    email: "",
  });

  // stores data needed for the redirect modal
  const [redirectInfo, setRedirectInfo] = useState<redirectModalData>({
    message: "",
    redirectPath: "",
    buttonText: "",
  });

  async function onReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(Status.Pending);
    const jsonPayload = JSON.stringify(userEmail);
    let response;
    console.log(jsonPayload);
    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1//user/password/request_reset/`,
        {
          method: "POST",
          body: jsonPayload,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // if response is ok, display message to check email, and redirect to login page
      if (response.ok) {
        setRedirectInfo({
          message: "Please check your email for the password reset link.",
          redirectPath: "/login",
          buttonText: "Ok!",
        });
      } else {
        throw new Error();
      }
    } catch (error) {
      let errMessage = "Failed to submit the data. Please try again.";

      if (response.status === 403) {
        errMessage =
          "An error occurred. Your email is either not verified or used for google authentication instead. Please try again.";
      }

      if (response.status === 404) {
        errMessage =
          "We could not find the email you provided. Please try again.";
      }

      setRedirectInfo({
        message: errMessage,
        redirectPath: "/reset-password",
        buttonText: "Try again",
      });
    } finally {
      setStatus(Status.Redirect);
    }
  }

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
              placeholder="john123@gmail.com"
              required
            />
          </div>

          <Button
            onClick={onReset}
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
