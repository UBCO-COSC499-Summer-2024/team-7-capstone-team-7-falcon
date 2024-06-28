"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, TextInput, Radio } from "flowbite-react";
import { SignUpFormData, Status } from "../../typings/backendDataTypes";

const AccountSetup: React.FC<SignUpFormData> = ({
  first_name,
  last_name,
  email,
  password,
  confirm_password,
  student_id,
  employee_id,
}) => {
  const router = useRouter();
  const [formUserInfo, setFormUserInfo] = useState<SignUpFormData>();

  const [userRole, setUserRole] = useState({
    role: "student",
  });

  async function onSetup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const jsonPayload = JSON.stringify(user);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register/`,
        {
          method: "POST",
          body: jsonPayload,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      // if (!response.ok) {
      //   throw new Error('Failed to submit the data. Please try again.')
      // }
    } catch (error) {
      // Capture the error message to display to the user
      setError(error.message);
      console.error(error);
    }
    // } finally {
    //   setIsLoading(false)
    // }
  }

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
              onChange={(e) => setUserRole({ ...userRole, role: "student" })}
              defaultChecked
            />
            <Label htmlFor="student-role">student</Label>
          </div>

          <div className="flex items-center gap-2">
            <Radio
              id="employee-role"
              name="roles"
              value="instructor"
              onChange={(e) => setUserRole({ ...userRole, role: "instructor" })}
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
            value={formUserInfo.student_id}
            onChange={(e) =>
              setFormUserInfo({ ...formUserInfo, student_id: e.target.value })
            }
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
            value={formUserInfo.employee_id}
            onChange={(e) =>
              setFormUserInfo({ ...formUserInfo, employee_id: e.target.value })
            }
            placeholder={
              userRole.role === "student" ? "(Optional) 1234567" : "1234567"
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
};

export default AccountSetup;
