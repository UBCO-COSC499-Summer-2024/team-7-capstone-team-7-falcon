import React from "react";
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
const CourseCreateModal: React.FC<CourseCreatorProps> = (props) => {
  const { isOpen, closeModal } = props;
  return (
    <Modal
      show={isOpen}
      size="lg"
      popup
      position={"center"}
      onClose={() => closeModal()}
    >
      <Modal.Header>
        <h1 className="pl-2 pt-2">Create a new Course</h1>
      </Modal.Header>
      <Modal.Body className="mt-2">
        <form>
          <Label htmlFor="courseCode">
            <h2>Course Code</h2>
          </Label>
          <TextInput
            id="courseCode"
            placeholder="Enter course Code"
            required
            className="mb-2"
          />
          <Label htmlFor="courseName">
            <h2 className="pt-2">Course Name</h2>
          </Label>
          <TextInput
            id="courseName"
            placeholder="Enter course name"
            required
            className="mb-2"
          />
          <Label htmlFor="courseSection" className="mb-2">
            <h2 className="pt-2">Course Section</h2>
          </Label>
          <TextInput
            id="courseSection"
            placeholder="Enter course Section"
            required
          />
          <Label htmlFor="courseSemester">
            <h2 className="pt-2">Semester</h2>
          </Label>
          <Select id="courseSemester" required>
            {/* Map options here */}
            <option value="Fall">Fall</option>
          </Select>
          <div className="flex gap-4 mt-4 justify-left items-start">
            <Button color="purple" type="submit">
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

export default CourseCreateModal;
