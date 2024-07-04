import React, { useEffect, useState, FormEvent } from "react";
import { Select, Button, TextInput, Modal, Label, Alert } from "flowbite-react";
import { coursesAPI } from "@/app/api/coursesAPI";
import SemesterSelect from "./courseCreateForm/semesterSelect";
import toast from "react-hot-toast";

interface CourseEditorProps {
  courseId: number;
  courseData: {
    course_code: string;
    course_name: string;
    section_name: string;
    semester_id: number;
    invite_code: string;
  };
  onSubmission: () => void; // Function to call when the course is edited
}

/**
 * Renders the course editor form component
 * @component
 * @param {CourseEditorProps} props - The component props
 * @returns {React.JSX.Element} - Course editor component
 */
const CourseEditor: React.FC<CourseEditorProps> = ({
  courseId,
  courseData,
  onSubmission,
}) => {
  const [formData, setFormData] = useState(courseData);

  useEffect(() => {
    setFormData(courseData);
  }, [courseData]);

  /**
   * Handles the form submission to edit an existing course.
   * @async
   * @function
   * @param {FormEvent<HTMLFormElement>} event - The form submission event
   * @returns {Promise<void>}
   */
  const editCourse = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    try {
      await coursesAPI.editCourse(courseId, formData);
      toast.success("Course edited successfully");
    } catch (error) {
      toast.error("Failed to edit course");
    }

    onSubmission();
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
    <form onSubmit={editCourse}>
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
        <Button color="red" onClick={() => onSubmission()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CourseEditor;
