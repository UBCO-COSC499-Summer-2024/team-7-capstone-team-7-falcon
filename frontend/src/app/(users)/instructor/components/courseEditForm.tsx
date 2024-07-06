"use client";
import React, { useEffect, useState, FormEvent } from "react";
import { Select, Button, TextInput, Modal, Label, Alert } from "flowbite-react";
import { coursesAPI } from "@/app/api/coursesAPI";
import SemesterSelect from "./courseCreateForm/semesterSelect";
import toast from "react-hot-toast";
import { CourseData } from "../../../typings/backendDataTypes";
import { Status } from "../../../typings/backendDataTypes";
import ModalMessage from "../../components/modalMessage";
import DangerZone from "../../instructor/components/dangerZone";

interface CourseEditFormProps {
  course_id: number;
}

/**
 * Renders the course editor form component
 * @component
 * @param {CourseEditorProps} props - The component props
 * @returns {React.JSX.Element} - Course editor component
 */
const CourseEditForm: React.FC<CourseEditFormProps> = ({ course_id }) => {
  const [status, setStatus] = useState(Status.Pending);
  const [formData, setFormData] = useState<CourseData>({
    course_name: "",
    course_code: "",
    section_name: "",
    semester_id: -1,
    invite_code: "",
  });
  /**
   * Handles the form submission to edit an existing course.
   * @async
   * @function
   * @param {FormEvent<HTMLFormElement>} event - The form submission event
   * @returns {Promise<void>}
   */

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const resetStatus = () => {
    setStatus(Status.Pending);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await coursesAPI.editCourse(course_id, formData);
    if (result.status == 200) {
      setStatus(Status.Success);
    } else {
      setStatus(Status.Failure);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "semester_id" ? Number(value) : value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 p-4 ring ring-gray-300 rounded-md flex flex-col">
        <Label htmlFor="courseCode">
          <h2>Course Code</h2>
        </Label>
        <TextInput
          id="courseCode"
          name="course_code"
          value={formData.course_code}
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
          name="course_name"
          value={formData.course_name}
          onChange={handleChange}
          placeholder="Enter course name"
          required
          className="mb-3"
        />
        <Label htmlFor="sectionName" className="mb-3">
          <h2 className="pt-2">Course Section</h2>
        </Label>
        <TextInput
          id="sectionName"
          name="section_name"
          value={formData.section_name}
          onChange={handleChange}
          placeholder="Enter course Section"
          required
          className="mb-3"
        />
        <SemesterSelect
          name={"semester_id"}
          required={true}
          labelText={"Semester"}
          className="mb-3"
        />
        <Label htmlFor="inviteCode" className="mb-3">
          <h2 className="pt-2">Invite Code</h2>
        </Label>
        <div className="relative flex items-center mb-4">
          <div className="relative w-1/4">
            <TextInput
              id="inviteCode"
              name="invite_code"
              value={formData.invite_code}
              onChange={handleChange}
              placeholder="WZYHKSK"
              required
              className="pr-12 w-full" // Adjust padding and width as needed
            />
            <Button
              type="button"
              color="purple"
              className="absolute top-1/2 right-3 transform -translate-y-1/2"
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
            </Button>
          </div>
          <Button type="button" color="purple" className="ml-2">
            Copy Invite Link
          </Button>
        </div>
        <div>
          <Button type="submit" color="purple" className="w-full">
            Save changes
          </Button>
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
