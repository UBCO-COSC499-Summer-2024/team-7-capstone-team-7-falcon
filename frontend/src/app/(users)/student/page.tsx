"use client";
import React from "react";
import { useState } from "react";
import { Button, Modal } from "flowbite-react";
import CourseGrid from "../components/courseGrid";
import { Toaster } from "react-hot-toast";
/**
 * Renders the StudentCourses component.
 * This component displays a list of joined courses for a student.
 * @component
 * @returns TSX Element
 */
const StudentCourses: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  /**
   * Closes the join course modal.
   */
  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div>
      <div className="flex justify-between p-5">
        <Toaster />
        <h1 className="text-2xl font-bold">Joined Courses</h1>
        <Button
          color="purple"
          onClick={() => setModalOpen(true)}
          className="flex align-right"
        >
          Join Course
        </Button>
        <Modal
          show={modalOpen}
          size="lg"
          popup
          position={"center"}
          onClose={() => closeModal()}
        >
          <Modal.Header className="pl-2 pt-2">Join a new Course</Modal.Header>
          <Modal.Body className="mt-2">
            {/* <CourseCreator onSubmission={() => closeModal()} /> */}
          </Modal.Body>
        </Modal>
      </div>
      <div>
        <CourseGrid />
      </div>
    </div>
  );
};

export default StudentCourses;
