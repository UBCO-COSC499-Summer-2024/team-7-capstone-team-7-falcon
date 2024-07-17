import React, { useRef } from "react";
import { Select, Button, TextInput, Modal, Label } from "flowbite-react";

interface CourseCreatorProps {
  isOpen: boolean;
  closeModal: () => void;
}

/**
 * Renders the course creator component
 * @param props {CourseCreatorProps} - The component props
 * @returns {React.JSX.Element} - Course creator component
 */
const CourseCreatorModal: React.FC<CourseCreatorProps> = (props) => {
  const { isOpen, closeModal } = props;

  const courseCodeRef = useRef<HTMLInputElement>(null);
  const courseNameRef = useRef<HTMLInputElement>(null);
  const courseSectionRef = useRef<HTMLInputElement>(null);
  const courseSemesterRef = useRef<HTMLSelectElement>(null);

  const createCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const courseData = {
      courseCode: courseCodeRef.current?.value,
      courseName: courseNameRef.current?.value,
      courseSection: courseSectionRef.current?.value,
      courseSemester: courseSemesterRef.current?.value,
    };
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
        <form onSubmit={createCourse}>
          <Label htmlFor="courseCode">
            <h2>Course Code</h2>
          </Label>
          <TextInput
            id="courseCode"
            placeholder="Enter course Code"
            required
            className="mb-2"
            ref={courseCodeRef}
          />
          <Label htmlFor="courseName">
            <h2 className="pt-2">Course Name</h2>
          </Label>
          <TextInput
            id="courseName"
            placeholder="Enter course name"
            required
            className="mb-2"
            ref={courseNameRef}
          />
          <Label htmlFor="courseSection" className="mb-2">
            <h2 className="pt-2">Course Section</h2>
          </Label>
          <TextInput
            id="courseSection"
            placeholder="Enter course Section"
            required
            ref={courseSectionRef}
          />
          <Label htmlFor="courseSemester">
            <h2 className="pt-2">Semester</h2>
          </Label>
          <Select id="courseSemester" required ref={courseSemesterRef}>
            {/* Map options here */}
            <option value="S2024T1-2">
              Summer 2024 Terms 1-2 (S2024 T1-2)
            </option>
            <option value="S2024T2">Summer 2024 Term 2 (S2024 T2)</option>
            <option value="S2024T1">Summer 2024 Term 1 (S2024 T1)</option>
          </Select>
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
