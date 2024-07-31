"use client";

import { HiFlag } from "react-icons/hi";
import React, { useState } from "react";
import ReportIssueModal from "./reportIssueModal";

interface ReportSubmissionIssueProps {
  submissionId: number;
  courseId: number;
}

const ReportSubmissionIssue: React.FC<ReportSubmissionIssueProps> = ({
  submissionId,
  courseId,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div>
      {modalOpen && (
        <ReportIssueModal
          onClose={handleModal}
          courseId={courseId}
          submissionId={submissionId}
        />
      )}
      <p className="mt-8 text-xl font-bold">Additional Actions</p>
      <button
        className="btn-primary flex align-middle justify-center space-x-3 rounded-xlg mt-4 w-full"
        onClick={() => handleModal()}
      >
        <HiFlag size={20} />
        <span>Report an issue</span>
      </button>
    </div>
  );
};

export default ReportSubmissionIssue;
