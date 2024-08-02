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
import DeleteUserModal from "../../../components/deleteUserModal";
import { Toaster } from "react-hot-toast";

const PeoplePage = ({ params }: { params: { courseId: string } }) => {
  const cid = Number(params.courseId);
  const [course, setCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentNameDetails, setStudentNameDetails] = useState<string | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);

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

  const handleOpenModal = (userId: number, studentName: string) => {
    setUserIdToDelete(userId);
    setStudentNameDetails(studentName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserIdToDelete(null);
    setRefreshKey((prevKey) => prevKey + 1);
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
          <button type="button" className="btn-primary block">
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
      {isModalOpen && userIdToDelete !== null && (
        <DeleteUserModal
          courseId={cid}
          userId={userIdToDelete}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          studentNameDetails={studentNameDetails}
        />
      )}
    </div>
  );
};

export default PeoplePage;
