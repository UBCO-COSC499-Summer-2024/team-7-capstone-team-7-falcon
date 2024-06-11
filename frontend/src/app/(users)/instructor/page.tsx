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
    <div className="flex justify-between">
      <h1 className="text-3xl font-bold">Managed Courses</h1>
      <Button color="purple" onClick={() => setModalOpen(true)} className="flex align-right">Create course</Button>
      <CourseCreateModal isOpen={modalOpen} closeModal={() => setModalOpen(false)} />
    </div>
  );
};

export default InstructorCourses;
