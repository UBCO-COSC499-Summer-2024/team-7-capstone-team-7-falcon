"use client";

import React, { useState, useEffect } from "react";
import { usersAPI } from "@/app/api/usersAPI";
import { coursesAPI } from "@/app/api/coursesAPI";
import toast from "react-hot-toast";
import { Modal, Alert } from "flowbite-react";

interface DeleteUserModalProps {
  courseId: number;
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  courseId,
  userId,
  isOpen,
  onClose,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const fetchUserData = async () => {
    try {
      const user = await usersAPI.getUserDetails();
      setUserData(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    }
  };

  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      await coursesAPI.removeStudentFromCourse(courseId, userId);
      toast.success("User successfully removed from course");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to remove user from course");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>
        <h2 className="text-lg font-bold">Remove User</h2>
      </Modal.Header>
      <Modal.Body>
        <Alert color="purple" rounded className="mb-4">
          <p>
            Are you sure you want to remove{" "}
            <strong>
              {userData.first_name} {userData.last_name}
            </strong>{" "}
            from the course? This action cannot be undone.
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
        <button className="w-full btn-primary" onClick={onClose}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteUserModal;
