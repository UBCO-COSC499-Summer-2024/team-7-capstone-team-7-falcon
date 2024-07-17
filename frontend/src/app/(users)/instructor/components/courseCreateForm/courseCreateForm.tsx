import React, { FormEvent } from "react";
import { Button, TextInput, Label } from "flowbite-react";

import { coursesAPI } from "@/app/api/coursesAPI";
import SemesterSelect from "@/app/components/semesterSelect";
import toast from "react-hot-toast";

interface CourseCreatorProps {
  onSubmission: () => void; // Function to call when the course is created
}

/**
 * Renders the course creator form component
 * @component
 * @param {CourseCreatorProps} props - The component props
 * @returns {React.JSX.Element} - Course creator component
 */
const CourseCreator: React.FC<CourseCreatorProps> = ({ onSubmission }) => {
  /**
   * Handles the form submission to create a new course.
   * @async
   * @function
   * @param {FormEvent<HTMLFormElement>} event - The form submission event
   * @returns {Promise<void>}
   */
  const createCourse = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const courseData = {
      course_code: String(formData.get("course_code") ?? ""),
      course_name: String(formData.get("course_name") ?? ""),
      section_name: String(formData.get("section_name") ?? ""),
      semester_id: Number(formData.get("semester_id") ?? -1),
    };
    try {
      await coursesAPI.createCourse(courseData);
    } catch (error) {
      toast.error("Failed to create course");
    }

    onSubmission();
  };

  return (
    <form onSubmit={createCourse}>
      <Label htmlFor="courseCode">
        <h2>Course Code</h2>
      </Label>
      <TextInput
        id="courseCode"
        placeholder="Enter course Code"
        name="course_code"
        required
        className="mb-2"
      />
      <Label htmlFor="courseName">
        <h2 className="pt-2">Course Name</h2>
      </Label>
      <TextInput
        id="courseName"
        name="course_name"
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
          Create Course
        </Button>
        <Button color="red" onClick={() => onSubmission()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CourseCreator;
