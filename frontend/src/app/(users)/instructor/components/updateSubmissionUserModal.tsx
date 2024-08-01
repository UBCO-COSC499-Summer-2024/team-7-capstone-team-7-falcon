"use client";

import { examsAPI } from "@/app/api/examAPI";
import { Label, Modal, TextInput } from "flowbite-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface UpdateSubmissionUserModalProps {
  courseId: number;
  submissionId: number;
  onClose: () => void;
}

const UpdateSubmissionUserModal: React.FC<UpdateSubmissionUserModalProps> = ({
  courseId,
  submissionId,
  onClose,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [studentId, setStudentId] = useState<string>("");

  const handleClose = () => {
    setIsModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await examsAPI.updateSubmissionStudent(
      courseId,
      submissionId,
      +studentId,
    );

    if (response && response.status === 204) {
      toast.success("Submission details updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      toast.error(response.response.data.message);
    }
  };

  return (
    <Modal show={isModalOpen} onClose={() => handleClose()}>
      <Modal.Header>
        <h2 className="text-lg font-bold">Update Submission Details</h2>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <Label htmlFor="student-id" value="Student ID" />
            <TextInput
              id="student-id"
              type="text"
              placeholder="Enter new student ID"
              onChange={(e) => setStudentId(e.target.value)}
              theme={{
                field: {
                  input: {
                    colors: {
                      gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-purple-500 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-purple-500 dark:focus:ring-purple-500",
                    },
                  },
                },
              }}
            />
            <button type="submit" className="btn-primary w-full mt-10">
              Save
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateSubmissionUserModal;
