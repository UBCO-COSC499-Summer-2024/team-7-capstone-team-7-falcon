"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const onSignup = async () => {
    //handle Signup
  };

  return (
    <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-screen py-">
      <form className="w-full max-w-lg mx-auto bg-white p-8 rounded-md shadow-md ">
        <h1 className="text-center font-bold mb-3">OwlMark OMS Portal</h1>
        <h2 className="text-md mb-6 text-center text-gray-400">
          Create an Account
        </h2>

        <div className="mb-4">
          <Label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="first-name"
          >
            First Name
          </Label>
          <TextInput
            className="w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            id="firstname"
            type="text"
            value={user.firstname}
            onChange={(e) => setUser({ ...user, firstname: e.target.value })}
            placeholder="John"
          />
        </div>

        <div className="mb-4">
          <Label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="last-name"
          >
            Last Name
          </Label>
          <TextInput
            className="w-full  border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            id="lastname"
            type="text"
            value={user.lastname}
            onChange={(e) => setUser({ ...user, lastname: e.target.value })}
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
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
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
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="********"
          />
        </div>

        <div className="mb-4">
          <Label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password_confirmation"
          >
            Confirm Password
          </Label>
          <TextInput
            className="w-full  border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            id="password_confirmation"
            type="password"
            value={user.confirm_password}
            onChange={(e) =>
              setUser({ ...user, confirm_password: e.target.value })
            }
            placeholder="********"
          />
        </div>

        <Button
          onClick={onSignup}
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
  );
}
