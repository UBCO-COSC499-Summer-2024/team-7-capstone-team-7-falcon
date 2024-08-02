"use client";

import React, { useState } from "react";
import { coursesAPI } from "@/app/api/coursesAPI";
import toast from "react-hot-toast";
import { Modal, Alert } from "flowbite-react";

interface DeleteUserModalProps {
  courseId: number;
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  studentNameDetails: string | null;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  courseId,
  userId,
  isOpen,
  onClose,
  studentNameDetails,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      await coursesAPI.removeStudentFromCourse(courseId, userId);
      toast.success("User successfully removed from course");
      onClose();
    } catch (error) {
      toast.error("Failed to remove user from course");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>
        <div>Remove Student from Course</div>
      </Modal.Header>
      <Modal.Body>
        <Alert color="purple" rounded className="mb-4">
          <p>
            Are you sure you want to remove{" "}
            <strong>{studentNameDetails}</strong> from the course? This action
            cannot be undone.
          </p>
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn-primary w-full"
          onClick={handleDeleteUser}
          disabled={isDeleting}
        >
          {isDeleting ? "Removing..." : "Remove User"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteUserModal;
