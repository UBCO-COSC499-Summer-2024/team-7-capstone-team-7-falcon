"use client";

import React, { useState, useEffect } from "react";
import { usersAPI } from "@/app/api/usersAPI";
import { coursesAPI } from "@/app/api/coursesAPI";
import toast from "react-hot-toast";
import { User } from "@/app/typings/backendDataTypes";
import { useRouter } from "next/navigation";
import Avatar from "../../../components/avatar";

interface DeleteUserFormProps {
  courseId: number;
  userId: number;
}

const DeleteUserForm: React.FC<DeleteUserFormProps> = ({
  courseId,
  userId,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

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
      router.push(`/instructor/course/${courseId}/people`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to remove user from course");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="space-y-4 p-4 ring ring-gray-100 rounded-md flex flex-col">
        <div className="flex flex-col items-center">
          <Avatar
            avatarUrl={userData.avatar_url ?? undefined}
            firstName={userData.first_name}
            lastName={userData.last_name ?? ""}
            imageWidth={200}
            imageHeight={200}
            imageTextWidth="w-48"
            imageTextHeight="h-48"
            textSize={4}
          />
        </div>
        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold mb-2">
            {userData.first_name} {userData.last_name}
          </h2>
          <p className="text-lg">{userData.role}</p>
          <p className="text-lg">{userData.email}</p>
        </div>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6">
          <p className="font-bold">Warning</p>
          <p>Are you sure you want to remove this user from the course?</p>
        </div>
        <button
          onClick={handleDeleteUser}
          className="btn-primary mt-4"
          disabled={isDeleting}
        >
          {isDeleting ? "Removing..." : "Confirm Removal"}
        </button>
      </div>
    </div>
  );
};

export default DeleteUserForm;
