import React from "react";
import { Toaster } from "react-hot-toast";
import DeleteUserForm from "../../../../components/deleteUserForm";

const DeleteUserPage = ({
  params,
}: {
  params: { courseId: string; userId: string };
}) => {
  const courseId = Number(params.courseId);
  const userId = Number(params.userId);

  if (isNaN(courseId) || isNaN(userId)) {
    return <p>Invalid course or user ID</p>;
  }

  return (
    <div>
      <div className="mt-2">
        <h2 className="text-2xl font-bold mb-4">Delete User</h2>
        <hr />
      </div>
      <Toaster />
      <DeleteUserForm courseId={courseId} userId={userId} />
    </div>
  );
};

export default DeleteUserPage;
