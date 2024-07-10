"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, TextInput, Radio } from "flowbite-react";

export default function AccountSetup() {
  const router = useRouter();
  const [user, setUser] = useState({
    userRole: "student",
    studentId: "",
    employeeId: "",
  });

  const onSetup = async () => {
    //handle Setup
  };

  return (
    <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-screen py-">
      <form className="w-full max-w-lg mx-auto bg-white p-8 rounded-md shadow-md ">
        <h1 className="text-center font-bold mb-3">OwlMark</h1>
        <h2 className="text-md mb-6 text-center text-gray-400">
          You are almost done
        </h2>

        <div className="mb-4">
          <Label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="role"
          >
            I am a/an...
          </Label>

          <div className="flex items-center gap-2 mb-2">
            <Radio
              id="student-role"
              name="roles"
              value="student"
              onChange={(e) => setUser({ ...user, userRole: "student" })}
              defaultChecked
            />
            <Label htmlFor="student-role">student</Label>
          </div>

          <div className="flex items-center gap-2">
            <Radio
              id="employee-role"
              name="roles"
              value="instructor"
              onChange={(e) => setUser({ ...user, userRole: "instructor" })}
            />
            <Label htmlFor="employee-role">employee</Label>
          </div>
        </div>

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
            disabled={user.userRole !== "student"}
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
            placeholder={
              user.userRole === "student" ? "(Optional) 1234567" : "1234567"
            }
          />
        </div>

        <Button
          onClick={onSetup}
          color="purple"
          size="xs"
          className="w-full text-white text-xl purple-700 font-bold py-3 rounded-md transition duration-300"
        >
          Setup Account
        </Button>
      </form>
    </div>
  );
}
