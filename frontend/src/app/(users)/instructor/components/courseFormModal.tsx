import React, { useEffect, useState, FormEvent } from "react";
import { Select, Button, TextInput, Modal, Label, Alert } from "flowbite-react";
import { semestersAPI } from "@/app/api/semestersAPI";
import { coursesAPI } from "@/app/api/coursesAPI";
import { revalidatePath } from "next/cache";

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
 * @component
 * @param {CourseCreatorProps} props - The component props
 * @returns {React.JSX.Element} - Course creator component
 */
const CourseCreatorModal: React.FC<CourseCreatorProps> = ({
  isOpen = false,
  closeModal,
}) => {
  const [courseSemesters, setCourseSemesters] = useState<Semester[]>([]);

  /**
   * Fetches all semesters from the API and sets them in the state.
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const fetchSemesters = async (): Promise<void> => {
    const fetchedSemesters = await semestersAPI.getAllSemesters();
    setCourseSemesters(fetchedSemesters);
  };

  /**
   * Fetches semesters when the modal is opened and the semesters are not already loaded.
   * @function
   * @returns {void}
   */
  useEffect(() => {
    if (
      isOpen &&
      (courseSemesters === undefined || courseSemesters.length === 0)
    )
      fetchSemesters();
  }, [isOpen]);

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

    await coursesAPI.createCourse(courseData);

    closeModal();
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
          <Label htmlFor="semesterID">
            <h2 className="pt-2">Semester</h2>
          </Label>
          {courseSemesters !== undefined ? (
            <Select id="semesterID" name="semester_id" required>
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
