"use client";
import Link from "next/link";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { SignUpFormData, Status } from "../../typings/backendDataTypes";
import AccountSetup from "../setup-account/page";

export default function SignUpPage() {
  const router = useRouter();
  const [status, setStatus] = useState(Status.Pending);

  const [formUserInfo, setFormUserInfo] = useState<SignUpFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    student_id: null,
    employee_id: null,
  });

  const resetStatus = () => {
    setStatus(Status.Pending);
  };

  async function onSignUp(event: FormEvent<HTMLFormElement>) {
    // missing the student_id and employee_id fields (at least one required by backend)
    // so cannot send the data to the database yet
    event.preventDefault();

    if (formUserInfo.password !== formUserInfo.confirm_password) {
      setStatus(Status.PasswordsDoNotMatch);
      return;
    }

    // todo: validate password strength

    // console.log(formUserInfo);
    setStatus(Status.Success);
  }

  return (
    <>
      {status === Status.Success}
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

      {/* <AccountSetup {...formUserInfo} /> */}
    </>
  );
}
