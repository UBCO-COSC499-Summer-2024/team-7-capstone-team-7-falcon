"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    newPassword: "",
    reenteredPassword: "",
  });

  const onPasswordUpdate = async () => {
    //handle password update
  };

  return (
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
            value={user.newPassword}
            onChange={(e) => setUser({ ...user, newPassword: e.target.value })}
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
            value={user.reenteredPassword}
            onChange={(e) =>
              setUser({ ...user, reenteredPassword: e.target.value })
            }
            placeholder="********"
          />
        </div>

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
  );
}
