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
    <Modal show={isOpen} size="lg" popup dismissible position={"center"} onClose={() => closeModal()}>
        <Modal.Header><h1 className="pl-2 pt-2">Create a new Course</h1></Modal.Header>
        <Modal.Body>
          <form>
            <Label htmlFor="courseCode">Course Code</Label>
            <TextInput id="courseCode" placeholder="Enter course Code" required/>
            <Label htmlFor="courseName">Course Name</Label>
            <TextInput id="courseName" placeholder="Enter course name" required/>
            <Label htmlFor="courseSection">Course Section</Label>
            <TextInput id="courseSection" placeholder="Enter course Section" required/>
            <Label htmlFor="courseSemester">Semester</Label>
            <Select id="courseSemester" label="Select semester" required>
              {/* Map options here */}
            </Select>
            <Button color="purple" type="submit" className="mt-4">Create Course</Button>
          </form>
        </Modal.Body>
      </Modal>
  );
};

export default CourseCreateModal;
