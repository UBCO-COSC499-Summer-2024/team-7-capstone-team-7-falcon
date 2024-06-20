"use client";
import React from "react";
import { useState } from "react";
import CourseGrid from "../components/courseGrid";
import { Toaster } from "react-hot-toast";
/**
 * Renders the StudentCourses component.
 * This component displays a list of joined courses for a student.
 * @component
 * @returns TSX Element
 */
const StudentCourses: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between p-5">
        <Toaster />
        <h1 className="text-2xl font-bold">Joined Courses</h1>
      </div>
      <div>
        <CourseGrid />
      </div>
    </div>
  );
};

export default StudentCourses;
