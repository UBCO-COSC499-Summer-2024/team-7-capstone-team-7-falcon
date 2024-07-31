"use client";
import React, { FormEvent, useState } from "react";
import { Button, Label, TextInput, Radio } from "flowbite-react";

interface User {
  student_id: string;
  employee_id: string;
}

export default function AccountSetupForm({
  userID,
  handleInputChange,
  onSetup,
}: {
  userID: User;
  handleInputChange: (field: string, value: string) => void;
  onSetup: (event: FormEvent<HTMLFormElement> | any) => void;
}) {
  const [userRole, setUserRole] = useState({
    role: "student",
  });

  return (
    <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-screen py-">
      <form className="w-full max-w-lg mx-auto bg-white p-8 rounded-md shadow-md ">
        <h1 className="text-center font-bold mb-3">OwlMark OMS Portal</h1>
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
              onChange={(_) => setUserRole({ ...userRole, role: "student" })}
              defaultChecked
            />
            <Label htmlFor="student-role">student</Label>
          </div>

          <div className="flex items-center gap-2">
            <Radio
              id="employee-role"
              name="roles"
              value="instructor"
              onChange={(_) => setUserRole({ ...userRole, role: "instructor" })}
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
            id="student_id"
            type="number"
            value={userID.student_id}
            onChange={(e) => handleInputChange("student_id", e.target.value)}
            disabled={userRole.role !== "student"}
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
            id="employee_id"
            type="number"
            value={userID.employee_id}
            onChange={(e) => handleInputChange("employee_id", e.target.value)}
            placeholder={
              userRole.role === "student" ? "(Optional) 1234567" : "1234567"
            }
          />
        </div>

        <Button
          onClick={(e: any) => onSetup(e)}
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
