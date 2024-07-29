"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { coursesAPI } from "@/app/api/coursesAPI";
import toast from "react-hot-toast";

interface DeleteUserFormProps {
  courseId: number;
  userId: number;
}

const DeleteUserForm: React.FC<DeleteUserFormProps> = ({
  courseId,
  userId,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      await coursesAPI.removeStudentFromCourse(courseId, userId);
      toast.success("User successfully removed from course");
      router.push(`/instructor/course/${courseId}/people`);
    } catch (error) {
      console.error("Error:", error);
      if (error.message) {
        toast.error(`Failed to remove user: ${error.message}`);
      } else {
        toast.error("Failed to remove user from course");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Remove User from Course</h2>
      <p>Are you sure you want to remove this user from the course?</p>
      <button
        onClick={handleDeleteUser}
        className="btn-primary mt-4"
        disabled={isDeleting}
      >
        {isDeleting ? "Removing..." : "Confirm Removal"}
      </button>
    </div>
  );
};

export default DeleteUserForm;
