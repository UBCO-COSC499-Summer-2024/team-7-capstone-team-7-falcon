"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
  });

  const onReset = async () => {
    //handle password reset
  };

  return (
    <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-screen py-">
      <form className="w-full max-w-lg mx-auto bg-white p-8 rounded-md shadow-md ">
        <h1 className="text-center font-bold mb-3">OWLMARK</h1>
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
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="john123@gmail.com"
          />
        </div>

        <Button
          onClick={onReset}
          color="purple"
          size="xs"
          className="w-full text-white text-xl bg-[#8F3DDE] font-bold py-3 rounded-md transition duration-300"
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
  );
}
