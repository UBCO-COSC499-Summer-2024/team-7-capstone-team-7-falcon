import React from "react";
import { Dropdown, Button, TextInput, Modal, Label } from "flowbite-react";

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
    <Modal show={isOpen} size="md" popup dismissible position={"center"} onClose={() => closeModal()}>
        <Modal.Header>Create a new Course</Modal.Header>
        <Modal.Body>
          
        </Modal.Body>
      </Modal>
  );
};

export default CourseCreateModal;
