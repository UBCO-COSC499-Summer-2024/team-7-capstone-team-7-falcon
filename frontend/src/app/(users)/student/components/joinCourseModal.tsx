"use client";
import { useState } from "react";
import { CourseData } from "../../../typings/backendDataTypes";
import { Modal } from "flowbite-react";
import { coursesAPI } from "../../../api/coursesAPI";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const JoinCourseModal: React.FC<{
  courseData: CourseData;
  inviteCode: string;
}> = ({ courseData, inviteCode }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();

  const redirectOnClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      router.push("/student");
    }, 500);
  };

  const enroll = () => {
    coursesAPI
      .enrollCourse(courseData.id as number, inviteCode)
      .then((response) => {
        toast.success("You have been enrolled!");
        setTimeout(() => {
          router.push("/student");
        }, 1000);
        return response;
      })
      .catch((error) => {
        if (error.response.status == 400) {
          toast.error("Invalid invite code");
        } else {
          toast.error("Error joining class");
        }

        setTimeout(() => {
          router.push("/student");
        }, 1000);
        return error;
      });
  };

  return (
    <>
      <Toaster />
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>
          <div className="flex items-center justify-between p-2 rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              You have been invited to {courseData.course_code}!
            </h3>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="p-4 space-y-4">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Class Name: {courseData.course_name}
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Class Section: {courseData.section_name}
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Course Code: {courseData.course_code}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex items-center p-2 border-gray-200 rounded-b dark:border-gray-600">
            <button onClick={enroll} type="button" className="btn-primary">
              Join Course
            </button>
            <button
              onClick={redirectOnClose}
              type="button"
              className="btn-secondary"
            >
              Decline
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default JoinCourseModal;
