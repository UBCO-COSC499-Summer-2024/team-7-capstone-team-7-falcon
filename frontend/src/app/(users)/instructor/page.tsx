"use client";
import React from "react";
import { useState } from "react";
import { Button } from "flowbite-react";
import CourseCreatorModal from "./components/courseFormModal";
import CourseGrid from "../components/courseGrid";

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
      <div className="flex justify-between p-5">
        <h1 className="text-2xl font-bold">Managed Courses</h1>
        <Button
          color="purple"
          onClick={() => setModalOpen(true)}
          className="flex align-right"
        >
          Create course
        </Button>
        <CourseCreatorModal
          isOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
        />
      </div>
      <div>
        <CourseGrid />
      </div>
    </div>
  );
};

export default InstructorCourses;
