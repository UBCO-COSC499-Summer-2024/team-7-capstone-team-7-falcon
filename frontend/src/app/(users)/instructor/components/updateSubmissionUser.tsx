"use client";

import { useState } from "react";
import { HiOutlinePencil } from "react-icons/hi";
import UpdateSubmissionUserModal from "./updateSubmissionUserModal";

interface UpdateSubmissionUserProps {
  courseId: number;
  submissionId: number;
}

const UpdateSubmissionUser: React.FC<UpdateSubmissionUserProps> = ({
  courseId,
  submissionId,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div>
      {modalOpen && (
        <UpdateSubmissionUserModal
          onClose={handleModal}
          courseId={courseId}
          submissionId={submissionId}
        />
      )}
      <button
        className="btn-primary flex align-middle justify-center space-x-3 rounded-xlg w-full py-3"
        onClick={() => handleModal()}
      >
        <HiOutlinePencil size={20} />
        <span>Update Submission Details</span>
      </button>
    </div>
  );
};

export default UpdateSubmissionUser;
