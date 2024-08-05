"use client";

import React, { useState, useEffect } from "react";
import { coursesAPI } from "../../../../../api/coursesAPI";
import {
  Course,
  SelectedButton,
} from "../../../../../typings/backendDataTypes";
import CourseHeader from "../../../components/courseHeader";
import PeopleTable from "../../../components/PeopleTable";
import Link from "next/link";
import { ArrowLeft } from "flowbite-react-icons/outline";
import EditCourseButton from "../../../components/editCourseButton";
import DeleteUserModal from "../../../components/deleteUserModal";
import { Toaster, toast } from "react-hot-toast";

const PeoplePage = ({ params }: { params: { courseId: string } }) => {
  const cid = Number(params.courseId);
  const [course, setCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [studentNameDetails, setStudentNameDetails] = useState<string | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger re-render

  // Fetch course data on mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const fetchedCourse = await coursesAPI.getCourse(cid);
        setCourse(fetchedCourse);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [cid]);

  // Open the modal and set selected user ID
  const handleOpenModal = (userId: number, studentName: string) => {
    if (userId == null || userId == undefined) {
      toast.error("User ID is missing or invalid");
      return;
    }
    setSelectedUserId(userId);
    setStudentNameDetails(studentName);
    setIsModalOpen(true);
  };

  // Close the modal and clear selected user ID
  const handleCloseModal = () => {
    setSelectedUserId(null);
    setIsModalOpen(false);
    setRefreshKey((prevKey) => prevKey + 1); // Update the refresh key to trigger re-render
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Toaster />
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <CourseHeader
            course_code={course.course_code}
            course_desc={course.course_name}
            course_id={course.id}
            selected={SelectedButton.People}
          />
        </div>
        <div className="justify-self-end space-y-4">
          <div className="col-span-1 justify-self-end space-y-4">
            <EditCourseButton courseId={Number(params.courseId)} />
          </div>
          <button type="button" className="btn-primary block w-full">
            <Link
              href={`../${course.id}/exam`}
              className="space-x-4 flex items-center"
            >
              <ArrowLeft />
              Back
            </Link>
          </button>
        </div>
        <div className="mt-4 col-span-2">
          <PeopleTable
            key={refreshKey}
            course_id={cid}
            onRemoveClick={handleOpenModal}
          />
        </div>
      </div>
      {/* Conditionally render the modal */}
      {selectedUserId !== null && (
        <DeleteUserModal
          courseId={cid}
          userId={selectedUserId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          studentNameDetails={studentNameDetails}
        />
      )}
    </div>
  );
};

export default PeoplePage;
