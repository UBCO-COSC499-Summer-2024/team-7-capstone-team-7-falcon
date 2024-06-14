"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";

export default function AccountSetup() {
  const router = useRouter();
  const [user, setUser] = useState({
    studentId: "", // should this be a number?
    employeeId: "", // should this be a number?
  });

  const onSetup = async () => {
    //handle Setup
  };

  return (
    <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-screen py-">
      <form className="w-full max-w-lg mx-auto bg-white p-8 rounded-md shadow-md ">
        <h1 className="text-center font-bold mb-3">OWLMARK</h1>
        <h2 className="text-md mb-6 text-center text-gray-400">
          You are almost done
        </h2>

        <div className="mb-4">
          <Label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="student-id"
          >
            Student ID
          </Label>
          <TextInput
            className="w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            id="studentID"
            type="number"
            value={user.studentId}
            onChange={(e) => setUser({ ...user, studentId: e.target.value })}
            placeholder="12345678"
          />
        </div>

        <div className="mb-4">
          <Label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="employee-id"
          >
            Employee ID
          </Label>
          <TextInput
            className="w-full  border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            id="employeeID"
            type="number"
            value={user.employeeId}
            onChange={(e) => setUser({ ...user, employeeId: e.target.value })}
            placeholder="1234567"
          />
        </div>

        <Button
          onClick={onSetup}
          color="purple"
          size="xs"
          className="w-full text-white text-xl bg-[#8F3DDE] font-bold py-3 rounded-md transition duration-300"
        >
          Setup Account
        </Button>
      </form>
    </div>
  );
}
