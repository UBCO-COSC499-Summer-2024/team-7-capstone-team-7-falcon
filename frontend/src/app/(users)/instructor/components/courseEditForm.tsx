import React, { useEffect, useState, FormEvent } from "react";
import { Select, Button, TextInput, Modal, Label, Alert } from "flowbite-react";
import { coursesAPI } from "@/app/api/coursesAPI";
import SemesterSelect from "./courseCreateForm/semesterSelect";
import toast from "react-hot-toast";
import { CourseData } from "../../../typings/backendDataTypes";
import { Status } from "../../../typings/backendDataTypes";

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
        className="mb-2"
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
        className="mb-2"
      />
      <Label htmlFor="sectionName" className="mb-2">
        <h2 className="pt-2">Course Section</h2>
      </Label>
      <TextInput
        id="sectionName"
        name="section_name"
        value={formData.section_name}
        onChange={handleChange}
        placeholder="Enter course Section"
        required
      />
      <SemesterSelect
        name={"semester_id"}
        required={true}
        labelText={"Semester"}
      />
      <div className="flex gap-4 mt-4 justify-left items-start">
        <Button type="submit" color="purple">
          Save changes
        </Button>
        <Button color="red">Cancel</Button>
      </div>
    </form>
  );
};

export default CourseEditForm;
