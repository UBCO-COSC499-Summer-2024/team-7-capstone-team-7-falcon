"use client";
import React from "react";
import { useState } from "react";
import { Button, Modal } from "flowbite-react";
import CourseGrid from "../components/courseGrid";
import CourseCreator from "./components/courseCreateForm/courseCreateForm";

/**
 * Represents the InstructorCourses component.
 * This component displays a list of managed courses for an instructor.
 * Also gives ability to create a new course
 *
 * @component
 */
const InstructorCourses: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  /**
   * Closes the course creation modal.
   */
  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div>
      <div className="flex justify-between p-5">
        <h1 className="text-2xl font-bold">Managed Courses</h1>
        <Button
          color="purple"
          onClick={() => setModalOpen(true)}
          className="flex align-right"
        >
          Create Course
        </Button>
        <Modal
          show={modalOpen}
          size="lg"
          popup
          position={"center"}
          onClose={() => closeModal()}
        >
          <Modal.Header className="pl-2 pt-2">Create a new Course</Modal.Header>
          <Modal.Body className="mt-2">
            <CourseCreator onSubmission={() => closeModal()} />
          </Modal.Body>
        </Modal>
      </div>
      <div>
        <CourseGrid />
      </div>
    </div>
  );
};

export default InstructorCourses;
