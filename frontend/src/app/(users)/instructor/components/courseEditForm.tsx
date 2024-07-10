"use client";
import React, { useState, useEffect } from "react";
import { Button, TextInput, Label } from "flowbite-react";
import { coursesAPI } from "@/app/api/coursesAPI";
import { semestersAPI } from "@/app/api/semestersAPI";
import SemesterSelect from "./courseCreateForm/semesterSelect";
import toast from "react-hot-toast";
import { CourseEditData } from "../../../typings/backendDataTypes";
import { v4 as uuidv4 } from "uuid";

interface CourseEditFormProps {
  course_id: number;
}

const CourseEditForm: React.FC<CourseEditFormProps> = ({ course_id }) => {
  const [formData, setFormData] = useState<CourseEditData>({
    courseName: "",
    courseCode: "",
    semesterId: -1, // Initialize with -1 or an appropriate default
    inviteCode: "",
  });
  const [semesters, setSemesters] = useState<Semester[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await coursesAPI.getCourse(course_id);
        const { course_name, course_code, semester_id, invite_code } =
          courseResponse.data;
        setFormData({
          courseName: course_name,
          courseCode: course_code,
          semesterId: semester_id, // Set the correct semesterId here
          inviteCode: invite_code ?? "",
        });

        const semestersResponse = await semestersAPI.getAllSemesters();
        setSemesters(semestersResponse);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load course or semester data");
      }
    };

    fetchData();
  }, [course_id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await coursesAPI.editCourse(course_id, formData);
      console.log("Edit course result:", result);
      toast.success("Course successfully updated");
    } catch (error) {
      console.error("Failed to edit course:", error);
      toast.error("Failed to update course");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "semesterId" ? Number(value) : value,
    });
  };

  const copyInviteLink = () => {
    const inviteLink = formData.inviteCode;
    navigator.clipboard.writeText(inviteLink);
  };

  const generateInviteCode = () => {
    const newInviteCode = uuidv4().substring(0, 8).toUpperCase();
    setFormData({ ...formData, inviteCode: newInviteCode });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 p-4 ring ring-gray-300 rounded-md flex flex-col">
        <Label htmlFor="courseCode">
          <h2>Course Code</h2>
        </Label>
        <TextInput
          id="courseCode"
          name="courseCode"
          value={formData.courseCode}
          onChange={handleChange}
          placeholder="Enter course Code"
          required
          className="mb-3"
        />
        <Label htmlFor="courseName">
          <h2 className="pt-2">Course Name</h2>
        </Label>
        <TextInput
          id="courseName"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          placeholder="Enter course name"
          required
          className="mb-3"
        />

        <SemesterSelect
          name="semesterId"
          required={true}
          labelText="Semester"
          value={formData.semesterId}
          onChange={handleChange}
          options={semesters}
          className="mb-3"
        />
        <Label htmlFor="inviteCode" className="mb-3">
          <h2 className="pt-2">Invite Code</h2>
        </Label>
        <div className="relative flex items-center mb-4">
          <div className="relative w-1/4">
            <TextInput
              id="inviteCode"
              name="inviteCode"
              value={formData.inviteCode}
              onChange={handleChange}
              placeholder="WZYHKSK"
              required
              className="pr-12 w-full"
            />
            <button
              type="button"
              className="btn-primary absolute top-1/2 right-3 transform -translate-y-1/2"
              onClick={generateInviteCode}
            >
              <svg
                className="w-5 h-5 text-white dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"
                />
              </svg>
            </button>
          </div>
          <button
            type="button"
            className="btn-primary ml-2"
            onClick={copyInviteLink}
          >
            Copy Invite Link
          </button>
        </div>
        <div>
          <button type="submit" className="btn-primary w-full">
            Save changes
          </button>
        </div>
      </div>
      <div className="ring-1 rounded ring-red-700 pt-4 mt-4 flex flex-col p-4">
        <p className="font-bold text-lg mb-2">Danger Zone</p>
        <p className="font-bold mt-2">Delete Course</p>
        <p>If you delete this course, you will not be able to undo it</p>
        <button className="ring-1 rounded ring-red-700 p-1 m-3 items-center">
          <p className="text-red-700 text-lg">Delete Course</p>
        </button>
      </div>
    </form>
  );
};

export default CourseEditForm;
