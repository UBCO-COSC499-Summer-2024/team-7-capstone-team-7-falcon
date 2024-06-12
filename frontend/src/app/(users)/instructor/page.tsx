"use client"
import React from "react";
import { useState } from "react";
import { Button} from "flowbite-react";
import CourseCreateModal from "./components/createCourse";

/**
 * Renders the Instructor Courses component.
 * This component could be merged with the Student component depending on further implementation.
 * @component
 * @returns TSX Element
 */
const InstructorCourses: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div>
      <h1>Instructor Courses</h1>
      <Button onClick={() => setModalOpen(true)}>Create course</Button>
      <CourseCreateModal isOpen={modalOpen} closeModal={() => setModalOpen(false)} />
    </div>
  );
};

export default InstructorCourses;
