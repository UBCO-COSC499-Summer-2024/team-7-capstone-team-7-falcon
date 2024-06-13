import React from "react";
import CourseCard from "./courseCard";

const CourseGrid: React.FC = () => {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <CourseCard
          courseCode="COSC 111"
          courseName="Introduction to Computer Science"
          courseRole="instructor"
        />
        <CourseCard
          courseCode="COSC 111"
          courseName="Introduction to Computer Science"
          courseRole="instructor"
        />
        <CourseCard
          courseCode="COSC 111"
          courseName="Introduction to Computer Science"
          courseRole="instructor"
        />
        <CourseCard
          courseCode="COSC 111"
          courseName="Introduction to Computer Science"
          courseRole="instructor"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <CourseCard
          courseCode="COSC 111"
          courseName="Introduction to Computer Science"
          courseRole="instructor"
        />
        <CourseCard
          courseCode="COSC 111"
          courseName="Introduction to Computer Science"
          courseRole="instructor"
        />
        <CourseCard
          courseCode="COSC 111"
          courseName="Introduction to Computer Science"
          courseRole="instructor"
        />
      </div>
    </div>
  );
};

export default CourseGrid;
