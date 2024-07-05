"use client";
import { useState } from "react";
import { CourseData } from "../../../typings/backendDataTypes";
import { Modal } from "flowbite-react";
import { Status } from "../../../typings/backendDataTypes";
import { coursesAPI } from "../../../api/coursesAPI";
import ModalMessage from "../../components/modalMessage";

const JoinCourseModal: React.FC<{
  courseData: CourseData;
  inviteCode: string;
}> = ({ courseData, inviteCode }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [status, setStatus] = useState(Status.Pending);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const enroll = () => {
    coursesAPI
      .enrollCourse(courseData.id as number, inviteCode)
      .then((response) => {
        if (!response || response.status != 200) {
          setStatus(Status.WrongCode);
        } else {
          setStatus(Status.Success);
        }
        toggleModal();
        return response;
      })
      .catch((error) => {
        setStatus(Status.Failure);
        toggleModal();
        return error;
      });
  };

  return (
    <>
      {status === Status.Success && (
        <ModalMessage message={"You have been enrolled."} />
      )}
      {status === Status.Failure && (
        <ModalMessage message={"Error joining class"} />
      )}
      {status === Status.WrongCode && (
        <ModalMessage message={"Invalid invite code"} />
      )}
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
              onClick={toggleModal}
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
