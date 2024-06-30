"use client";
import Link from "next/link";
import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Label, TextInput, Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { SignUpFormData, Status } from "../../typings/backendDataTypes";
import AccountSetupForm from "../components/accountSetupForm";
import RedirectModal from "../components/redirectModal";

export default function SignUpPage() {
  const router = useRouter();
  const [status, setStatus] = useState(Status.Pending);

  // stores data needed for the redirect modal
  const [redirectInfo, setRedirectInfo] = useState({
    message: "",
    redirectPath: "",
    buttonText: "",
  });

  // stores the data to be sent to the database
  const [formUserInfo, setFormUserInfo] = useState<SignUpFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    student_id: null,
    employee_id: null,
  });

  // STEP 1: Verify that passwords match and that password is strong
  async function onSignUp(event: FormEvent<HTMLFormElement>) {
    // missing the student_id and employee_id fields (at least one required by backend)
    // so cannot send the data to the database yet
    event.preventDefault();
    setStatus(Status.Pending);

    if (formUserInfo.password !== formUserInfo.confirm_password) {
      setStatus(Status.PasswordsDoNotMatch);
      return;
    }

    const passwordRequirements = [
      formUserInfo.password.length >= 8,
      /[a-z]/.test(formUserInfo.password),
      /[A-Z]/.test(formUserInfo.password),
      /\d/.test(formUserInfo.password),
      /[!@#$%^&*(),.?":{}|<>]/.test(formUserInfo.password),
    ];

    if (!passwordRequirements.every(Boolean)) {
      setStatus(Status.WeakPassword);
      return;
    }

    setStatus(Status.Success);
  }

  // needed for account setup form
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

  // STEP 2: Send user details to database
  async function onSetup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // update user info with student_id or employee_id

    setFormUserInfo((prevFormUserInfo) => ({
      ...prevFormUserInfo,
      student_id:
        userID.student_id !== ""
          ? Number(userID.student_id)
          : prevFormUserInfo.student_id,
      employee_id:
        userID.employee_id !== ""
          ? Number(userID.employee_id)
          : prevFormUserInfo.employee_id,
    }));

    // send data to the database
    const jsonPayload = JSON.stringify(formUserInfo);

    let response;

    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register/`,
        {
          method: "POST",
          body: jsonPayload,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // if response is ok, display message to validate email, and redirect to login page
      if (response.ok) {
        setRedirectInfo({
          message: "Please check your email to validate your account.",
          redirectPath: "/login",
          buttonText: "Ok!",
        });
      } else {
        throw new Error();
      }
    } catch (error) {
      let errMessage = "Failed to submit the data. Please try again.";

      if (response.status === 409) {
        errMessage = "This user already exists. Please try again.";
      }

      setRedirectInfo({
        message: errMessage,
        redirectPath: "/signup",
        buttonText: "Try again",
      });
    } finally {
      setStatus(Status.Redirect);
    }
  }

  return (
    <>
      {status === Status.Success && (
        <AccountSetupForm
          userID={userID}
          handleInputChange={handleInputChange}
          onSetup={onSetup}
        />
      )}
      {status === Status.Redirect && (
        <RedirectModal
          message={redirectInfo.message}
          redirectPath={redirectInfo.redirectPath}
          buttonText={redirectInfo.buttonText}
        />
      )}
      <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-screen py-">
        <form
          onSubmit={onSignUp}
          className="w-full max-w-lg mx-auto bg-white p-8 rounded-md shadow-md "
        >
          <h1 className="text-center font-bold mb-3">OwlMark OMS Portal</h1>
          <h2 className="text-md mb-6 text-center text-gray-400">
            Create an Account
          </h2>

          <div className="mb-4">
            <Label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="first_name"
            >
              First Name
            </Label>
            <TextInput
              className="w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              id="first_name"
              type="text"
              value={formUserInfo.first_name}
              onChange={(e) =>
                setFormUserInfo({ ...formUserInfo, first_name: e.target.value })
              }
              placeholder="John"
            />
          </div>

          <div className="mb-4">
            <Label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="last_name"
            >
              Last Name
            </Label>
            <TextInput
              className="w-full  border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              id="last_name"
              type="text"
              value={formUserInfo.last_name}
              onChange={(e) =>
                setFormUserInfo({ ...formUserInfo, last_name: e.target.value })
              }
              placeholder="Adams"
            />
          </div>

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
              value={formUserInfo.email}
              onChange={(e) =>
                setFormUserInfo({ ...formUserInfo, email: e.target.value })
              }
              placeholder="john123@gmail.com"
            />
          </div>

          <div className="mb-4">
            <Label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </Label>
            <TextInput
              className="w-full  border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              id="password"
              type="password"
              value={formUserInfo.password}
              onChange={(e) =>
                setFormUserInfo({ ...formUserInfo, password: e.target.value })
              }
              placeholder="********"
            />
          </div>

          <div className="mb-4">
            <Label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirm_password"
            >
              Confirm Password
            </Label>
            <TextInput
              className="w-full  border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              id="confirm_password"
              type="password"
              value={formUserInfo.confirm_password}
              onChange={(e) =>
                setFormUserInfo({
                  ...formUserInfo,
                  confirm_password: e.target.value,
                })
              }
              placeholder="********"
            />
          </div>

          {status === Status.PasswordsDoNotMatch && (
            <div className="mb-4">
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">Passwords do not match!</span>
              </Alert>
            </div>
          )}

          {status === Status.WeakPassword && (
            <div className="mb-4">
              <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">Weak password! &nbsp;</span>
                Passwords should be at least 8 characters long and contain at
                least one lowercase letter, one uppercase letter, one number,
                and one symbol.
              </Alert>
            </div>
          )}

          <Button
            type="submit"
            color="purple"
            size="xs"
            className="w-full text-white text-xl font-bold py-3 rounded-md transition duration-300"
          >
            Sign Up
          </Button>

          <Link
            href="/login"
            className="text-purple-500 font-medium text-primary-600 hover:underline dark:text-primary-500 flex items-center justify-center mt-4"
          >
            Login
          </Link>
        </form>
      </div>
    </>
  );
}
