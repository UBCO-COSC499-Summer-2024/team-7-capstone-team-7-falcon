import React, { useEffect, useRef, useState } from "react";
import { Select, Button, TextInput, Modal, Label, Alert } from "flowbite-react";
import { semestersAPI } from "@/app/api/semestersAPI";

interface CourseCreatorProps {
  isOpen?: boolean;
  closeModal: () => void;
}

interface Semester {
  id: number;
  name: string;
}

/**
 * Renders the course creator component
 * @param props {CourseCreatorProps} - The component props
 * @returns {React.JSX.Element} - Course creator component
 */
const CourseCreatorModal: React.FC<CourseCreatorProps> = ({
  isOpen = false,
  closeModal,
}) => {
  const [courseSemesters, setCourseSemesters] = useState([]);

  useEffect(() => {
    const fetchSemesters = async () => {
      const fetchedSemesters = await semestersAPI.getAllSemesters();
      setCourseSemesters(fetchedSemesters);
    };
    if (
      isOpen &&
      (courseSemesters === undefined || courseSemesters.length === 0)
    )
      fetchSemesters();
  }, [isOpen]);

  const createCourse = (formData) => {
    const courseData = {
      course_code: formData.get("course_code"),
      course_name: formData.get("course_name"),
      section_name: formData.get("section_name"),
      semester_id: formData.get("semester_id"),
    };

    // Validate form data
    if (
      !courseData.course_code ||
      !courseData.course_name ||
      !courseData.section_name ||
      !courseData.semester_id
    ) {
      // Handle form validation error
      return;
    }

    closeModal();
    // Implement course creation here
  };

  return (
    <Modal
      show={isOpen}
      size="lg"
      popup
      position={"center"}
      onClose={() => closeModal()}
    >
      <Modal.Header className="pl-2 pt-2">Create a new Course</Modal.Header>
      <Modal.Body className="mt-2">
        <form action={createCourse}>
          <Label htmlFor="course_code">
            <h2>Course Code</h2>
          </Label>
          <TextInput
            id="course_code"
            placeholder="Enter course Code"
            required
            className="mb-2"
          />
          <Label htmlFor="course_code">
            <h2 className="pt-2">Course Name</h2>
          </Label>
          <TextInput
            id="course_code"
            placeholder="Enter course name"
            required
            className="mb-2"
          />
          <Label htmlFor="section_name" className="mb-2">
            <h2 className="pt-2">Course Section</h2>
          </Label>
          <TextInput
            id="section_name"
            placeholder="Enter course Section"
            required
          />
          <Label htmlFor="semester_id">
            <h2 className="pt-2">Semester</h2>
          </Label>
          {courseSemesters !== undefined ? (
            <Select id="semester_id" required>
              {courseSemesters.map((semester: Semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </Select>
          ) : (
            <Alert color="failure">Failed to fetch semesters</Alert>
          )}
          <div className="flex gap-4 mt-4 justify-left items-start">
            <Button type="submit" color="purple">
              Create Course
            </Button>
            <Button color="red" onClick={() => closeModal()}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CourseCreatorModal;
